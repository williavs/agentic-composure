from midi2audio import FluidSynth
import sounddevice as sd
import soundfile as sf
from agents import function_tool
import os
import time
import subprocess
import platform

def play_system_midi(midi_path):
    """Play MIDI file using the system's default MIDI player."""
    system = platform.system()
    try:
        if system == 'Darwin':  # macOS
            subprocess.run(['open', midi_path], check=True)
            return True
        elif system == 'Windows':
            os.startfile(midi_path)  # Windows-specific
            return True
        elif system == 'Linux':
            subprocess.run(['xdg-open', midi_path], check=True)
            return True
        else:
            print(f"Unsupported operating system: {system}")
            return False
    except Exception as e:
        print(f"Error playing MIDI with system player: {e}")
        return False

def _play_midi_impl(midi_path: str, soundfont_path: str, output_wav: str):
    """Render MIDI to a specific WAV path using FluidSynth and play it back."""
    
    if not midi_path or not os.path.exists(midi_path):
        print(f"Error: Input MIDI file not found: '{midi_path}'")
        return None
    
    if not soundfont_path or not os.path.isfile(soundfont_path):
        print(f"Error: Invalid or missing SoundFont path: '{soundfont_path}'")
        print("Please set the SOUND_FONT_PATH environment variable correctly.")
        return None # Indicate failure
        
    try:
        # Render MIDI to the specified output_wav path
        print(f"Rendering MIDI '{midi_path}' to '{output_wav}' using SoundFont '{soundfont_path}'...")
        fs = FluidSynth(soundfont_path)
        fs.midi_to_audio(midi_path, output_wav)
        
        # Add a small delay to ensure the file is fully written
        time.sleep(0.5)
        
        # Check if the specific output file exists and has content
        if os.path.exists(output_wav) and os.path.getsize(output_wav) > 0:
            # Play the WAV file
            # print(f"Playing rendered audio: {output_wav}")
            # data, samplerate = sf.read(output_wav)
            # sd.play(data, samplerate)
            # sd.wait() # Wait for playback to finish
            return output_wav # Return path to the generated WAV
        else:
            print(f"Error: WAV file '{output_wav}' not found or empty after conversion")
            return None # Indicate failure
            
    except Exception as e:
        print(f"Error during FluidSynth rendering or playback: {e}")
        return None # Indicate failure

@function_tool
def play_midi(midi_path: str, soundfont_path: str, output_wav: str):
    """Renders MIDI to a specific WAV file using FluidSynth and plays it back."""
    # Note: This tool might not be directly called by the LLM anymore,
    # as playback is handled programmatically in the agent loop.
    # However, the underlying _play_midi_impl is used.
    return _play_midi_impl(midi_path, soundfont_path, output_wav) 