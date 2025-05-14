import openai
import json
import time
import asyncio
from typing import Any # Import Any for context typing
import os
from datetime import datetime
import re # Import regex
import pretty_midi # Import for exec context
import random # Import for exec context
import numpy as np
import soundfile as sf
import sounddevice as sd
import websocket
import threading
from queue import Queue, Empty
import subprocess
import tempfile

from agents import Agent, Runner, ModelSettings, function_tool, RunContextWrapper
# Removed: from agents.result import Result

import prompts
import state_manager

# Import only necessary tool and Pydantic model
# from midi_writer import mutate_loop_impl, mutate_loop, MutationParams
from midi_player import _play_midi_impl  # Import the direct playback function
# from audio_analyzer import analyze_audio, analyze_audio_gpt4o
from criteria_agent import get_genre_evaluation_criteria, get_style_rules
from fancy_spinner import SimpleSpinner

# Define a simple context object (can be expanded)
class MusicContext:
    def __init__(self, soundfont_path: str):
        self.soundfont_path = soundfont_path


class MusicAgent:
    # Update __init__ signature
    def __init__(self, api_key: str, soundfont_path: str, style: str):
        self.api_key = api_key
        self.soundfont_path = soundfont_path
        self.style = style
        
        # Create a unique directory for this run
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.run_dir = os.path.join("runs", f"run_{timestamp}")
        os.makedirs(self.run_dir, exist_ok=True)
        print(f"[init] Created run directory: {self.run_dir}")
        
        # Always start with a fresh memory for each run
        self.memory = {'iterations': [], 'style': self.style, 'run_dir': self.run_dir}
        # If you want to allow warm restarts, use: state_manager.load_state() or ...
        openai.api_key = api_key

        # Get genre-specific evaluation criteria
        print(f"[criteria] Getting evaluation criteria for genre: {self.style}")
        self.criteria = get_genre_evaluation_criteria(self.style, self.api_key)
        print(f"[criteria] Using criteria: {self.criteria}")
        
        # Get style-specific guardrails
        self.style_rules = get_style_rules(self.style)
        print(f"[style] Loaded style-specific guardrails for: {self.style}")

        # System prompt now includes instrument list directly from prompts.py
        # formatted_system_prompt = prompts.system_prompt.format(style=self.style) # No longer needed

        self.agent = Agent[
            MusicContext
        ]( # Specify context type for the agent
            name="Music Composer",
            instructions=prompts.system_prompt, # Use the prompt directly
            model="gpt-4.1", # Adjusted model name
            tools=[] 
        )

    def _extract_code_block(self, agent_response_content):
        match = re.search(r"<CODE>(.*?)</CODE>", agent_response_content, re.DOTALL | re.IGNORECASE)
        if not match:
            raise ValueError("No <CODE>...</CODE> block found in agent response.")
        return match.group(1).strip()

    def _execute_code(self, code, output_path, timeout=15):
        with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False) as f:
            f.write(code)
            code_path = f.name
        env = os.environ.copy()
        env['OUTPUT_PATH'] = output_path
        try:
            result = subprocess.run(
                ['python', code_path],
                capture_output=True,
                text=True,
                timeout=timeout,
                env=env
            )
            if result.returncode != 0:
                raise RuntimeError(f"Code execution failed: {result.stderr}")
            if not os.path.exists(output_path):
                raise FileNotFoundError(f"Expected output file not created: {output_path}")
        finally:
            os.remove(code_path)

    async def _run_single_iteration(self, iteration_num):
        print(f"\n--- Iteration {iteration_num} ---")
        midi_output_path = os.path.join(self.run_dir, f"loop_{iteration_num}.mid")
        wav_output_path = os.path.join(self.run_dir, f"loop_{iteration_num}.wav")
        agent_action_prompt = None
        if iteration_num == 1:
            # Special prompt for first pass: one instrument, simple motif, and colorful stylistic suggestions
            # Now with more integrated style guidelines
            agent_action_prompt = f"""
{prompts.compose_prompt_template.format(style=self.style)}

IMPORTANT: For this first iteration, use only one instrument (e.g., piano, bass, or drums). Do not add harmony, chords, or additional instruments. Focus on a clear, memorable motif or rhythm. Make it catchy, clear, and easy to follow.

STYLISTIC GUIDELINES FOR {self.style.upper()}:
{self.style_rules}

Remember these are stylistic suggestions, not rigid requirements. Feel free to explore creatively within these general guidelines.
"""
        else:
            last_midi_path = self.memory['iterations'][-1].get('midi_path') if iteration_num > 1 else None
            last_iteration = self.memory['iterations'][-1]
            analysis_data = last_iteration.get('analysis', {})
            previous_code = last_iteration.get('python_code', '# No code from previous iteration found')
            if isinstance(analysis_data, dict):
                analysis_str = "\n".join([f"- {key.replace('_', ' ').title()}: {value}" for key, value in analysis_data.items()])
            else:
                analysis_str = str(analysis_data)
            analysis_str = f"CURRENT ITERATION: {iteration_num}\n\n" + analysis_str
            
            # More integrated styling guidelines in the mutation prompt
            agent_action_prompt = f"""
{prompts.mutate_prompt_template.format(
    style=self.style,
    analysis=analysis_str,
    midi_path=last_midi_path,
    previous_code=previous_code
)}

When continuing to develop this {self.style} piece, consider these stylistic elements:
{self.style_rules}

These are suggestions to help maintain genre authenticity while you evolve the composition. Feel free to interpret them creatively.
"""
        print(f"[agent] Requesting Python code for composition in style: {self.style}")

        agent_result = None
        tool_name = None
        current_midi_path = None
        agent_response_content = None

        # 1. Agent decides action (Compose or Mutate)
        if iteration_num == 1:
            tool_name = 'new_loop' # Internal flag, not a tool call anymore
            print(f"[agent] Requesting Python code for initial composition in style: {self.style}")
        else:
            tool_name = 'mutate_loop'
            print(f"[agent] Requesting mutation for ITERATION {iteration_num} - adding new instrument layer")

        try:
            # Show spinner while LLM is generating code and while code is being executed
            if tool_name == 'new_loop':
                spinner_label = f"ROCK'N'CODE"
                spinner_message = f"Composing {self.style} music with AI..."
            else:
                spinner_label = f"MUTATE"
                spinner_message = f"Enhancing your {self.style} masterpiece..."
                
            print() # Add a newline before starting the spinner for clean drawing
            with SimpleSpinner(spinner_message, max_chars=15, label=spinner_label):
                run_context = MusicContext(soundfont_path=self.soundfont_path)
                agent_result = await Runner.run(
                    self.agent, 
                    agent_action_prompt, 
                    context=run_context
                )
                agent_response_content = agent_result.final_output

                if not agent_response_content:
                    print("[agent] Agent did not return any content. Stopping.")
                    return True

                # --- Code Execution or Tool Call --- 
                current_python_code = None # Variable to store the code for this iteration
                max_retries = 2
                retry_count = 0
                
                while retry_count <= max_retries:
                    try:
                        if tool_name == 'new_loop':
                            python_code = self._extract_code_block(agent_response_content)
                            current_python_code = python_code
                            self._execute_code(python_code, midi_output_path)
                            current_midi_path = midi_output_path
                            break # Success!

                        elif tool_name == 'mutate_loop':
                            python_code = self._extract_code_block(agent_response_content)
                            current_python_code = python_code
                            self._execute_code(python_code, midi_output_path)
                            current_midi_path = midi_output_path
                            break # Success!
                        else:
                            print(f"[agent] Internal error: Unknown tool_name '{tool_name}'")
                            return True # Stop loop, unknown tool
                            
                    except Exception as e:
                        print(f"[agent] Code execution failed (Attempt {retry_count+1}/{max_retries+1}): {e}")
                        retry_count += 1
                        if retry_count > max_retries:
                            print("[agent] Max retries reached. Stopping.")
                            return True # Stop loop
                        
                        if not current_python_code:
                            print("[agent] No code to refactor. Stopping.")
                            return True
                        
                        print("[agent] Attempting to refactor the code...")
                        refactor_prompt = prompts.refactor_prompt_template.format(
                            original_prompt=agent_action_prompt,
                            faulty_code=current_python_code,
                            error_message=str(e)
                        )
                        # Use a simple spinner for refactoring attempt
                        with SimpleSpinner("Refactoring code..."):
                           refactor_result = await Runner.run(
                               self.agent, 
                               refactor_prompt, 
                               context=run_context
                           )
                           agent_response_content = refactor_result.final_output # Update with refactored response
                        
                        # Extract the potentially fixed code for the next loop iteration
                        current_python_code = self._extract_code_block(agent_response_content) # Update for next exec attempt
                        # Note: We need to make sure the outer 'with Spinner' context exits properly
                        # if refactoring happens. We'll rely on the loop continuing.

            # This part is outside the `with Spinner` block but inside the main try
            if not current_midi_path or not os.path.exists(current_midi_path):
                print(f"[agent] Error: Expected output file '{current_midi_path or midi_output_path}' does not exist after processing.")
                return True # Stop loop
            print(f"[agent] MIDI file generated/mutated successfully: {current_midi_path}")
        
        except Exception as e:
            # Catch errors outside the retry loop (e.g., initial Runner.run failure)
            print(f"[agent] Unrecoverable error during agent execution: {e}")
            if agent_response_content:
                print(f"--- Agent Response Content ---\n{agent_response_content}\n----------------------------")
            return True # Stop loop on error

        # 2. Render MIDI to WAV (do not play)
        print(f"[render] Rendering {midi_output_path} to {wav_output_path}...")
        current_audio_path = None
        try:
            current_audio_path = _play_midi_impl(
                midi_path=midi_output_path,
                soundfont_path=self.soundfont_path,
                output_wav=wav_output_path
            )
            if current_audio_path:
                print(f"[render] Rendered audio: {current_audio_path}")
                # Play audio in a background thread
                def play_audio(path):
                    try:
                        import soundfile as sf
                        import sounddevice as sd
                        data, samplerate = sf.read(path)
                        print(f"[Audio] Playing audio: {path}")
                        sd.play(data, samplerate)
                        sd.wait()
                        print(f"[Audio] Audio playback finished.")
                    except Exception as e:
                        print(f"[Audio] Error during audio playback: {e}")
                threading.Thread(target=play_audio, args=(current_audio_path,), daemon=True).start()
            else:
                print(f"[render] Audio rendering failed. Check SoundFont path and errors.")
        except Exception as e:
            print(f"[render] Error during rendering: {e}")

        # --- REMOVED AUDIO ANALYSIS STEP --- 
        # The analysis/feedback is now handled by the realtime_feedback_loop.py
        # using the live WebSocket stream. We will inject the feedback
        # from the loop script into the memory before the next iteration.
        analysis_result = None # Set to None, will be overwritten by feedback loop

        # 4. Update Memory & Save State
        iteration_data = {
            'iteration': iteration_num,
            'prompt': agent_action_prompt,
            'agent_response': agent_response_content,
            'midi_path': current_midi_path,
            'audio_path': current_audio_path,
            'analysis': analysis_result, # Placeholder, will be updated by loop
            'python_code': current_python_code # Store the potentially refactored code
        }
        self.memory['iterations'].append(iteration_data)
        state_manager.save_state(self.memory, os.path.join(self.run_dir, 'agent_state.json'))
        print(f"[state] Saved current state to {os.path.join(self.run_dir, 'agent_state.json')}.")

        # 5. Check Stop Condition (Simplified - relies on feedback loop)
        # The feedback loop will handle external feedback. The agent might stop
        # based on internal errors or reaching max iterations via the loop script.
        # We return False here to let the loop script manage continuation.
        return False # Let the feedback loop decide when to stop

    def run_cli_loop(self):
        # This method might not be the primary way to run anymore,
        # as the realtime_feedback_loop.py handles the iteration and feedback.
        print(f"Starting autonomous music agent loop in style: {self.style}")
        # Make sure SOUNDFONT_PATH is valid before starting loop
        if not self.soundfont_path or not os.path.isfile(self.soundfont_path):
            print(f"\nError: Invalid SoundFont path provided: '{self.soundfont_path}'")
            print("Please ensure the SOUNDFONT_PATH environment variable is set correctly or the default path is valid.")
            return
        # We might want a different entry point if always using the feedback loop
        # For now, keep it, but note its reduced role.
        asyncio.run(self._async_run_loop())

    async def _async_run_loop(self):
         max_iterations = 10  # This is now controlled by the feedback loop script primarily
         start_iteration = 1
         for i in range(start_iteration, start_iteration + max_iterations):
             # The stop condition is now mainly handled by the return value of _run_single_iteration
             # or by the feedback loop itself.
             stop = await self._run_single_iteration(i)
             if stop: # Should generally be False now, unless internal error
                 print("[Agent Loop] _run_single_iteration signaled stop.")
                 break
             time.sleep(1)
         print("\n[Agent Loop] Reached max iterations or stopped.")

    def run_agentic_realtime_loop(self, max_iterations=10):
        for i in range(1, max_iterations + 1):
            print(f"\n=== Iteration {i} ===")
            stop_signal = asyncio.run(self._run_single_iteration(i))
            if stop_signal:
                print("[Agentic Loop] Stopping based on agent's internal logic.")
                break
            state_manager.save_state(self.memory, os.path.join(self.run_dir, 'agent_state.json'))
            print(f"[Agentic Loop] State saved for iteration {i}.")
            time.sleep(1)
        print("\n[Agentic Loop] Finished.")

    async def _retry_prompt(self, original_prompt, context):
        """Helper to retry the LLM call if the initial response was bad."""
        print("[agent] Retrying LLM prompt...")
        retry_result = await Runner.run(self.agent, original_prompt, context=context)
        return retry_result.final_output

# Ensure state_manager can handle custom path
if hasattr(state_manager, 'save_state') and 'file_path' not in state_manager.save_state.__code__.co_varnames:
     print("Warning: state_manager.save_state might not support custom file paths. Adapting...")
     original_save_state = state_manager.save_state
     def save_state_wrapper(state, file_path='agent_state.json'):
         # This is a basic wrapper, might need adjustment based on actual save_state implementation
         # Assumes original save_state only takes state and uses a hardcoded path.
         # A better solution is to modify state_manager.py directly.
         original_path = 'agent_state.json' # Or whatever the original hardcoded path was
         if file_path != original_path:
             # Temporarily change working dir? Or modify how save_state finds its path?
             # Simplest fragile approach: Copy after saving to default
             original_save_state(state)
             if os.path.exists(original_path):
                 import shutil
                 shutil.copy(original_path, file_path)
                 os.remove(original_path) # Clean up original if copied
             else:
                  print(f"Warning: Could not copy state file from {original_path}")
         else:
              original_save_state(state)
     state_manager.save_state = save_state_wrapper 