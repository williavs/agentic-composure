import sys
import threading
import time
import random

# Simple purple/blue gradient (no ANSI 24-bit, just basic colors for compatibility)
COLORS = [
    "\033[95m",  # Light magenta
    "\033[94m",  # Light blue
    "\033[96m",  # Cyan
    "\033[34m",  # Blue
    "\033[35m",  # Magenta
]
RESET = "\033[0m"
CHARS = "⠋⠙⠸⠴⠦⠇⠏"

class SimpleSpinner:
    def __init__(self, message="Processing...", max_chars=10, label="SPIN"):
        self.message = message
        self.max_chars = max_chars
        self.label = label
        self._stop_event = threading.Event()
        self._thread = threading.Thread(target=self._spin)

    def _spin(self):
        idx = 0
        while not self._stop_event.is_set():
            chars = ""
            for i in range(self.max_chars):
                color = COLORS[i % len(COLORS)]
                chars += f"{color}{random.choice(CHARS)}{RESET}"
            sys.stdout.write(f"\r{self.message} {chars} {self.label}")
            sys.stdout.flush()
            time.sleep(0.08)
            idx += 1
        sys.stdout.write("\r" + " " * (len(self.message) + self.max_chars * 3 + len(self.label) + 2) + "\r")

    def __enter__(self):
        self._stop_event.clear()
        self._thread.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._stop_event.set()
        self._thread.join()
        print(f"{COLORS[1]}✓ Success!{RESET}" if exc_type is None else f"{COLORS[0]}✗ Failed.{RESET}")

# Example usage
if __name__ == "__main__":
    with SimpleSpinner("Working...", label="MUSIC"):
        time.sleep(4) 