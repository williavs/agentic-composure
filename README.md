# Autonomous Music Agent

A terminal-based autonomous agent that composes, plays, analyzes, and iteratively improves short MIDI loops using the OpenAI Python SDK and standard Python audio libraries.

## Features
- Composes and mutates MIDI loops
- Plays and renders audio locally
- Analyzes audio for tempo, key, energy, and pleasantness
- Iterates until the loop is musically pleasing
- Streams agent thoughts and actions to the terminal

## Architecture
- **agent.py**: CLI entry point; loads environment, starts agent loop
- **music_agent.py**: Agent logic, OpenAI chat, state management
- **midi_writer.py**: MIDI creation and mutation utilities
- **midi_player.py**: MIDI playback and audio rendering
- **audio_analyzer.py**: Audio analysis with librosa
- **state_manager.py**: Save/load agent memory to JSON
- **prompts.py**: Centralized system and tool prompts

## Setup
1. Clone the repo and create a virtual environment:
   ```sh
   python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Set environment variables in a `.env` file or your shell:
   ```sh
   export OPENAI_API_KEY=sk-...
   export SOUND_FONT_PATH=/path/to/your/GeneralUser.sf2
   ```
3. Run the agent:
   ```sh
   python agent.py
   ```

## Requirements
- Python 3.8+
- macOS or Linux
- [General MIDI SoundFont](https://schristiancollins.com/generaluser.php) (for FluidSynth/pygame)

## Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `SOUND_FONT_PATH`: Path to a General MIDI SoundFont (.sf2)

## Notes
- All credentials are loaded from environment variables.
- The agent saves its musical history and metrics for warm restarts.
- For best results, use a high-quality SoundFont and ensure your audio system is configured for loopback/recording.

## Realtime Feedback Loop (OpenAI Realtime API)

- `realtime_feedback_loop.py`: Streams generated audio to the OpenAI Realtime API via WebSocket, receives AI feedback, and uses it to guide the next iteration of the music agent. Requires `websocket-client`, `soundfile`, and `numpy`.

Run with:
```sh
python realtime_feedback_loop.py
```

## License
MIT 