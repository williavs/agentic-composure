import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Volume2 } from "lucide-react";
import { CodeStructure } from "./codeParser";

interface SequencerStatusBarProps {
  codeStructure: CodeStructure;
  isPlaying: boolean;
  currentBeat: number;
}

export function SequencerStatusBar({ codeStructure, isPlaying, currentBeat }: SequencerStatusBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{codeStructure.bpm} BPM</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              <Badge variant={isPlaying ? "default" : "secondary"}>
                {isPlaying ? 'Playing' : 'Stopped'}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Beat: {currentBeat}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{codeStructure.liveLoops.length} Loops</Badge>
            <Badge variant="outline">{codeStructure.samples.length} Samples</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 