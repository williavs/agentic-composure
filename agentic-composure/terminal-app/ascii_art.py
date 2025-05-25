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
                                                    
                                                                                          
               .  -.            ,  ,                                ____           
              /. ./|          ,  .'|                              ,'  , `.         
          .  '.  ' ;          |  | :               ,  -.       ,-+-,.' _ |         
         /__./ \ : |          :  : '              '   ,'\   ,-+-. ;   , ||         
     .  '.  '   \' .   ,  -.  |  ' |      ,  -.  /   /   | ,  .'|'   |  || ,  -.   
    /___/ \ |    ' '  /     \ '  | |     /     \.   ; ,. :|   |  ,', |  |,/     \  
    ;   \  \;      : /    /  ||  | :    /    / ''   | |: :|   | /  | |  '/    /  | 
     \   ;  `      |.    ' / |'  : |__ .    ' / '   | .; :|   : |  | ,  .    ' / | 
      .   \    .\  ;'   ;   /||  | '.'|'   ; :__|   :    ||   : |  |/   '   ;   /| 
       \   \   ' \ |'   |  / |;  :    ;'   | '.'|\   \  / |   | |`-'    '   |  / | 
        :   '  |  " |   :    ||  ,   / |   :    : `    '  |   ;/        |   :    | 
         \   \ ;     \   \  /    -`-'   \   \  /          '  -'          \   \  /  
          '  -"       `    '             `    '                           `    '   
                                                                                   

'''

ART_2 = r'''

       **           
      /**           
     ******  ****** 
    ///**/  **////**
      /**  /**   /**
      /**  /**   /**
      //** //****** 
       //   //////  

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
WELCOME_TITLE = "Welcome to Agentic Composure!"
ARTS = [ART_1, ART_2, ART_3]

def print_welcome_animation(delay=0.3):
    """Animated welcome: shimmer and progressively display all ASCII art, then show the title and proceed."""
    lolcat_path = shutil.which('lolcat')
    os.system('clear' if os.name == 'posix' else 'cls')

    def print_with_lolcat(text):
        try:
            subprocess.run([lolcat_path], input=text, text=True, check=True)
        except Exception as e:
            print(f"lolcat failed ({e}), printing normally:")
            print(text)

    def shimmer_art_lines(art, shimmer_times=2, line_delay=0.025, shimmer_delay=0.07):
        lines = art.splitlines()
        # Progressive reveal
        for i in range(1, len(lines) + 1):
            os.system('clear' if os.name == 'posix' else 'cls')
            art_part = '\n'.join(lines[:i])
            if lolcat_path:
                print_with_lolcat(art_part)
            else:
                print(art_part)
            time.sleep(line_delay)
        # Shimmer effect: reprint the whole art a few times
        for _ in range(shimmer_times):
            os.system('clear' if os.name == 'posix' else 'cls')
            if lolcat_path:
                print_with_lolcat(art)
            else:
                print(art)
            time.sleep(shimmer_delay)

    # Cycle through all ASCII arts with shimmer/progressive animation
    for art in ARTS:
        shimmer_art_lines(art)
        time.sleep(delay)
        os.system('clear' if os.name == 'posix' else 'cls')

    # Show the full title and celebratory message, then proceed
    title = WELCOME_TITLE
    if lolcat_path:
        print_with_lolcat(title)
        print_with_lolcat("\nLet the agentic composition begin!\n")
    else:
        print(title)
        print("\nLet the agentic composition begin!\n")

# Example usage (uncomment to test):
# if __name__ == "__main__":
#     print_welcome_animation() 