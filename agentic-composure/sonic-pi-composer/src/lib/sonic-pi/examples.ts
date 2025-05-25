// Sonic Pi Examples Library
// TODO: Expand with more examples

export interface SonicPiExample {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'professional' | 'experimental';
  code: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in seconds
}

export const sonicPiExamples: SonicPiExample[] = [
  {
    id: 'basic-beat',
    name: 'Basic Beat',
    description: 'A simple drum pattern to get started',
    category: 'basic',
    code: `# Basic Beat
live_loop :drums do
  sample :bd_haus
  sleep 1
  sample :sn_dub
  sleep 1
end`,
    tags: ['drums', 'loop', 'beginner'],
    difficulty: 'beginner',
    duration: 8
  },
  {
    id: 'melody-line',
    name: 'Simple Melody',
    description: 'A basic melody using the piano synth',
    category: 'basic',
    code: `# Simple Melody
use_synth :piano
play_pattern_timed [:c4, :e4, :g4, :c5], [0.5, 0.5, 0.5, 1]`,
    tags: ['melody', 'piano', 'beginner'],
    difficulty: 'beginner',
    duration: 2.5
  },
  {
    id: 'ambient-pad',
    name: 'Ambient Pad',
    description: 'Atmospheric pad sounds with reverb',
    category: 'professional',
    code: `# Ambient Pad
use_synth :pad
with_fx :reverb, room: 0.8 do
  play_chord [:c3, :e3, :g3, :c4], sustain: 4, amp: 0.6
  sleep 4
  play_chord [:f3, :a3, :c4, :f4], sustain: 4, amp: 0.6
  sleep 4
end`,
    tags: ['ambient', 'pad', 'reverb', 'chords'],
    difficulty: 'intermediate',
    duration: 8
  }
];

export const getExamplesByCategory = (category: string): SonicPiExample[] => {
  return sonicPiExamples.filter(example => example.category === category);
};

export const getExampleById = (id: string): SonicPiExample | undefined => {
  return sonicPiExamples.find(example => example.id === id);
};

export const searchExamples = (query: string): SonicPiExample[] => {
  const lowercaseQuery = query.toLowerCase();
  return sonicPiExamples.filter(example => 
    example.name.toLowerCase().includes(lowercaseQuery) ||
    example.description.toLowerCase().includes(lowercaseQuery) ||
    example.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getCategories = (): string[] => {
  return ['basic', 'professional', 'experimental'];
}; 