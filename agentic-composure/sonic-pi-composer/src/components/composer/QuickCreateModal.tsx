// Quick Create Modal Component
// Modal version of AI prompt input for creating music from anywhere in the app

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Music, Volume2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNowPlaying } from "@/contexts/NowPlayingContext";
import { Badge } from "@/components/ui/badge";

interface QuickCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCreateModal({ open, onOpenChange }: QuickCreateModalProps) {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const router = useRouter();
  const { isPlaying, currentCode } = useNowPlaying();

  // Determine if we're in modify mode
  const isModifyMode = isPlaying && currentCode;

  const handleGenerate = () => {
    if (!currentPrompt.trim()) return;
    
    // Store the prompt and navigate to composer
    if (isModifyMode) {
      localStorage.setItem('quickCreateModification', currentPrompt);
    } else {
      localStorage.setItem('quickCreatePrompt', currentPrompt);
    }
    
    // Reset and close modal
    handleReset();
    onOpenChange(false);
    
    // Navigate to composer page
    router.push('/dashboard/compose');
  };

  const handleReset = () => {
    setCurrentPrompt("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when modal is closed
      handleReset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            {isModifyMode ? "Modify Playing Music" : "Quick Create Music"}
          </DialogTitle>
          <DialogDescription>
            {isModifyMode 
              ? "Describe your changes and we'll take you to the composer to apply them"
              : "Describe your music and we'll take you to the composer to generate it"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Currently Playing Code Preview - Only show in modify mode */}
          {isModifyMode && (
            <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                  <h4 className="font-medium text-primary">Currently Playing</h4>
                </div>
                <Badge variant="default" className="text-xs">
                  {currentCode?.length || 0} chars
                </Badge>
              </div>
              <div className="bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {currentCode?.substring(0, 300)}
                  {currentCode && currentCode.length > 300 && "..."}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Your modifications will be applied to this composition
              </p>
            </div>
          )}

          {/* Simple Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">
              {isModifyMode ? "Describe your modifications" : "Describe your music"}
            </Label>
            <Textarea
              id="prompt"
              rows={4}
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder={
                isModifyMode 
                  ? "e.g. Make it faster, add more bass, make it more energetic" 
                  : "e.g. Chill lofi beat with piano and soft drums"
              }
            />
            {isModifyMode && (
              <p className="text-xs text-muted-foreground">
                💡 You&apos;re modifying the currently playing composition
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!currentPrompt.trim()}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            {isModifyMode ? "Go & Modify" : "Go & Generate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 