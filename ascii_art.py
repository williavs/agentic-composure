# ascii_art.py
"""
This module stores ASCII art pieces for use in CLI animations or banners.
Paste your ASCII art between the triple quotes in the placeholders below.
"""

import time
import os
import subprocess
import shutil

# Example placeholders for ASCII art pieces
ART_1 = r'''

▗▞▀▜▌ ▗▞▀▚▖▄▄▄▄     ■  ▄ ▗▞▀▘▗▞▀▘ ▄▄▄  ▄▄▄▄  ▄▄▄▄   ▄▄▄   ▄▄▄ █  ▐▌ ▄▄▄ ▗▞▀▚▖
▝▚▄▟▌ ▐▛▀▀▘█   █ ▗▄▟▙▄▖▄ ▝▚▄▖▝▚▄▖█   █ █ █ █ █   █ █   █ ▀▄▄  ▀▄▄▞▘█    ▐▛▀▀▘
      ▝▚▄▄▖█   █   ▐▌  █         ▀▄▄▄▀ █   █ █▄▄▄▀ ▀▄▄▄▀ ▄▄▄▀      █    ▝▚▄▄▖
    ▗▄▖            ▐▌  █                     █                               
   ▐▌ ▐▌           ▐▌                        ▀                               
    ▝▀▜▌                                                                     
   ▐▙▄▞▘                                                                     

'''

ART_2 = r'''

                          __  _                                                                
  ____ _____ ____  ____  / /_(_)____      _________  ____ ___  ____  ____  _______  __________ 
 / __ `/ __ `/ _ \/ __ \/ __/ / ___/_____/ ___/ __ \/ __ `__ \/ __ \/ __ \/ ___/ / / / ___/ _ \
/ /_/ / /_/ /  __/ / / / /_/ / /__/_____/ /__/ /_/ / / / / / / /_/ / /_/ (__  ) /_/ / /  /  __/
\__,_/\__, /\___/_/ /_/\__/_/\___/      \___/\____/_/ /_/ /_/ .___/\____/____/\__,_/_/   \___/ 
     /____/                                                /_/                                 

'''

ART_3 = r'''

                        ___           ___           ___           ___                                   ___                 
                       /  /\         /  /\         /  /\         /__/\          ___       ___          /  /\                
                      /  /::\       /  /:/_       /  /:/_        \  \:\        /  /\     /  /\        /  /:/                
                     /  /:/\:\     /  /:/ /\     /  /:/ /\        \  \:\      /  /:/    /  /:/       /  /:/                 
                    /  /:/~/::\   /  /:/_/::\   /  /:/ /:/_   _____\__\:\    /  /:/    /__/::\      /  /:/  ___             
                   /__/:/ /:/\:\ /__/:/__\/\:\ /__/:/ /:/ /\ /__/::::::::\  /  /::\    \__\/\:\__  /__/:/  /  /\            
                   \  \:\/:/__\/ \  \:\ /~~/:/ \  \:\/:/ /:/ \  \:\~~\~~\/ /__/:/\:\      \  \:\/\ \  \:\ /  /:/            
                    \  \::/       \  \:\  /:/   \  \::/ /:/   \  \:\  ~~~  \__\/  \:\      \__\::/  \  \:\  /:/             
                     \  \:\        \  \:\/:/     \  \:\/:/     \  \:\           \  \:\     /__/:/    \  \:\/:/              
                      \  \:\        \  \::/       \  \::/       \  \:\           \__\/     \__\/      \  \::/               
                       \__\/         \__\/         \__\/         \__\/                                 \__\/                
      ___           ___           ___           ___         ___           ___           ___           ___           ___     
     /  /\         /  /\         /__/\         /  /\       /  /\         /  /\         /__/\         /  /\         /  /\    
    /  /:/        /  /::\       |  |::\       /  /::\     /  /::\       /  /:/_        \  \:\       /  /::\       /  /:/_   
   /  /:/        /  /:/\:\      |  |:|:\     /  /:/\:\   /  /:/\:\     /  /:/ /\        \  \:\     /  /:/\:\     /  /:/ /\  
  /  /:/  ___   /  /:/  \:\   __|__|:|\:\   /  /:/~/:/  /  /:/  \:\   /  /:/ /::\   ___  \  \:\   /  /:/~/:/    /  /:/ /:/_ 
 /__/:/  /  /\ /__/:/ \__\:\ /__/::::| \:\ /__/:/ /:/  /__/:/ \__\:\ /__/:/ /:/\:\ /__/\  \__\:\ /__/:/ /:/___ /__/:/ /:/ /\
 \  \:\ /  /:/ \  \:\ /  /:/ \  \:\~~\__\/ \  \:\/:/   \  \:\ /  /:/ \  \:\/:/~/:/ \  \:\ /  /:/ \  \:\/:::::/ \  \:\/:/ /:/
  \  \:\  /:/   \  \:\  /:/   \  \:\        \  \::/     \  \:\  /:/   \  \::/ /:/   \  \:\  /:/   \  \::/~~~~   \  \::/ /:/ 
   \  \:\/:/     \  \:\/:/     \  \:\        \  \:\      \  \:\/:/     \__\/ /:/     \  \:\/:/     \  \:\        \  \:\/:/  
    \  \::/       \  \::/       \  \:\        \  \:\      \  \::/        /__/:/       \  \::/       \  \:\        \  \::/   
     \__\/         \__\/         \__\/         \__\/       \__\/         \__\/         \__\/         \__\/         \__\/    

'''

# Final welcome message (using the last art piece)
WELCOME_MESSAGE = ART_3 + "\nWelcome to the Autonomous Music Agent!\n"

def print_welcome_animation(delay=0.7):
    """Prints a welcome message, colored with lolcat if available."""
    lolcat_path = shutil.which('lolcat')
    
    os.system('clear' if os.name == 'posix' else 'cls')

    if lolcat_path:
        try:
            # Use subprocess.run to pipe the message string to lolcat
            subprocess.run([lolcat_path], input=WELCOME_MESSAGE, text=True, check=True)
            print("(Using lolcat for colors!)")
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print(f"lolcat failed ({e}), printing normally:")
            print(WELCOME_MESSAGE) # Fallback on error
    else:
        print("(lolcat not found, printing normally)")
        print(WELCOME_MESSAGE) # Print plain text if lolcat is not found

# Example usage (uncomment to test):
# if __name__ == "__main__":
#     print_welcome_animation() 