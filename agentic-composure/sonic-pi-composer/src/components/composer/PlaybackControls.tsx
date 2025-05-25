// Playback Controls Component
// TODO: Play/Stop/Status controls

'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Square, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNowPlaying } from '@/contexts/NowPlayingContext';

interface PlaybackControlsProps {
  code: string;
  autoPlay?: boolean;
}

export function PlaybackControls({ code, autoPlay = false }: PlaybackControlsProps) {
  const [status, setStatus] = useState("Ready");
  const [isPending, startTransition] = useTransition();
  const [isProductionEnv, setIsProductionEnv] = useState(false);
  const [productionMessage, setProductionMessage] = useState<string>("");
  const lastCodeRef = useRef<string>("");
  const { isPlaying, setPlayingCode, stopPlaying, generationStatus, currentCode, startTrackLoading } = useNowPlaying();

  // Check if we're in a production environment on component mount
  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const response = await fetch("/api/play");
        const result = await response.json();
        
        if (result.isProduction) {
          setIsProductionEnv(true);
          setProductionMessage(result.message);
          setStatus('Production Environment - Sonic Pi Required Locally');
        }
      } catch (error) {
        // If the check fails, assume we can try to play
        console.log('Environment check failed, assuming local environment');
      }
    };
    
    checkEnvironment();
  }, []);

  // Handle play button click
  const handlePlay = useCallback(async () => {
    if (!code.trim()) {
      setStatus('No code to play');
      return;
    }

    if (isProductionEnv) {
      setStatus('❌ Sonic Pi required locally');
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
        
        const response = await fetch("/api/play", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        
        const result = await response.json();
        
        // Handle production environment response
        if (result.isProduction) {
          setIsProductionEnv(true);
          setProductionMessage(result.message);
          setStatus('❌ Production Environment - Sonic Pi Required Locally');
          return;
        }
        
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
  }, [code, autoPlay, isPlaying, setPlayingCode, startTrackLoading, isProductionEnv]);

  // Auto-play when new code is received (but not in production)
  useEffect(() => {
    if (
      autoPlay && 
      code && 
      code !== lastCodeRef.current && 
      code.trim() && 
      generationStatus === 'idle' &&
      code !== currentCode && // Don't auto-play if this code is already playing
      !isProductionEnv // Don't auto-play in production
    ) {
      lastCodeRef.current = code;
      handlePlay();
    }
  }, [code, autoPlay, generationStatus, handlePlay, currentCode, isProductionEnv]);

  // Handle stop button click
  const handleStop = async () => {
    if (isProductionEnv) {
      setStatus('❌ Sonic Pi required locally');
      return;
    }

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
      {/* Production Environment Warning */}
      {isProductionEnv && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="space-y-2">
              <p className="font-medium">Sonic Pi Required Locally</p>
              <p className="text-sm">This app needs Sonic Pi running on your local machine. It cannot play music from remote servers.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                  <a href="https://sonic-pi.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Download Sonic Pi
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                  <a href="/dashboard/docs" className="flex items-center gap-1">
                    Setup Guide
                  </a>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {autoPlay && !isProductionEnv && (
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
          disabled={isPending || !code.trim() || isPlaying || isProductionEnv}
          size="lg"
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isPending && !isPlaying ? 'Starting...' : 'Play'}
        </Button>
        
        <Button
          onClick={handleStop}
          disabled={isPending || !isPlaying || isProductionEnv}
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
