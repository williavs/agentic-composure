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
1. ALWAYS FOLLOW THIS CODE STRUCTURE PRECISELY:
   ```python
   # Step 1: Import ALL necessary libraries explicitly
   import pretty_midi
   import numpy as np
   import random
   
   # Step 2: Load the existing MIDI file
   midi = pretty_midi.PrettyMIDI(midi_path)
   
   # Step 3: Define timing variables (ALWAYS include these exact variables)
   bpm = midi.get_tempo_changes()[1][0] if len(midi.get_tempo_changes()[1]) > 0 else 120
   beat_dur = 60 / bpm
   bar_duration = 4 * beat_dur
   loop_dur = midi.get_end_time()
   num_bars = int(loop_dur // bar_duration)
   
   # Step 4: Define any helper functions you need
   
   # Step 5: Access and modify existing instruments
   
   # Step 6: Add new instruments
   
   # Step 7: Save the modified MIDI
   midi.write(output_path)
   ```

2. CRITICAL INSTRUMENT CREATION RULES:
   - ALWAYS use this exact syntax when creating new instruments:
     ```python
     # For regular instruments
     new_inst = pretty_midi.Instrument(program=65)  # Example: 65 = Saxophone
     
     # For drums (NEVER use 'bank' parameter)
     drums = pretty_midi.Instrument(program=0, is_drum=True)
     ```
   
   - NO SHORTCUTS: Always define instrument variables fully before using them.
   - VALIDATION: After creating any instrument, append it to the MIDI object
     ```python
     midi.instruments.append(new_inst)
     ```

3. CRITICAL NOTE CREATION RULES:
   - ALWAYS convert note names to MIDI numbers:
     ```python
     pitch = pretty_midi.note_name_to_number('C4')
     new_note = pretty_midi.Note(velocity=100, pitch=pitch, start=0.0, end=1.0)
     instrument.notes.append(new_note)
     ```
   - ALWAYS use numeric variables for pitches, not string literals.
   - ALWAYS ensure start time < end time for all notes.

4. FORBIDDEN PRACTICES (WILL CAUSE ERRORS):
   - DO NOT use 'bank' parameter in Instrument()
   - DO NOT pass string note names directly to Note() constructor
   - DO NOT use undefined variables (especially instruments or notes)
   - DO NOT use positional arguments after keyword arguments

5. Load the existing MIDI file, identify existing instruments, and modify/enhance them as needed.
   Analyze the instruments by category:
   ```python
   # Analyze existing instruments
   existing_programs = [inst.program for inst in midi.instruments]
   has_drums = any(inst.is_drum for inst in midi.instruments)
   has_bass = any(32 <= inst.program <= 39 for inst in midi.instruments)
   has_lead = any(inst.program in [65, 56, 73] for inst in midi.instruments)
   ```

6. When enhancing the song, choose from these proven approaches:
   - Add a new complementary instrument (carefully follow instrument creation rules)
   - Enhance existing instrument patterns while preserving their core identity
   - Adjust velocities to create better dynamics
   - Add variations to existing patterns rather than completely replacing them

7. EXAMPLES OF RELIABLE CODE:

   EXAMPLE: Adding a new bass line
   ```python
   # Add a new bass instrument
   bass = pretty_midi.Instrument(program=33)  # Electric bass
   
   # Define a bass pattern
   bass_notes = ['E2', 'G2', 'A2', 'B2']
   bass_pitches = [pretty_midi.note_name_to_number(note) for note in bass_notes]
   
   for bar in range(num_bars):
       for i, pitch in enumerate(bass_pitches):
           start = bar * bar_duration + i * beat_dur
           end = start + 0.9 * beat_dur
           bass.notes.append(pretty_midi.Note(velocity=80, pitch=pitch, start=start, end=end))
   
   # Add bass to the MIDI
   midi.instruments.append(bass)
   ```

SUCCESS CRITERIA:
- Response contains ONLY the <CODE>...</CODE> block.
- The code MUST load the existing MIDI file from midi_path.
- The code MUST save the final MIDI to output_path.
- All instruments and notes MUST be properly defined before use.
- All notes MUST use numeric pitch values, not string note names.
- The code MUST be executable Python with no syntax errors.

RELIABLE WORKING EXAMPLE:
<CODE>
import pretty_midi
import numpy as np
import random

# Load the existing MIDI file
midi = pretty_midi.PrettyMIDI(midi_path)

