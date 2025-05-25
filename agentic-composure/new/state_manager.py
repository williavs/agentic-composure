import json
from pathlib import Path

def save_state(state, path='agent_state.json'):
    """Serialize agent memory to JSON for warm restarts."""
    with open(path, 'w') as f:
        json.dump(state, f)

def load_state(path='agent_state.json'):
    """Load agent memory from JSON if it exists."""
    p = Path(path)
    if p.exists():
        with open(path, 'r') as f:
            return json.load(f)
    return None 