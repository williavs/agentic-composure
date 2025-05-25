// AI Prompt Input Component
// Controlled component that can receive prompts from example grid

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Music, Volume2, Play } from 'lucide-react';
import { useNowPlaying } from '@/contexts/NowPlayingContext';

interface AIPromptInputProps {
  onCodeGenerated: (code: string) => void;
  prompt?: string;
  onPromptChange?: (prompt: string) => void;
  style?: string;
  autoPlay?: boolean;
}

export function AIPromptInput({ 
  onCodeGenerated, 
  prompt: externalPrompt = "", 
  onPromptChange,
  style = 'custom',
  autoPlay = false
}: AIPromptInputProps) {
  const [internalPrompt, setInternalPrompt] = useState("");
  const [status, setStatus] = useState("");
  
  const { 
    isPlaying, 
    currentCode, 
    replacePlayingCode, 
    setPlayingCode,
    generationStatus,
    startAiGeneration,
    startAiModification,
    startPlaybackWait,
    endAiProcessing
  } = useNowPlaying();

  // Use external prompt if provided, otherwise use internal state
  const currentPrompt = externalPrompt || internalPrompt;
  
  // Determine if we're in modify mode
  const isModifyMode = isPlaying && currentCode;
  
  // Check if AI is currently processing
  const isProcessing = generationStatus !== 'idle';

  const handlePromptChange = (newPrompt: string) => {
    if (onPromptChange) {
      onPromptChange(newPrompt);
    } else {
      setInternalPrompt(newPrompt);
    }
  };

  async function handleGenerate() {
    if (!currentPrompt.trim()) return;
    
    // Start the appropriate generation state
    if (isModifyMode) {
      startAiModification();
    } else {
      startAiGeneration();
    }
    
    setStatus("Processing...");
    
    try {
      let result;
      
      if (isModifyMode) {
        // Use modify API
        result = await fetch("/api/modify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            currentCode,
            modificationRequest: currentPrompt
          }),
        }).then((res) => res.json());
      } else {
        // Use generation API
        result = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: currentPrompt, 
            style: style,
          }),
        }).then((res) => res.json());
      }
      
      if (result.success) {
        if (isModifyMode) {
          // Use global replace method for seamless music replacement
          const replaced = await replacePlayingCode(result.code);
          if (replaced) {
            onCodeGenerated(result.code);
            setStatus(`✅ ${result.method}`);
          } else {
            setStatus("❌ Failed to replace music");
          }
        } else {
          // Normal generation - handle autoplay
          onCodeGenerated(result.code);
          
          if (autoPlay) {
            setStatus("🎵 Starting playback...");
            startPlaybackWait(); 
            // Start playback automatically
            await setPlayingCode(result.code);
          } else {
            setStatus("✅ Code generated!");
            setTimeout(() => setStatus(''), 3000);
            // End processing since we're not auto-playing
            endAiProcessing();
          }
        }
      } else {
        setStatus(result.error || "❌ Generation failed");
      }
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
      // End processing on error
      endAiProcessing();
    }
  }

  const getStatusVariant = () => {
    if (status.includes("✅")) return "default";
    if (status.includes("❌")) return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt">
          {isModifyMode ? "Describe your modifications" : "Describe your music"}
        </Label>
        <Textarea
          id="prompt"
          rows={3}
          value={currentPrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder={
            isModifyMode 
              ? "e.g. Make it faster, add more bass, make it more energetic" 
              : "e.g. Chill lofi beat with piano and soft drums"
          }
        />
        {isModifyMode && (
          <p className="text-xs text-muted-foreground">
            💡 You&apos;re modifying the currently playing composition. The AI will preserve what works while applying your changes.
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          onClick={handleGenerate}
          disabled={isProcessing || !currentPrompt.trim()}
          size="lg"
          className="min-w-[140px] flex items-center justify-center"
          data-generate-button
        >
          {isProcessing ? (
            <>
              {generationStatus === 'modifying' && (
                <>
                  <Music className="h-4 w-4 mr-2 animate-pulse" />
                  <span>Modifying...</span>
                </>
              )}
              {generationStatus === 'generating' && (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  <span>Generating...</span>
                </>
              )}
              {generationStatus === 'starting_playback' && (
                <>
                  <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                  <span>Starting music...</span>
                </>
              )}
              {generationStatus === 'loading_track' && (
                <>
                  <Play className="h-4 w-4 mr-2 animate-bounce" />
                  <span>Loading track...</span>
                </>
              )}
            </>
          ) : (
            <>
              {isModifyMode ? (
                <>
                  <Music className="h-4 w-4 mr-2" />
                  <span>Modify Code</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Generate Code</span>
                </>
              )}
            </>
          )}
        </Button>
        
        {status && (
          <Badge variant={getStatusVariant()}>
            {status}
          </Badge>
        )}
      </div>
      
      {/* Awesome loading progress indicator */}
      {isProcessing && !isModifyMode && (
        <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">Creating your music...</span>
            <div className="flex items-center space-x-1">
              {generationStatus === 'generating' && (
                <Sparkles className="h-3 w-3 text-primary animate-spin" />
              )}
              {generationStatus === 'starting_playback' && (
                <Volume2 className="h-3 w-3 text-primary animate-pulse" />
              )}
              {generationStatus === 'loading_track' && (
                <Play className="h-3 w-3 text-primary animate-bounce" />
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Step 1: Generate */}
            <div className={`flex items-center space-x-1 transition-colors ${
              generationStatus === 'generating' ? 'text-primary' : 
              (generationStatus === 'starting_playback' || generationStatus === 'loading_track') ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full transition-colors ${
                generationStatus === 'generating' ? 'bg-primary animate-pulse' :
                (generationStatus === 'starting_playback' || generationStatus === 'loading_track') ? 'bg-primary' : 'bg-muted-foreground'
              }`} />
              <span className="text-xs">AI Composing</span>
            </div>
            
            <div className={`h-px flex-1 transition-colors ${
              (generationStatus === 'starting_playback' || generationStatus === 'loading_track') ? 'bg-primary' : 'bg-muted-foreground/30'
            }`} />
            
            {/* Step 2: Start Playback */}
            <div className={`flex items-center space-x-1 transition-colors ${
              generationStatus === 'starting_playback' ? 'text-primary' : 
              generationStatus === 'loading_track' ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full transition-colors ${
                generationStatus === 'starting_playback' ? 'bg-primary animate-pulse' :
                generationStatus === 'loading_track' ? 'bg-primary' : 'bg-muted-foreground/50'
              }`} />
              <span className="text-xs">Starting Playback</span>
            </div>
            
            <div className={`h-px flex-1 transition-colors ${
              generationStatus === 'loading_track' ? 'bg-primary' : 'bg-muted-foreground/30'
            }`} />
            
            {/* Step 3: Loading Track */}
            <div className={`flex items-center space-x-1 transition-colors ${
              generationStatus === 'loading_track' ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full transition-colors ${
                generationStatus === 'loading_track' ? 'bg-primary animate-pulse' : 'bg-muted-foreground/50'
              }`} />
              <span className="text-xs">Loading Track</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
