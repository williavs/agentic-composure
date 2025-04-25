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

from agents import Agent, Runner, ModelSettings, function_tool, RunContextWrapper
# Removed: from agents.result import Result

import prompts
import state_manager

# Import only necessary tool and Pydantic model
from midi_writer import mutate_loop_impl, mutate_loop, MutationParams
from midi_player import _play_midi_impl  # Import the direct playback function
# from audio_analyzer import analyze_audio, analyze_audio_gpt4o
from criteria_agent import get_genre_evaluation_criteria
from fancy_spinner import SimpleSpinner

# Define a simple context object (can be expanded)
class MusicContext:
    def __init__(self, soundfont_path: str):
        self.soundfont_path = soundfont_path

# UNDERTALE instrument mapping for authenticity (program numbers and detuning)
UNDERTALE_INSTRUMENT_MAP = {
    # Example entries; expand as needed for full coverage
    'Undertale Piano': {'program': 0, 'detune': 0},
    'Acoustic Bass': {'program': 32, 'detune': -2},
    'Fretless Bass': {'program': 35, 'detune': 0},
    'Glockenspiel': {'program': 9, 'detune': -4},
    'Strings': {'program': 48, 'detune': -4},
    'Piano 1': {'program': 0, 'detune': 5},
    'Violin': {'program': 40, 'detune': 0},
    'Saxophone': {'program': 65, 'detune': 0},
    'Trumpet': {'program': 56, 'detune': 0},
    # ... add more mappings as needed ...
}

