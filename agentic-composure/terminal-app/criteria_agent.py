import openai
import os
import json

# Style guardrails in flexible JSON format instead of rigid XML
STYLE_GUARDRAILS = {
    "jazz": {
        "rhythm": [
            "Walking bass follows quarter notes",
            "Swing eighth notes (triplet feel)",
            "Drums typically use ride cymbal patterns"
        ],
        "harmony": [
            "Extended chords (7ths, 9ths, 13ths)",
            "ii-V-I progressions",
            "Voice leading follows smooth transitions"
        ],
        "structure": [
            "Head-solos-head form",
            "Trading fours between instruments"
        ]
    },
    
    "rock": {
        "rhythm": [
            "Backbeat emphasis (2 and 4)",
            "Steady 8th or 16th note patterns",
            "Bass often follows root notes of chords"
        ],
        "harmony": [
            "Power chords for harder styles",
            "I-IV-V or i-VII-VI progressions common",
            "Guitar-driven distortion increases with intensity"
        ],
        "structure": [
            "Verse-chorus form with distinct sections",
            "Bridge typically provides contrast"
        ]
    },
    
    "edm": {
        "rhythm": [
            "Four-on-the-floor kick pattern",
            "Hi-hats on offbeats (upbeats)",
            "Syncopated bass rhythms"
        ],
        "harmony": [
            "Simple chord progressions (4 chords or fewer)",
            "Layered synthesizer textures",
            "Sub bass follows root notes"
        ],
        "structure": [
            "Build-up and drop structure",
            "8 or 16 bar phrases",
            "Filtering for transitions"
        ]
    },
    
    "classical": {
        "rhythm": [
            "Tempo rubato (flexible timing)",
            "Cadences mark phrase endings",
            "Bass provides harmonic foundation"
        ],
        "harmony": [
            "Functional harmony (tonic-dominant relationships)",
            "Voice leading follows rules of counterpoint",
            "Modulations between related keys"
        ],
        "structure": [
            "Sonata form for larger works",
            "Thematic development and recapitulation"
        ]
    },
    
    "hip-hop": {
        "rhythm": [
            "Drum patterns emphasize boom-bap or trap",
            "Bass follows kick drum pattern",
            "Syncopated hi-hat patterns"
        ],
        "harmony": [
            "Sample-based or synthesized loops",
            "Minor key progressions common",
            "Sparse harmonic texture with focus on rhythm"
        ],
        "structure": [
            "16-bar verses",
            "8-bar hooks/choruses",
            "Intro builds layers progressively"
        ]
    }
}

# Generic fallback style
GENERIC_STYLE = {
    "rhythm": [
        "Consistent beat and tempo",
        "Bass provides rhythmic foundation"
    ],
    "harmony": [
        "Coherent chord progressions",
        "Instrument roles clearly defined"
    ],
    "structure": [
        "Progressive build of instrumentation",
        "Clear sections with proper transitions"
    ]
}

# Add fallback for genres not in the dictionary
def get_style_guardrails(genre):
    """Get the style-specific guardrails for a given genre, with fallback to similar genres."""
    genre = genre.lower()
    
    # Direct match
    if genre in STYLE_GUARDRAILS:
        return STYLE_GUARDRAILS[genre]
    
    # Fallbacks for similar genres
    if any(x in genre for x in ["jazz", "blues", "swing"]):
        return STYLE_GUARDRAILS["jazz"]
    elif any(x in genre for x in ["rock", "punk", "metal", "grunge"]):
        return STYLE_GUARDRAILS["rock"]
    elif any(x in genre for x in ["edm", "techno", "house", "electronic", "trance", "dubstep"]):
        return STYLE_GUARDRAILS["edm"]
    elif any(x in genre for x in ["classical", "baroque", "romantic", "symphony", "orchestral"]):
        return STYLE_GUARDRAILS["classical"]
    elif any(x in genre for x in ["hip", "hop", "rap", "trap", "r&b", "soul"]):
        return STYLE_GUARDRAILS["hip-hop"]
    
    # Generic fallback
    return GENERIC_STYLE

def format_style_rules_for_prompt(style_rules):
    """Format the style rules in a more natural, readable format for prompts."""
    output = []
    
    for section, rules in style_rules.items():
        output.append(f"For {section.upper()}")
        for rule in rules:
            output.append(f"- {rule}")
        output.append("")  # Add blank line between sections
    
    return "\n".join(output)

CRITERIA_PROMPT = """
You are a world-class music critic and teacher. Given a musical genre, list 4 concise, musically relevant, and non-overlapping criteria that are essential for evaluating the quality and authenticity of a song in that genre. Each criterion should be a short phrase (2-5 words), specific to the genre, and cover a different aspect of musicality (e.g., rhythm, harmony, instrumentation, energy, etc.).

Consider these stylistic guidelines for {genre} music when creating your criteria:

{style_guidelines}

Return ONLY a JSON array of 4 strings. Do not include explanations or extra text.

Example for genre 'jazz':
[
  "Swing feel",
  "Improvisational phrasing",
  "Complex harmony",
  "Dynamic interplay"
]

Example for genre 'rock':
[
  "Driving rhythm",
  "Powerful vocals",
  "Guitar riffs",
  "High energy"
]

Genre: {genre}
"""

def get_genre_evaluation_criteria(genre, api_key=None):
    """
    Given a genre string, return a list of 4 genre-specific evaluation criteria using OpenAI LLM.
    """
    if api_key is None:
        api_key = os.environ.get("OPENAI_API_KEY")
    openai.api_key = api_key
    
    # Get style-specific guardrails
    style_guardrails = get_style_guardrails(genre)
    
    # Format style guidelines in a more natural way
    style_guidelines = format_style_rules_for_prompt(style_guardrails)
    
    # Format prompt with guardrails
    prompt = CRITERIA_PROMPT.format(genre=genre, style_guidelines=style_guidelines)
    
    response = openai.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=256,
    )
    content = response.choices[0].message.content
    # Try to parse the JSON array
    try:
        # Remove code block markers if present
        if content.startswith("```json"):
            content = content[len("```json"):].strip()
        if content.endswith("```"):
            content = content[:-3].strip()
        criteria = json.loads(content)
        if isinstance(criteria, list) and len(criteria) == 4:
            return criteria
        else:
            raise ValueError("Criteria response is not a list of 4 items.")
    except Exception as e:
        print(f"[criteria_agent] Error parsing criteria: {e}\nRaw content: {content}")
        return []

def get_style_rules(genre):
    """
    Return the style guidelines for a specific genre in a formatted, readable way.
    This can be used directly in prompts to guide music generation.
    """
    style_rules = get_style_guardrails(genre)
    return format_style_rules_for_prompt(style_rules)