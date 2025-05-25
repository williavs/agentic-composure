// Example Card Component
// TODO: Individual example display

'use client';

import { SonicPiExample } from '@/lib/sonic-pi/examples';

interface ExampleCardProps {
  example: SonicPiExample;
}

export function ExampleCard({ example }: ExampleCardProps) {
  // TODO: Add card styling
  // TODO: Add play button
  // TODO: Add code preview
  // TODO: Add tags

  return (
    <div className="border rounded-md p-4 space-y-2">
      <h3 className="font-medium">{example.name}</h3>
      <p className="text-sm text-muted-foreground">{example.description}</p>
      
      {/* TODO: Add code preview */}
      {/* TODO: Add play button */}
      {/* TODO: Add tags */}
    </div>
  );
}
