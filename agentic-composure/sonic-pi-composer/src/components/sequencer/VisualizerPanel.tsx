'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { VisualizerCanvas } from "./VisualizerCanvas";

export default function VisualizerPanel() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Sequencer Visualizer - Fullscreen</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2"
          >
            <Minimize2 className="h-4 w-4" />
            Exit Fullscreen
          </Button>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <VisualizerCanvas />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Sequencer Visualizer</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Fullscreen
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 relative p-0 overflow-hidden">
        <VisualizerCanvas />
      </CardContent>
    </Card>
  );
} 