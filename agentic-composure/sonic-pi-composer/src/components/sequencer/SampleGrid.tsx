import { Badge } from "@/components/ui/badge";

interface SampleGridProps {
  samples: string[];
  currentBeat: number;
}

export function SampleGrid({ samples, currentBeat }: SampleGridProps) {
  const uniqueSamples = [...new Set(samples)];
  
  return (
    <div className="space-y-3">
      {uniqueSamples.map((sample, index) => (
        <div key={sample} className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {sample}
          </Badge>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className={`
                  w-4 h-4 rounded border transition-all duration-100 flex items-center justify-center text-xs
                  ${(currentBeat % 16 === i && (index + currentBeat) % 4 === 0)
                    ? 'bg-accent border-accent-foreground font-bold' 
                    : 'bg-background border-border'
                  }
                `}
              >
                {i % 4 === 0 ? (i / 4 + 1) : ''}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 