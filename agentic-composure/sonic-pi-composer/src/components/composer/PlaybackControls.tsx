// Playback Controls Component
// TODO: Play/Stop/Status controls

'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Square } from 'lucide-react';
import { useNowPlaying } from '@/contexts/NowPlayingContext';

interface PlaybackControlsProps {
  code: string;
  autoPlay?: boolean;
}

export function PlaybackControls({ code, autoPlay = false }: PlaybackControlsProps) {
  const [status, setStatus] = useState("Ready");
  const [isPending, startTransition] = useTransition();
  const lastCodeRef = useRef<string>("");
  const { isPlaying, setPlayingCode, stopPlaying, generationStatus, currentCode, startTrackLoading } = useNowPlaying();

  // Handle play button click
  const handlePlay = useCallback(async () => {
    if (!code.trim()) {
      setStatus('No code to play');
      return;
    }

    setStatus('Loading track...');
    startTrackLoading(); // Set loading track state for global UI
    startTransition(async () => {
      try {
        // If something is already playing and we're auto-playing new code, stop first
        if (autoPlay && isPlaying) {
          await fetch("/api/play", { method: "DELETE" });
        }
        
        const result = await fetch("/api/play", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }).then((res) => res.json());
        
        if (result.success) {
          setStatus('✅ Playing!');
          setPlayingCode(code); // Update global state with current code (this will end loading state)
        } else {
          setStatus(`❌ ${result.message || 'Playback failed'}`);
        }
      } catch (error) {
        setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }, [code, autoPlay, isPlaying, setPlayingCode, startTrackLoading]);

  // Auto-play when new code is received
  useEffect(() => {
    if (
      autoPlay && 
      code && 
      code !== lastCodeRef.current && 
      code.trim() && 
      generationStatus === 'idle' &&
      code !== currentCode // Don't auto-play if this code is already playing
    ) {
      lastCodeRef.current = code;
      handlePlay();
    }
  }, [code, autoPlay, generationStatus, handlePlay, currentCode]);

  // Handle stop button click
  const handleStop = async () => {
    setStatus('Stopping...');
    startTransition(async () => {
      try {
        const result = await fetch("/api/play", {
          method: "DELETE",
        }).then((res) => res.json());
        
        if (result.success) {
          setStatus('🛑 Stopped');
          stopPlaying(); // Update global state
        } else {
          setStatus(`❌ ${result.message || 'Stop failed'}`);
        }
      } catch (error) {
        setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  const getStatusVariant = () => {
    if (status.includes("✅")) return "default";
    if (status.includes("🛑")) return "secondary";
    if (status.includes("❌")) return "destructive";
    return "outline";
  };

  return (
    <div className="space-y-4">
      {autoPlay && (
        <Card>
          <CardContent className="p-4">
            <Badge variant="secondary" className="text-sm">
              🎵 Auto-play enabled - Generated music will play automatically
            </Badge>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center space-x-3">
        <Button
          onClick={handlePlay}
          disabled={isPending || !code.trim() || isPlaying}
          size="lg"
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isPending && !isPlaying ? 'Starting...' : 'Play'}
        </Button>
        
        <Button
          onClick={handleStop}
          disabled={isPending || !isPlaying}
          variant="destructive"
          size="lg"
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4" />
          {isPending && isPlaying ? 'Stopping...' : 'Stop'}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Badge variant={getStatusVariant()}>
          {status}
        </Badge>
      </div>
    </div>
  );
}
