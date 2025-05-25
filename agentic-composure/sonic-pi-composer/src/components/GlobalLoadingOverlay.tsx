// Global Loading Overlay Component
// Prevents user interactions during AI generation and autoplay process

'use client';

import { useNowPlaying } from "@/contexts/NowPlayingContext";
import { Sparkles, Music, Volume2, Play } from "lucide-react";

export function GlobalLoadingOverlay() {
  const { generationStatus } = useNowPlaying();
  
  // Show overlay during any AI processing
  const isProcessing = generationStatus !== 'idle';
  
  if (!isProcessing) return null;

  // Handle clicks to show they're blocked
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add a subtle shake animation to the modal
    const modal = e.currentTarget.querySelector('.modal-content');
    if (modal) {
      modal.classList.add('animate-pulse');
      setTimeout(() => {
        modal.classList.remove('animate-pulse');
      }, 300);
    }
  };

  const getStatusIcon = () => {
    switch (generationStatus) {
      case 'generating':
        return <Sparkles className="h-8 w-8 text-primary animate-spin" />;
      case 'modifying':
        return <Music className="h-8 w-8 text-primary animate-pulse" />;
      case 'starting_playback':
        return <Volume2 className="h-8 w-8 text-primary animate-pulse" />;
      case 'loading_track':
        return <Play className="h-8 w-8 text-primary animate-bounce" />;
      default:
        return <Sparkles className="h-8 w-8 text-primary animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (generationStatus) {
      case 'generating':
        return 'AI is composing your music...';
      case 'modifying':
        return 'Modifying your composition...';
      case 'starting_playback':
        return 'Starting playback...';
      case 'loading_track':
        return 'Loading track...';
      default:
        return 'Processing...';
    }
  };

  const getStatusSubtext = () => {
    switch (generationStatus) {
      case 'generating':
        return 'Please wait while we create your composition';
      case 'modifying':
        return 'Applying your vibe changes to the music';
      case 'starting_playback':
        return 'Getting ready to play your music';
      case 'loading_track':
        return 'Almost ready...';
      default:
        return 'Please wait...';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
      style={{ pointerEvents: 'all' }} // Ensure this blocks all clicks
      onClick={handleClick}
    >
      <div className="modal-content bg-card/95 backdrop-blur border border-primary/20 rounded-lg p-8 shadow-2xl max-w-md mx-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          {getStatusIcon()}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              {getStatusText()}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getStatusSubtext()}
            </p>
          </div>
          
          {/* Loading dots animation */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
          
          <p className="text-xs text-muted-foreground/70">
            Please be patient and vibe close to the sun.
          </p>
        </div>
      </div>
    </div>
  );
} 