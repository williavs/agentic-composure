'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Square, Volume2 } from 'lucide-react';
import { useNowPlaying } from '@/contexts/NowPlayingContext';

export function GlobalPlaybackStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, stopPlaying } = useNowPlaying();

  // Handle stop button click
  const handleStop = async () => {
    setIsLoading(true);
    try {
      const result = await fetch("/api/play", {
        method: "DELETE",
      }).then((res) => res.json());
      
      if (result.success) {
        stopPlaying();
      }
    } catch (error) {
      console.error('Error stopping playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if not playing
  if (!isPlaying) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-lg border-primary/20 bg-background/95 backdrop-blur">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary animate-pulse" />
            <Badge variant="default" className="text-xs">
              Now Playing
            </Badge>
          </div>
          
          <Button
            onClick={handleStop}
            disabled={isLoading}
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 text-xs"
          >
            <Square className="h-3 w-3" />
            {isLoading ? 'Stopping...' : 'Stop'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 