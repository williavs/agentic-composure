import pretty_midi
import mido
from agents import function_tool
from pydantic import BaseModel, Field
import random
import os
from typing import Optional # Import Optional

# Removed NewLoopParams

class MutationParams(BaseModel):
    midi_path: str # Path to the input MIDI file to mutate
    output_path: str # Path where the mutated MIDI file will be saved
    mutation_description: str # Required description from LLM
    transpose_semitones: int
    velocity_change: int
    add_note_probability: float
    remove_note_probability: float
    instrument_program: Optional[int] = None # Optional, but no Field default

# Removed new_loop_impl and new_loop functions

def mutate_loop_impl(params: MutationParams):
    midi_path = params.midi_path
    output_path = params.output_path
    print(f"[mutate] Received request to mutate '{midi_path}' -> '{output_path}' with description: '{params.mutation_description}'")
    transpose_semitones = params.transpose_semitones if params.transpose_semitones is not None else 0
    velocity_change = params.velocity_change if params.velocity_change is not None else 0
    add_note_probability = params.add_note_probability if params.add_note_probability is not None else 0.0
    remove_note_probability = params.remove_note_probability if params.remove_note_probability is not None else 0.0
    new_instrument_program = params.instrument_program
    if not os.path.exists(midi_path):
        print(f"[mutate] Error: Input MIDI file not found: {midi_path}")
        return {"error": f"Input MIDI file not found: {midi_path}"}
    try:
        midi = pretty_midi.PrettyMIDI(midi_path)
        if not midi.instruments:
            print(f"[mutate] Warning: Input MIDI file '{midi_path}' has no instruments. Copying instead.")
            import shutil
            shutil.copy(midi_path, output_path)
            return output_path
        # Mutate existing instruments (transpose, velocity, remove/add notes)
        for instrument in midi.instruments:
            if instrument.is_drum:
                continue
            for note in instrument.notes:
                note.pitch += transpose_semitones
                note.velocity = max(0, min(127, note.velocity + velocity_change))
            notes_to_remove = [note for note in instrument.notes if random.random() < remove_note_probability]
            for note in notes_to_remove:
                instrument.notes.remove(note)
            if instrument.notes and random.random() < add_note_probability:
                original_note = random.choice(instrument.notes)
                new_note = pretty_midi.Note(
                    velocity=max(0, min(127, original_note.velocity + random.randint(-10, 10))),
                    pitch=original_note.pitch + random.randint(-2, 2),
                    start=max(0, original_note.start + random.uniform(-0.1, 0.1)),
                    end=max(original_note.end + random.uniform(-0.1, 0.1), original_note.start + 0.05)
                )
                instrument.notes.append(new_note)
            instrument.notes.sort(key=lambda x: x.start)
        # Add new instrument layer if requested
        if new_instrument_program is not None:
            # Avoid channel 9 (drums) for pitched instruments
            used_channels = {inst.program for inst in midi.instruments}
            if new_instrument_program == 0 or new_instrument_program == 128:
                is_drum = True
            else:
                is_drum = False
            # Find next available channel (not 9 for pitched)
            next_channel = 0
            for ch in range(16):
                if ch == 9 and not is_drum:
                    continue
                if all(inst.program != ch for inst in midi.instruments):
                    next_channel = ch
                    break
            new_instrument = pretty_midi.Instrument(program=new_instrument_program, is_drum=is_drum)
            # Simple pattern: walking bass or block chords
            if 'bass' in params.mutation_description.lower():
                # Walking bass: root notes on each beat
                tempo = midi.get_tempo_changes()[1][0] if len(midi.get_tempo_changes()[1]) > 0 else 120
                beats_per_bar = 4
                num_bars = 4
                beat_duration = 60 / tempo
                root_pitch = 36  # C2
                for bar in range(num_bars):
                    for beat in range(beats_per_bar):
                        start = bar * beats_per_bar * beat_duration + beat * beat_duration
                        end = start + 0.4 * beat_duration
                        note = pretty_midi.Note(velocity=80, pitch=root_pitch + (bar % 4), start=start, end=end)
                        new_instrument.notes.append(note)
            elif 'piano' in params.mutation_description.lower() or 'chord' in params.mutation_description.lower():
                # Block chords: simple triads on downbeats
                tempo = midi.get_tempo_changes()[1][0] if len(midi.get_tempo_changes()[1]) > 0 else 120
                beats_per_bar = 4
                num_bars = 4
                beat_duration = 60 / tempo
                root_pitch = 60  # C4
                for bar in range(num_bars):
                    start = bar * beats_per_bar * beat_duration
                    end = start + 1.2 * beat_duration
                    for interval in [0, 4, 7]:  # Major triad
                        note = pretty_midi.Note(velocity=70, pitch=root_pitch + interval, start=start, end=end)
                        new_instrument.notes.append(note)
            else:
                # Default: single sustained note
                note = pretty_midi.Note(velocity=64, pitch=60, start=0, end=2)
                new_instrument.notes.append(note)
            midi.instruments.append(new_instrument)
            print(f"[mutate] Added new instrument layer with program {new_instrument_program}")
        midi.write(output_path)
        print(f"[mutate] Mutation applied. Output: {output_path}")
        return output_path
    except Exception as e:
        print(f"[mutate] Error during mutation: {e}")
        return {"error": f"Error during mutation: {e}"}

@function_tool
def mutate_loop(params: MutationParams):
    params_obj = MutationParams(**params)
    return mutate_loop_impl(params_obj) 