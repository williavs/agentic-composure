instrument_list = """
Available Instruments (Undertale SoundFont):
000: Undertale Piano | 001: Undertale Piano 2 | 002: Undertale Glocken
003: Undertale Violin | 004: Undertale Strings | 005: Undertale Aahs
006: Undertale Square | 007: Undertale Saw | 008: Undertale Timpani
009: Undertale Cymbal | 010: Fallen Down Piano | 011: Fallen Down Bass
012: Fallen Pan Flute | 013: Ruins Flute | 014: Battle 12.5%
015: Battle 25% | 016: Ghost Sample | 017: Ghost Bass
018: Ghost Voice | 019: Ghost Sax | 020: Ghost Trumpet
021: Home Guitar | 022: Home Music Box | 023: Heartache Square
024: Heartache Square 2 | 025: Heartache Oboe | 026: Sans Clavinet
027: Sans Bass | 028: Sans Sax | 029: Dog
030: Snowdin Vibraphone | 031: Snowdin Xylophone | 032: Snowdin Bells
033: Snowdin Pizzicato | 034: Snowdin Viola | 035: Shop Clarinet
036: Bone Xylophone | 037: Bone Strings | 038: Bonetrousle Flute
039: Date Piano | 040: Quiet Celesta | 041: Temmie Doo
042: Temmie Bird | 043: Justice Trumpet | 044: Justice Brass
045: Justice Choir | 046: Justice Bass Drum | 047: Alphys
048: Showtime Square | 049: Showtime Trumpet | 050: Showtime Bass
051: Medium Saw | 052: Musical Harp | 053: Musical Trumpet
054: Musical Tuba | 055: Musical Horn | 056: Musical Reed
057: Musical Flute | 058: Snowdin Strings | 059: Musical Strings
060: Musical Timpani | 061: Stronger Brass | 062: Stronger Strings
063: Glamour Piano | 064: Glamour Rhodes | 065: Glamour Sax
066: Barrier | 067: Nightmare Bass | 068: Finale Trombone
069: Here We Are | 070: Amalgam | 071: Amalgam Trumpet
072: Amalgam Strings | 073: Amalgam Lead | 074: Amalgam Noise
075: Amalgam Perc | 076: Amalgam Bump | 077: Save Guitar
078: Save Charang | 079: Reunited Piano | 080: Reunited Rhodes
081: Reunited Bass | 082: Reunited Sax | 083: Reunited Flute
084: Reunited Strings | 085: Reunited Pizzicato | 086: Reunited Toms
087: Undying Bells | 088: Genocide Guitar | 089: Genocide Brass
090: Genocide Hit

DRUM KITS (Use Bank 128 in MIDI Player):
128-000: Undertale Drum Kit | 128-001: Dance Drum Kit
128-002: Showtime Drum Kit | 128-003: Stronger Drum Kit
128-004: Power Drum Kit
"""

system_prompt = f"""
You are a creative music agent specialized in creating MIDI loops in various musical styles, using instruments from the Undertale SoundFont.
Your primary responsibility is to generate, analyze, and iteratively improve music to maximize pleasantness and authenticity.

REFERENCE INSTRUMENT LIST:
{instrument_list}

REFERENCE: The UNDERTALE Music Sample List (archived) provides authentic instrument, detuning, and arrangement details for each track. Leverage this knowledge to create authentic-sounding music with appropriate instrument combinations, layering, detuning, and effects.

CRITICAL INSTRUCTION: When composing or mutating, you MUST:
1. Return ONLY a JSON object with the required musical parameters.
2. Ensure the JSON is strictly valid. **Do NOT use leading zeros for numbers (e.g., use `65`, not `065`)**.
3. Do NOT include file paths, explanations, or any other text.
4. The agent will handle file paths and tool invocation.

Your ONLY role in this interaction is to return the required musical parameters as a strictly valid JSON object or creative Python code that generates music.
"""

