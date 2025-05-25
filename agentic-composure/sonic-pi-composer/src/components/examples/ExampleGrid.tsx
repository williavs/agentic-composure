// Example Grid Component
// Predefined prompts for quick Sonic Pi generation

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Zap, Coffee, Sparkles, Piano, Drum, Speaker, Waves } from 'lucide-react';

interface ExamplePrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  style: 'ambient' | 'techno' | 'lofi' | 'experimental' | 'classical' | 'jazz' | 'electronic' | 'custom';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const examplePrompts: ExamplePrompt[] = [
  {
    id: 'lofi-chill',
    title: 'Lofi Chill Beats',
    description: 'Relaxed hip-hop with vinyl texture',
    prompt: 'Create a laid-back lofi hip-hop beat with jazz chords, soft drums, and vinyl crackle. Make it perfect for studying or relaxing.',
    style: 'lofi',
    icon: Coffee
  },
  {
    id: 'ambient-space',
    title: 'Ambient Soundscape',
    description: 'Atmospheric space music',
    prompt: 'Generate a dreamy ambient soundscape with ethereal pads, gentle reverb, and slow evolving textures that transport me to outer space.',
    style: 'ambient',
    icon: Waves
  },
  {
    id: 'techno-dance',
    title: 'Driving Techno',
    description: 'High-energy dance floor anthem',
    prompt: 'Create an energetic techno track with a pounding 4/4 kick, acid bassline, and hypnotic arpeggios. Make it dancefloor ready!',
    style: 'techno',
    icon: Zap
  },
  {
    id: 'jazz-fusion',
    title: 'Jazz Fusion',
    description: 'Complex harmonies and swing',
    prompt: 'Compose a sophisticated jazz piece with complex chord progressions, walking basslines, and improvised melodic lines.',
    style: 'jazz',
    icon: Piano
  },
  {
    id: 'experimental-glitch',
    title: 'Glitch Experiment',
    description: 'Unconventional sound design',
    prompt: 'Create an experimental glitch piece with stuttering rhythms, pitched vocal samples, and creative use of effects and modulation.',
    style: 'experimental',
    icon: Sparkles
  },
  {
    id: 'drum-pattern',
    title: 'Funky Drums',
    description: 'Groove-focused rhythm section',
    prompt: 'Build a funky drum pattern with syncopated kicks, crisp snares, and layered percussion that makes you want to move.',
    style: 'electronic',
    icon: Drum
  },
  {
    id: 'classical-piano',
    title: 'Classical Piano',
    description: 'Traditional composition style',
    prompt: 'Write a beautiful classical piano piece with elegant melodies, proper voice leading, and emotional depth in a minor key.',
    style: 'classical',
    icon: Piano
  },
  {
    id: 'bass-house',
    title: 'Bass House',
    description: 'Heavy bass and punchy beats',
    prompt: 'Create a bass house track with wobbling sub-bass, tight drums, and filtered stabs that hits hard in the club.',
    style: 'electronic',
    icon: Speaker
  },
  {
    id: 'minimal-techno',
    title: 'Minimal Techno',
    description: 'Stripped-down electronic',
    prompt: 'Generate minimal techno with subtle percussion, evolving textures, and hypnotic repetition that builds tension slowly.',
    style: 'techno',
    icon: Music
  }
];

interface ExampleGridProps {
  onSelectPrompt: (prompt: string, style: string) => void;
}

export function ExampleGrid({ onSelectPrompt }: ExampleGridProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Quick Start Examples</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click any example below to populate the prompt field and get started
        </p>
      </div>
      
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examplePrompts.map((example) => {
          const IconComponent = example.icon;
          return (
            <Card 
              key={example.id} 
              className="cursor-pointer hover:shadow-md transition-shadow group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <CardTitle className="text-sm">{example.title}</CardTitle>
                  </div>
                  <Badge className="text-xs bg-primary text-primary-foreground">
                    {example.style}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {example.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                  {example.prompt}
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => onSelectPrompt(example.prompt, example.style)}
                >
                  Use This Prompt
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center text-xs text-muted-foreground">
        💡 These examples use our bulletproof prompting system to generate valid Sonic Pi code
      </div>
    </div>
  );
}
