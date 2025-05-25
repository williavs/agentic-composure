'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NowPlayingState {
  isPlaying: boolean;
  currentCode: string;
  timestamp: number;
  generationStatus: 'idle' | 'generating' | 'modifying' | 'starting_playback' | 'loading_track';
}

interface NowPlayingContextType extends NowPlayingState {
  setPlayingCode: (code: string) => Promise<void>;
  stopPlaying: () => void;
  updatePlayingStatus: (isPlaying: boolean) => void;
  replacePlayingCode: (code: string) => Promise<boolean>;
  startAiGeneration: () => void;
  startAiModification: () => void;
  startPlaybackWait: () => void;
  startTrackLoading: () => void;
  endAiProcessing: () => void;
}

const NowPlayingContext = createContext<NowPlayingContextType | undefined>(undefined);

interface NowPlayingProviderProps {
  children: ReactNode;
}

export function NowPlayingProvider({ children }: NowPlayingProviderProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingState>({
    isPlaying: false,
    currentCode: '',
    timestamp: 0,
    generationStatus: 'idle'
  });

  // Check server status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/play');
        const data = await response.json();
        
        if (data.isPlaying !== nowPlaying.isPlaying) {
          setNowPlaying(prev => ({
            ...prev,
            isPlaying: data.isPlaying || false
          }));
        }
      } catch (error) {
        console.debug('Could not check playback status:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [nowPlaying.isPlaying]);

  const setPlayingCode = async (code: string) => {
    // Start loading track state
    setNowPlaying(prev => ({
      ...prev,
      generationStatus: 'loading_track'
    }));
    
    try {
      const result = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }).then((res) => res.json());
      
      if (result.success) {
        setNowPlaying({
          isPlaying: true,
          currentCode: code,
          timestamp: Date.now(),
          generationStatus: 'idle' // End processing when successful
        });
      } else {
        // If failed, end processing but don't start playing
        setNowPlaying(prev => ({
          ...prev,
          generationStatus: 'idle'
        }));
      }
    } catch (error) {
      console.error('Error starting playback:', error);
      // End processing on error
      setNowPlaying(prev => ({
        ...prev,
        generationStatus: 'idle'
      }));
    }
  };

  const stopPlaying = () => {
    setNowPlaying(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const updatePlayingStatus = (isPlaying: boolean) => {
    setNowPlaying(prev => ({
      ...prev,
      isPlaying
    }));
  };

  // Replace playing code with new code (for modifications)
  const replacePlayingCode = async (newCode: string): Promise<boolean> => {
    try {
      // Stop current playback first
      await fetch("/api/play", { method: "DELETE" });
      
      // Start new playback
      const result = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode }),
      }).then((res) => res.json());
      
      if (result.success) {
        setNowPlaying({
          isPlaying: true,
          currentCode: newCode,
          timestamp: Date.now(),
          generationStatus: 'idle'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error replacing playing code:', error);
      return false;
    }
  };

  const startAiGeneration = () => {
    setNowPlaying(prev => ({
      ...prev,
      generationStatus: 'generating'
    }));
  };

  const startAiModification = () => {
    setNowPlaying(prev => ({
      ...prev,
      generationStatus: 'modifying'
    }));
  };

  const startPlaybackWait = () => {
    setNowPlaying(prev => ({
      ...prev,
      generationStatus: 'starting_playback'
    }));
  };

  const startTrackLoading = () => {
    setNowPlaying(prev => ({
      ...prev,
      generationStatus: 'loading_track'
    }));
  };

  const endAiProcessing = () => {
    setNowPlaying(prev => ({
      ...prev,
      generationStatus: 'idle'
    }));
  };

  const contextValue: NowPlayingContextType = {
    ...nowPlaying,
    setPlayingCode,
    stopPlaying,
    updatePlayingStatus,
    replacePlayingCode,
    startAiGeneration,
    startAiModification,
    startPlaybackWait,
    startTrackLoading,
    endAiProcessing
  };

  return (
    <NowPlayingContext.Provider value={contextValue}>
      {children}
    </NowPlayingContext.Provider>
  );
}

export function useNowPlaying() {
  const context = useContext(NowPlayingContext);
  if (context === undefined) {
    throw new Error('useNowPlaying must be used within a NowPlayingProvider');
  }
  return context;
} 