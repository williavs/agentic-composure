import os
from dotenv import load_dotenv
from music_agent import MusicAgent
from ascii_art import print_welcome_animation

def main():
    load_dotenv()
    api_key = os.getenv('OPENAI_API_KEY')
    soundfont_path = os.getenv('SOUND_FONT_PATH')
    if not soundfont_path:
        soundfont_path = os.path.join('music', 'undertale.sf2')
    if not api_key or not soundfont_path:
        print("Missing OPENAI_API_KEY or SOUND_FONT_PATH in environment.")
        return

    # Print welcome animation
    print_welcome_animation()

    # Get music style from user
    style = input("Enter the music style/genre you'd like (e.g., jazz, synthwave, classical): ")
    if not style:
        style = "upbeat electronic" # Default style

    agent = MusicAgent(api_key=api_key, soundfont_path=soundfont_path, style=style)
    # agent.run_cli_loop()
    agent.run_agentic_realtime_loop()

if __name__ == "__main__":
    main() 