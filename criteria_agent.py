import openai
import os

CRITERIA_PROMPT = """
You are a world-class music critic and teacher. Given a musical genre, list 4 concise, musically relevant, and non-overlapping criteria that are essential for evaluating the quality and authenticity of a song in that genre. Each criterion should be a short phrase (2-5 words), specific to the genre, and cover a different aspect of musicality (e.g., rhythm, harmony, instrumentation, energy, etc.).

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
    prompt = CRITERIA_PROMPT.format(genre=genre)
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
    import json
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