compose_prompt_template = """
TASK: Create Python code to generate a complete musical loop in the {style} style.

AVAILABLE INSTRUMENTS:
""" + instrument_list + """

INSTRUCTIONS:
1. Write Python code using the `pretty_midi` library to create a musical loop in the {style} style.
2. Use appropriate instruments for {style} - don't be limited to just drums! Choose from:
   - Percussion instruments (program=0, is_drum=True)
   - Melodic instruments from the instrument list above
   - Bass instruments (program numbers 32-39)
   - Harmony/chord instruments (pianos, guitars, pads)
3. **CRITICAL: `pretty_midi.Instrument` does NOT accept a `bank` argument. To select a drum kit, use `is_drum=True` and the correct `program` number (usually 0 for the default kit). Bank selection (like bank 128 for specific drum kits) is handled by the MIDI player, not in this code.**
4. Create a cohesive and emotionally impactful piece with:
   - Clear rhythmic foundation
   - Bass elements that support the harmony
   - Melodic elements that express the style
   - Appropriate harmony and chord progressions
5. Add dynamics, effects suggestions, and instrument detuning as appropriate for authenticity.
6. **CRITICAL:** The code MUST save the final MIDI object to a file path specified by the variable `output_path`. This variable will be provided to your code when executed.
7. Return ONLY the Python code, wrapped in `<CODE>...</CODE>` tags.

SUCCESS CRITERIA:
- Response contains ONLY the <CODE>...</CODE> block.
- The code creates a complete musical arrangement appropriate for the {style}.
- The code saves the result using `midi_object.write(output_path)`.
- The code is executable Python.

EXAMPLE RESPONSE:
<CODE>
import pretty_midi
import random

# Create a new MIDI file with appropriate tempo for the style
midi = pretty_midi.PrettyMIDI(initial_tempo=120)

# Create instruments
drums = pretty_midi.Instrument(program=0, is_drum=True)
bass = pretty_midi.Instrument(program=33)  # Finger bass
piano = pretty_midi.Instrument(program=0)  # Acoustic Piano

# Add percussion
# [percussion pattern code]

# Add bass line
# [bass line code]

# Add piano chords
# [piano chord code]

# Add all instruments to the MIDI file
midi.instruments.extend([drums, bass, piano])

# Save the file
midi.write(output_path)
</CODE>
"""