# Define timing variables
bpm = midi.get_tempo_changes()[1][0] if len(midi.get_tempo_changes()[1]) > 0 else 120
beat_dur = 60 / bpm
bar_duration = 4 * beat_dur
loop_dur = midi.get_end_time()
num_bars = int(loop_dur // bar_duration)

# Analyze existing instruments
existing_programs = [inst.program for inst in midi.instruments]
has_drums = any(inst.is_drum for inst in midi.instruments)
has_bass = any(32 <= inst.program <= 39 for inst in midi.instruments)

# Add a lead guitar if it doesn't exist
if not any(inst.program == 28 for inst in midi.instruments):
    lead_guitar = pretty_midi.Instrument(program=28)  # Electric Guitar
    
    # Create a simple melody
    melody_notes = ['E4', 'G4', 'A4', 'B4']
    melody_pitches = [pretty_midi.note_name_to_number(note) for note in melody_notes]
    
    for bar in range(num_bars):
        for i, pitch in enumerate(melody_pitches):
            start = bar * bar_duration + i * beat_dur
            end = start + 0.8 * beat_dur
            lead_guitar.notes.append(pretty_midi.Note(velocity=100, pitch=pitch, start=start, end=end))
    
    midi.instruments.append(lead_guitar)

# Enhance existing drums if they exist
for instrument in midi.instruments:
    if instrument.is_drum:
        # Add some additional cymbal hits
        for bar in range(num_bars):
            # Add crash cymbal on the first beat of every other bar
            if bar % 2 == 0:
                crash = pretty_midi.Note(velocity=100, pitch=49, start=bar * bar_duration, end=bar * bar_duration + 2 * beat_dur)
                instrument.notes.append(crash)

# Save the modified MIDI
midi.write(output_path)
</CODE>
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
1. ANALYZE THE ERROR CAREFULLY. Common errors and their fixes:

   • `NameError: name 'X' is not defined`:
     - Define the missing variable before using it
     - Check for typos in variable names
     - Ensure all instrument variables are defined with pretty_midi.Instrument()
   
   • `TypeError: __init__() got an unexpected keyword argument 'bank'`:
     - Remove all 'bank' parameters from pretty_midi.Instrument()
     - For drums, use program=0, is_drum=True instead
   
   • `SyntaxError: positional argument follows keyword argument`:
     - Reorder arguments to put all positional arguments before keyword arguments
     - Convert positional arguments to keyword arguments
   
   • `TypeError: string indices must be integers`:
     - Ensure note names are converted to integers with pretty_midi.note_name_to_number()
     - Never use string note names directly in pretty_midi.Note() constructor

2. ALWAYS START BY FIXING THE IMPORTS AND BASIC STRUCTURE:
   ```python
   import pretty_midi
   import numpy as np
   import random
   
   # Load the MIDI file
   midi = pretty_midi.PrettyMIDI(midi_path)
   
   # Define timing variables
   bpm = midi.get_tempo_changes()[1][0] if len(midi.get_tempo_changes()[1]) > 0 else 120
   beat_dur = 60 / bpm
   bar_duration = 4 * beat_dur
   loop_dur = midi.get_end_time()
   num_bars = int(loop_dur // bar_duration)
   ```

3. LOOK FOR THESE COMMON PROBLEMS:
   • Undefined instruments: Check all instrument variables are defined before use
   • Missing .append(): Ensure all new instruments are added to midi.instruments
   • String note names: Replace with pretty_midi.note_name_to_number() conversion
   • Missing imports: Add all required imports at the beginning
   • Timing calculations: Fix any errors in start/end time calculations

4. WHEN IN DOUBT, FOLLOW THIS RELIABLE PATTERN:
   ```python
   # Create instrument (NEVER use 'bank' parameter)
   instrument = pretty_midi.Instrument(program=0, is_drum=True)  # For drums
   # OR
   instrument = pretty_midi.Instrument(program=28)  # For regular instruments
   
   # Add notes to instrument (ALWAYS convert string notes to MIDI pitch numbers)
   notes = ['C4', 'E4', 'G4']
   pitches = [pretty_midi.note_name_to_number(note) for note in notes]
   
   for pitch in pitches:
       note = pretty_midi.Note(velocity=100, pitch=pitch, start=0.0, end=1.0)
       instrument.notes.append(note)
   
   # Add instrument to MIDI
   midi.instruments.append(instrument)
   
   # Save the MIDI
   midi.write(output_path)
   ```

5. FOCUS ON FIXING THE SPECIFIC ERROR, while preserving the original musical intent.

Your response MUST contain ONLY corrected Python code within <CODE>...</CODE> tags.
""" 