def get_undertale_instrument_info(name):
    """Return program number and detune for a given instrument name, or defaults if not found."""
    info = UNDERTALE_INSTRUMENT_MAP.get(name)
    if info:
        return info['program'], info['detune']
    return 0, 0  # Default to program 0, no detune

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

        # System prompt now includes instrument list directly from prompts.py
        # formatted_system_prompt = prompts.system_prompt.format(style=self.style) # No longer needed

        self.agent = Agent[
            MusicContext
        ]( # Specify context type for the agent
            name="Music Composer",
            instructions=prompts.system_prompt, # Use the prompt directly
            model="gpt-4.1", # Adjusted model name
            tools=[mutate_loop] 
        )

    async def _run_single_iteration(self, iteration_num):
        print(f"\n--- Iteration {iteration_num} ---")

        # Determine unique paths for this iteration
        midi_output_path = os.path.join(self.run_dir, f"loop_{iteration_num}.mid")
        wav_output_path = os.path.join(self.run_dir, f"loop_{iteration_num}.wav")
        last_midi_path = self.memory['iterations'][-1].get('midi_path') if iteration_num > 1 else None
        
        agent_result = None
        agent_action_prompt = ""
        tool_name = None
        current_midi_path = None
        agent_response_content = None

        # 1. Agent decides action (Compose or Mutate)
        if iteration_num == 1:
            agent_action_prompt = prompts.compose_prompt_template.format(style=self.style)
            tool_name = 'new_loop' # Internal flag, not a tool call anymore
            print(f"[agent] Requesting Python code for initial composition in style: {self.style}")
        else:
            last_iteration = self.memory['iterations'][-1]
            analysis_data = last_iteration.get('analysis', {})
            previous_code = last_iteration.get('python_code', '# No code from previous iteration found')
            # Format analysis data for the prompt
            if isinstance(analysis_data, dict):
                analysis_str = "\n".join([f"- {key.replace('_', ' ').title()}: {value}" for key, value in analysis_data.items()])
            else: # Handle case where analysis might be a string (e.g., error message)
                analysis_str = str(analysis_data)
            
            # Add iteration number explicitly to the analysis so the agent knows which instrument to add
            analysis_str = f"CURRENT ITERATION: {iteration_num}\n\n" + analysis_str
            
            agent_action_prompt = prompts.mutate_prompt_template.format(
                style=self.style,
                analysis=analysis_str, # Pass formatted analysis with iteration number
                midi_path=last_midi_path,
                previous_code=previous_code # Pass the previous code here
            )
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
                            match = re.search(r"<CODE>(.*?)</CODE>", agent_response_content, re.DOTALL | re.IGNORECASE)
                            if not match:
                                print(f"[agent] Error: No <CODE>...</CODE> block found. Retrying prompt if possible ({retry_count}/{max_retries})")
                                if retry_count == max_retries: return True
                                agent_response_content = await self._retry_prompt(agent_action_prompt, run_context)
                                retry_count += 1
                                continue
                            python_code = match.group(1).strip()
                            current_python_code = python_code
                            execution_globals = {"pretty_midi": pretty_midi, "random": random, "os": os, "np": np, "__builtins__": { 'print': print, 'range': range, 'len': len, 'max': max, 'min': min, 'round': round, 'list': list, 'dict': dict, 'str': str, 'int': int, 'float': float, 'bool': bool, 'None': None, '__import__': __import__, 'enumerate': enumerate, 'zip': zip, 'map': map, 'filter': filter, 'abs': abs, 'sum': sum, 'any': any, 'all': all, 'sorted': sorted, 'tuple': tuple, 'set': set, }, 'get_undertale_instrument_info': get_undertale_instrument_info }
                            execution_locals = {"output_path": midi_output_path}
                            exec(python_code, execution_globals, execution_locals)
                            if not os.path.exists(midi_output_path):
                                raise FileNotFoundError(f"Code execution did not create the expected file: {midi_output_path}")
                            current_midi_path = midi_output_path
                            break # Success!

                        elif tool_name == 'mutate_loop':
                            match_code = re.search(r"<CODE>(.*?)</CODE>", agent_response_content, re.DOTALL | re.IGNORECASE)
                            if match_code:
                                python_code = match_code.group(1).strip()
                                current_python_code = python_code
                                execution_globals = {"pretty_midi": pretty_midi, "random": random, "os": os, "np": np, "__builtins__": { 'print': print, 'range': range, 'len': len, 'max': max, 'min': min, 'round': round, 'list': list, 'dict': dict, 'str': str, 'int': int, 'float': float, 'bool': bool, 'None': None, '__import__': __import__, 'enumerate': enumerate, 'zip': zip, 'map': map, 'filter': filter, 'abs': abs, 'sum': sum, 'any': any, 'all': all, 'sorted': sorted, 'tuple': tuple, 'set': set, }, 'get_undertale_instrument_info': get_undertale_instrument_info }
                                execution_locals = {"output_path": midi_output_path, "midi_path": last_midi_path}
                                exec(python_code, execution_globals, execution_locals)
                                if not os.path.exists(midi_output_path):
                                    raise FileNotFoundError(f"Code execution did not create the expected file: {midi_output_path}")
                                current_midi_path = midi_output_path
                                break # Success!
                            else:
                                # Fallback to PARAM PARAMS if no CODE block
                                match_params = re.search(r"<PARAMS>(.*?)</PARAMS>", agent_response_content, re.DOTALL | re.IGNORECASE)
                                if not match_params:
                                    print(f"[agent] Error: No <CODE> or <PARAMS> block found. Retrying prompt if possible ({retry_count}/{max_retries})")
                                    if retry_count == max_retries: return True
                                    agent_response_content = await self._retry_prompt(agent_action_prompt, run_context)
                                    retry_count += 1
                                    continue
                                params_str = match_params.group(1).strip()
                                try:
                                    params = json.loads(params_str)
                                except json.JSONDecodeError as e:
                                    print(f"[agent] Error parsing JSON <PARAMS>: {e}. Retrying prompt if possible ({retry_count}/{max_retries})")
                                    if retry_count == max_retries: return True
                                    agent_response_content = await self._retry_prompt(agent_action_prompt, run_context)
                                    retry_count += 1
                                    continue
                                params['output_path'] = midi_output_path
                                params['midi_path'] = last_midi_path
                                print(f"[agent] Calling mutate_loop_impl with: {params}")
                                params_obj = MutationParams(**params)
                                current_midi_path = mutate_loop_impl(params_obj)
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
                        match_refactored = re.search(r"<CODE>(.*?)</CODE>", agent_response_content, re.DOTALL | re.IGNORECASE)
                        if match_refactored:
                            current_python_code = match_refactored.group(1).strip() # Update for next exec attempt
                            # Note: We need to make sure the outer 'with Spinner' context exits properly
                            # if refactoring happens. We'll rely on the loop continuing.
                        else:
                            print("[agent] Refactoring failed to produce code. Stopping.")
                            return True # Stop loop

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
        print(f"[render] Rendering {current_midi_path} to {wav_output_path}...")
        current_audio_path = None
        try:
            current_audio_path = _play_midi_impl(
                midi_path=current_midi_path, 
                soundfont_path=self.soundfont_path,
                output_wav=wav_output_path # Pass unique WAV path
            )
            if current_audio_path:
                print(f"[render] Rendered audio: {current_audio_path}")
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

    def get_file_feedback(self, audio_path, api_key=None, prompt=None):
        """
        Gets feedback on an audio file using the chained approach:
        1. Transcribe audio file to text using Whisper.
        2. Send the transcript to GPT-4o for analysis using genre criteria.
        """
        if not os.path.exists(audio_path):
            print(f"[Feedback] Audio file not found: {audio_path}")
            return None
        api_key = api_key or self.api_key
        openai.api_key = api_key

        try:
            # Step 1: Transcribe the audio file
            print(f"[Feedback] Transcribing audio file: {audio_path}")
            with open(audio_path, "rb") as audio_file:
                transcription_response = openai.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="en"
                )
            transcript = transcription_response.text if hasattr(transcription_response, 'text') else str(transcription_response)
            print(f"[Feedback] Transcript: '{transcript}'")

            # Step 2: Analyze the transcript with GPT-4o using criteria
            if self.criteria and isinstance(self.criteria, list) and len(self.criteria) == 4:
                criteria_str = "\n".join([f"- {c}" for c in self.criteria])
                system_prompt_content = (
                    f"You are a music critic specializing in {self.style}. "
                    f"Evaluate the provided music loop transcript based on the following 4 criteria. "
                    f"For each, give a score from 0-10 and a short comment. Also provide a brief overall summary.\n\n"
                    f"Criteria:\n{criteria_str}\n\n"
                    f"Focus on rhythm and implied musicality from the transcript, as melody/harmony might be absent or unclear. "
                    f"Return ONLY a valid JSON object with keys: 'criteria_scores' (a list of dicts with 'criterion', 'score', 'comment'), and 'summary'."
                )
                print(f"[Feedback] Using genre criteria for analysis.")
            else:
                print(f"[Feedback] Using generic criteria for analysis (genre criteria missing or invalid).")
                system_prompt_content = prompt or (
                    "You are a music critic. Analyze the provided music loop transcript for tempo, key, instrumentation, and overall musical pleasantness. "
                    "Consider that the transcript might be imperfect or only capture percussive sounds. Focus on the rhythm and implied musicality. "
                    "Return ONLY a valid JSON object with keys: tempo, key, instrumentation, pleasantness, and a brief summary."
                )

            print(f"[Feedback] Sending transcript to GPT-4o for analysis...")
            analysis_response = openai.chat.completions.create(
                model="gpt-4o",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt_content},
                    {"role": "user", "content": transcript or "(No transcript generated - likely silence)"}
                ]
            )
            content = analysis_response.choices[0].message.content
            print("[Feedback] GPT-4o analysis response:", content)
            try:
                json.loads(content)
            except json.JSONDecodeError:
                print("[Feedback] Warning: GPT-4o response is not valid JSON. Returning raw string.")
            return content

        except Exception as e:
            print(f"[Feedback] Error during chained audio analysis: {e}")
            return None

    def run_agentic_realtime_loop(self, max_iterations=10):
        """
        Unified agentic loop: generate/mutate, render, send file for feedback (async), play, inject feedback, repeat.
        """
        for i in range(1, max_iterations + 1):
            print(f"\n=== Iteration {i} ===")
            stop_signal = asyncio.run(self._run_single_iteration(i))
            if stop_signal:
                print("[Agentic Loop] Stopping based on agent's internal logic.")
                break
            last_iter = self.memory['iterations'][-1]
            audio_path = last_iter['audio_path']
            if not audio_path or not os.path.exists(audio_path):
                print(f"[Agentic Loop] No audio file found for iteration {i}, skipping feedback.")
                continue
            print(f"[Agentic Loop] Sending audio file for GPT-4o feedback: {audio_path}")
            feedback_result = {}
            def feedback_task():
                feedback = self.get_file_feedback(audio_path)
                feedback_result['feedback'] = feedback
            feedback_thread = threading.Thread(target=feedback_task)
            feedback_thread.start()
            # Play audio while feedback is processing
            try:
                import soundfile as sf
                import sounddevice as sd
                data, samplerate = sf.read(audio_path)
                print(f"[Agentic Loop] Playing audio: {audio_path}")
                sd.play(data, samplerate)
                sd.wait()
                print(f"[Agentic Loop] Audio playback finished.")
            except Exception as e:
                print(f"[Agentic Loop] Error during audio playback: {e}")
            # Wait for feedback to finish if not done
            feedback_thread.join()
            feedback = feedback_result.get('feedback')
            if feedback:
                feedback_dict = {"gpt4o_file_feedback": feedback}
                self.memory['iterations'][-1]['analysis'] = feedback_dict
                print(f"[Agentic Loop] Injected file feedback.")
            else:
                print("[Agentic Loop] No feedback received from GPT-4o.")
            # Save state after feedback
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