mutate_prompt_template = f"""
TASK: Transform and enhance the existing music based on feedback and {{style}} genre characteristics.

CURRENT SONG:
- File: {{midi_path}}
- Style: {{style}}

ANALYSIS OF CURRENT SONG:
{{analysis}}

ORIGINAL CODE FROM PREVIOUS ITERATION:
<CODE>
{{previous_code}}
</CODE>

AVAILABLE INSTRUMENTS:
{instrument_list}

INSTRUCTIONS:
1. At the very top of your code, ALWAYS declare all required imports (e.g., import pretty_midi, import numpy as np, import random, from copy import deepcopy if you use it, etc.).
2. At the very top of your code, ALWAYS define these timing variables (regardless of instrument presence):
   - bpm (beats per minute)
   - beat_dur (duration of a beat in seconds)
   - bar_duration (duration of a 4/4 bar in seconds)
   - loop_dur (total duration of the loop in seconds)
   - num_bars (number of bars in the loop)
   Use the loaded MIDI object to calculate these.
3. **Never pass string note names (like 'G3', 'B3', 'D4') directly to pretty_midi.Note. Always convert them to MIDI note numbers using pretty_midi.note_name_to_number('G3') before using as a pitch.**
   - Example:
     chord_names = ['G3', 'B3', 'D4']
     chord = [pretty_midi.note_name_to_number(n) for n in chord_names]
     for note in chord:
         instrument.notes.append(pretty_midi.Note(..., pitch=note, ...))
4. **CRITICAL: `pretty_midi.Instrument` does NOT accept a `bank` argument. To select a drum kit, use `is_drum=True` and the correct `program` number (usually 0 for the default kit). Bank selection (like bank 128 for specific drum kits) is handled by the MIDI player, not in this code.**
5. Modify or extend the code above to achieve the new musical goals, rather than starting from scratch. You have complete creative freedom to:
   - Add new instruments appropriate for the {{style}} genre
   - Modify existing instruments (change notes, velocity, timing)
   - Add or change rhythmic, harmonic, or melodic elements
   - Apply genre-specific techniques like detuning, layering, or effect suggestions
   - Create a more authentic {{style}} sound based on the UNDERTALE Music Sample List reference

6. PREFERRED: Write Python code using the `pretty_midi` library to LOAD, TRANSFORM, and SAVE the music:
   - Use the provided `midi_path` to load the existing MIDI file
   - Make creative enhancements based on the analysis and genre
   - Save the result to the file path specified by the variable `output_path`
   - Comment your code for clarity on creative decisions
   - Be wrapped in <CODE>...</CODE>` tags

7. ALTERNATIVE (if code is not possible): Return ONLY a strictly valid JSON object with parameters, wrapped in <PARAMS>...</PARAMS>` tags.

SUCCESS CRITERIA:
- Response contains ONLY the <CODE>...</CODE> block (preferred) or <PARAMS>...</PARAMS> block (fallback).
- The code loads the existing MIDI, enhances it creatively, and saves to `output_path`.
- The enhancement clearly addresses feedback from the analysis and improves the musical quality.
- The code is executable Python and self-contained.

EXAMPLE CODE RESPONSE:
<CODE>
import pretty_midi
import numpy as np
import random
from copy import deepcopy

# Load existing MIDI
midi = pretty_midi.PrettyMIDI(midi_path)

# ALWAYS define timing variables at the top
bpm = midi.get_tempo_changes()[1][0] if len(midi.get_tempo_changes()[1]) > 0 else 120
beat_dur = 60 / bpm
loop_dur = midi.get_end_time()
bar_duration = 4 * beat_dur
num_bars = int(loop_dur // bar_duration)

# Analyze the existing instruments
existing_programs = [inst.program for inst in midi.instruments]
has_drums = any(inst.is_drum for inst in midi.instruments)
has_bass = any(32 <= inst.program <= 39 for inst in midi.instruments)
has_melody = any(inst.program in [65, 56, 73] for inst in midi.instruments)

# Add what's missing based on analysis and style
if not has_drums:
    # Add drums code
    drums = pretty_midi.Instrument(program=0, is_drum=True)
    # Add appropriate drum pattern
    midi.instruments.append(drums)
    
if not has_bass:
    # Add bass code
    bass = pretty_midi.Instrument(program=33)
    # Add appropriate bass line
    midi.instruments.append(bass)
    
# Enhance existing instruments
for instrument in midi.instruments:
    if instrument.is_drum:
        # Enhance drum pattern
        pass
    elif 32 <= instrument.program <= 39:
        # Enhance bass line
        pass
    else:
        # Enhance melodic/harmonic elements
        pass

# Save the enhanced MIDI
midi.write(output_path)
</CODE>

EXAMPLE JSON RESPONSE:
<PARAMS>
{{{{
  "mutation_description": "Adding a dynamic countermelody with saxophone and enhancing the rhythm section with layered percussion to create a more authentic sound.",
  "transpose_semitones": 0,
  "velocity_change": 5,
  "add_note_probability": 0.95,
  "remove_note_probability": 0.1,
  "instrument_program": 65
}}}}
</PARAMS>
"""

analyze_prompt = """
Analyze the rendered audio in detail. Provide comprehensive feedback on:

1. Overall musicality and genre authenticity
2. Instrument balance and selection
3. Rhythm, melody, and harmony quality
4. Emotional impact
5. Technical execution
6. Specific suggestions for improvement in the next iteration

Focus on specific, actionable feedback that would help create more authentic and compelling music in this genre.
""" # This prompt is used when analysis feedback is needed 

refactor_prompt_template = f"""
TASK: Fix the provided Python code based on the error message.

ORIGINAL GOAL:
{{original_prompt}}

FAULTY CODE:
<CODE>
{{faulty_code}}
</CODE>

ERROR MESSAGE:
{{error_message}}

INSTRUCTIONS:
1. Analyze the error message and the faulty code.
2. Identify the cause of the error (e.g., undefined variable, incorrect function call, type mismatch).
3. Rewrite the code to fix the specific error while preserving the original musical intent and adhering to all previous rules (imports at top, timing variables defined, no 'bank' argument, MIDI note numbers, etc.).
4. Ensure the corrected code is complete, executable, and saves the result to the `output_path` variable.
5. Return ONLY the corrected Python code, wrapped in `<CODE>...</CODE>` tags. Do NOT include explanations.
""" 