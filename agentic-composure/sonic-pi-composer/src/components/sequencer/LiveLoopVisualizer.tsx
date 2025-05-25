import { Badge } from "@/components/ui/badge";

interface LiveLoopVisualizerProps {
  loops: string[];
  currentBeat: number;
}

export function LiveLoopVisualizer({ loops, currentBeat }: LiveLoopVisualizerProps) {
  return (
    <div className="space-y-4">
      {loops.map((loop, index) => (
        <div key={loop} className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {loop}
          </Badge>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-100
                  ${(currentBeat + index) % 8 === i
                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 