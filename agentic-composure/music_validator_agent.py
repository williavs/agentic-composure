from pydantic import BaseModel
from typing import List
from agents import Agent, ModelSettings
from prompts import system_prompt, mutate_prompt_template

# Define the structured output for the validation agent
class ValidationReport(BaseModel):
    is_musically_coherent: bool
    identified_issues: List[str]
    suggestions_for_coherence: List[str]

# Placeholder for the dynamically extracted framework text
# This will be populated by the calling code (e.g., in music_agent.py or test script)
EXTRACTED_TIMING_AND_STRUCTURE_FRAMEWORK = """
[FRAMEWORK_TEXT_PLACEHOLDER]
"""

# Note: The f-string for VALIDATOR_INSTRUCTIONS will be completed by replacing the placeholder
# when the agent is initialized or used, after extracting the framework text.
RAW_VALIDATOR_INSTRUCTIONS = f"""
You are an expert Music Coherence Analyst. Your role is to evaluate Python code intended to generate MIDI music using the `pretty_midi` library. Your primary goal is to determine if the generated music would be rhythmically coherent, with all instrumental parts properly aligned and integrated, based on a critical framework.

THE MUSICAL AND TECHNICAL FRAMEWORK FOR COHERENT GENERATION IS:
{EXTRACTED_TIMING_AND_STRUCTURE_FRAMEWORK}

Analyze the provided Python code string. Using your understanding of musical composition and the principles outlined in the framework above, assess whether the code would likely result in:
- All instruments playing in time, as if sharing a single conductor.
- Rhythms and patterns that are well-aligned to a common bar-beat grid.
- If the code modifies existing MIDI (e.g., by doubling its length), ensure that existing and new parts are seamlessly integrated over the *entire* new duration.
- Avoidance of common pitfalls like instruments having independent timing loops, conflicting BPMs, or parts that don't span the full intended length of the musical section.

Output your analysis as a JSON object matching this Pydantic model:
```json
{{
  "is_musically_coherent": "boolean, true if the code is highly likely to produce a musically coherent and well-timed piece according to the framework principles. False if significant timing, alignment, or structural issues are likely.",
  "identified_issues": ["list of specific observations from the code that suggest potential timing conflicts, misalignment, or deviations from the framework's principles of coherence. Be descriptive. If no significant issues, this can be an empty list."],
  "suggestions_for_coherence": ["list of actionable suggestions on how the code could be improved to better adhere to the framework and enhance musical coherence. If no issues, this can be an empty list."]
}}
```

Focus on the *musical outcome* implied by the code's logic. While the framework provides technical guidelines, your judgment should be on whether these guidelines are being used to create something that *makes musical sense* from a timing and layering perspective. For example, even if variable names are correct, if their application leads to musically disjointed parts, flag it.
Your response MUST be ONLY the JSON object described above. No other explanatory text before or after the JSON block.
"""

def get_music_validation_agent(framework_text: str) -> Agent:
    """
    Factory function to create a MusicValidationAgent with the specific framework text.
    """
    formatted_instructions = RAW_VALIDATOR_INSTRUCTIONS.replace(
        "[FRAMEWORK_TEXT_PLACEHOLDER]", framework_text
    )
    return Agent(
        name="MusicCoherenceAnalyst",
        instructions=formatted_instructions,
        model="gpt-4.1", 
        output_type=ValidationReport,
        model_settings=ModelSettings(temperature=0.1)
    )

# --- Helper function to extract framework (can be moved or improved) ---
def extract_relevant_framework_text() -> str:
    """
    Extracts the core timing framework rules from prompts.py.
    This is a helper for testing and for music_agent.py to use.
    """
    framework_text = ""
    try:
        # Extract from mutate_prompt_template
        mutate_start_marker = "# ===== PERFECT TIMING FRAMEWORK ====="
        mutate_end_marker = "```\n\nINSTRUCTIONS:" # Marks end of python block in prompt
        
        start_idx_mutate = mutate_prompt_template.find(mutate_start_marker)
        if start_idx_mutate != -1:
            end_idx_mutate = mutate_prompt_template.find(mutate_end_marker, start_idx_mutate)
            if end_idx_mutate != -1:
                actual_framework_mutate = mutate_prompt_template[start_idx_mutate : mutate_prompt_template.rfind("```", start_idx_mutate, end_idx_mutate) + 3]
                framework_text += actual_framework_mutate + "\n\n"
            else: # Fallback if specific end marker not found, try to grab reasonable chunk
                fallback_end_idx_mutate = mutate_prompt_template.find("SUCCESS CRITERIA:", start_idx_mutate)
                if fallback_end_idx_mutate != -1:
                     actual_framework_mutate = mutate_prompt_template[start_idx_mutate : fallback_end_idx_mutate]
                     framework_text += actual_framework_mutate + "\n\n"

        # Extract from system_prompt
        system_rules_start_marker = "TIMING ALIGNMENT RULES (EXTREMELY IMPORTANT):"
        system_rules_end_marker = "FAILURE MODES TO AVOID:"
        start_idx_system = system_prompt.find(system_rules_start_marker)
        if start_idx_system != -1:
            end_idx_system = system_prompt.find(system_rules_end_marker, start_idx_system)
            if end_idx_system != -1:
                system_rules_text = system_prompt[start_idx_system:end_idx_system]
                framework_text += system_rules_text
            else: # Fallback for system prompt rules
                fallback_end_idx_system = system_prompt.find("You're expected to prioritize musical enjoyment", start_idx_system)
                if fallback_end_idx_system != -1:
                    system_rules_text = system_prompt[start_idx_system:fallback_end_idx_system]
                    framework_text += system_rules_text
        
        if not framework_text:
            return "Error: Critical framework text could not be extracted. Validation will be impaired."
            
    except Exception as e:
        return f"Error during framework extraction: {str(e)}. Validation will be impaired."
    
    return framework_text.strip() 