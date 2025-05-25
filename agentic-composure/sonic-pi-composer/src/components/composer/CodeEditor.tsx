// Code Editor Component with Monaco
// TODO: Sonic Pi syntax highlighting

'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { useNowPlaying } from '@/contexts/NowPlayingContext';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onEditedTrackPlayed?: () => void;
  hasUnsavedChanges?: boolean;
}

export function CodeEditor({ code, onChange, onEditedTrackPlayed, hasUnsavedChanges }: CodeEditorProps) {
  const [playStatus, setPlayStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const { replacePlayingCode, isPlaying } = useNowPlaying();

  const handlePlayEditedTrack = async () => {
    if (!code.trim()) {
      setPlayStatus('No code to play');
      return;
    }

    setPlayStatus('Replacing track...');
    startTransition(async () => {
      try {
        const success = await replacePlayingCode(code);
        if (success) {
          setPlayStatus('✅ Track replaced!');
          setTimeout(() => setPlayStatus(''), 3000); // Clear after 3 seconds
          onEditedTrackPlayed?.(); // Notify parent that edits have been applied
        } else {
          setPlayStatus('❌ Failed to replace track');
          setTimeout(() => setPlayStatus(''), 3000);
        }
      } catch {
        setPlayStatus('❌ Error replacing track');
        setTimeout(() => setPlayStatus(''), 3000);
      }
    });
  };

  const getPlayButtonText = () => {
    if (isPending) return 'Replacing...';
    if (hasUnsavedChanges && isPlaying) return 'Apply Edits';
    if (isPlaying) return 'Replace Playing Track';
    return 'Play This Code';
  };

  const getStatusVariant = () => {
    if (playStatus.includes("✅")) return "default";
    if (playStatus.includes("❌")) return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="code-editor">
            Generated Sonic Pi Code
          </Label>
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
              Unsaved edits
            </Badge>
          )}
        </div>
        {code && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        )}
      </div>
      
      <Textarea
        id="code-editor"
        className="font-mono text-sm bg-muted"
        rows={12}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Generated Sonic Pi code will appear here...&#10;&#10;You can also paste or edit code manually."
      />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {code.length} characters
        </span>
        <div className="flex items-center space-x-2">
          {code && (
            <Button
              onClick={handlePlayEditedTrack}
              disabled={isPending || !code.trim()}
              size="sm"
              className="flex items-center gap-1"
            >
              <Play className="h-3 w-3" />
              {getPlayButtonText()}
            </Button>
          )}
          {playStatus && (
            <Badge variant={getStatusVariant()}>
              {playStatus}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
