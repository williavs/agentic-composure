'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Grid3X3, ChevronDown, Code } from "lucide-react";
import { CodeEditor } from "@/components/composer/CodeEditor";
import { useNowPlaying } from "@/contexts/NowPlayingContext";
import { parseCodeStructure } from "@/components/sequencer/codeParser";
import { SequencerStatusBar } from "@/components/sequencer/SequencerStatusBar";
import SequencerVisualizer from "@/components/sequencer/SequencerVisualizer";

export default function SequencerPage() {
  const [editingCode, setEditingCode] = useState('');
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { isPlaying, currentCode } = useNowPlaying();
  
  // Update editing code when now playing changes
  useEffect(() => {
    if (currentCode && currentCode !== editingCode) {
      setEditingCode(currentCode);
      setIsUserEditing(false); // Reset editing flag when new code comes in
      if (isPlaying) {
        setIsCodeEditorOpen(true); // Expand when showing active code
      }
    }
  }, [currentCode, isPlaying]);

  // Use currently playing code or fallback to editing code
  const activeCode = (isPlaying && currentCode) ? currentCode : editingCode;
  const codeStructure = parseCodeStructure(activeCode);
  const beatInterval = 60000 / codeStructure.bpm;

  // Beat counter when playing
  useEffect(() => {
    if (isPlaying && activeCode) {
      beatIntervalRef.current = setInterval(() => {
        setCurrentBeat(prev => prev + 1);
      }, beatInterval);
    } else {
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
      setCurrentBeat(0);
    }

    return () => {
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
    };
  }, [isPlaying, beatInterval, activeCode]);

  // Handle user code edits
  const handleCodeChange = (newCode: string) => {
    setEditingCode(newCode);
    setIsUserEditing(true);
  };

  // Handle successful play of edited track
  const handleEditedTrackPlayed = () => {
    setEditingCode(currentCode); // Sync with what's actually playing
    setIsUserEditing(false); // User changes have been applied
  };

  // Show message when no code is available
  const hasCode = Boolean(activeCode?.trim());

  return (
    <div className="space-y-6">
      {/* Minimal Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <Grid3X3 className="h-6 w-6" />
            Live Sequencer
            {isPlaying && currentCode && (
              <Badge variant="default" className="ml-2">
                Visualizing Now Playing
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {hasCode 
              ? "Real-time visualization of Sonic Pi code structure and beats."
              : "Generate music using the Composer or Quick Create to see live visualization here."
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Status Bar - only show when we have code */}
      {hasCode && (
        <SequencerStatusBar 
          codeStructure={codeStructure}
          isPlaying={isPlaying}
          currentBeat={currentBeat}
        />
      )}

      <div className="space-y-6">
        {/* Code Editor - Collapsible */}
        <Card>
          <Collapsible open={isCodeEditorOpen} onOpenChange={setIsCodeEditorOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">
                        {isPlaying && currentCode ? 'Now Playing Code' : 'Code Editor'}
                      </CardTitle>
                      <CardDescription>
                        {isPlaying && currentCode 
                          ? 'Visualizing and editing the currently playing composition'
                          : hasCode
                            ? 'Edit Sonic Pi code to see structure visualization'
                            : 'No code loaded - generate music to see it here'
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isCodeEditorOpen && editingCode && (
                      <Badge variant="secondary" className="text-xs">
                        {editingCode.length} chars
                      </Badge>
                    )}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isCodeEditorOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
              <CardContent className="pt-0">
                <CodeEditor 
                  code={editingCode} 
                  onChange={handleCodeChange}
                  onEditedTrackPlayed={handleEditedTrackPlayed}
                  hasUnsavedChanges={isUserEditing}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Visualizer Panel - only show when we have code */}
        {hasCode ? (
          <SequencerVisualizer />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="space-y-4">
                <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">No Music to Visualize</h3>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Generate music using the Composer or Quick Create button to see live visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 