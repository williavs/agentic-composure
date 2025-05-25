// Music Composer Client Component
// Contains all state and interactive logic for the composer interface

'use client';

import { useState, useEffect } from "react";
import { AIPromptInput } from "@/components/composer/AIPromptInput";
import { CodeEditor } from "@/components/composer/CodeEditor";
import { ExampleGrid } from "@/components/examples/ExampleGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles, Code } from "lucide-react";
import { useNowPlaying } from "@/contexts/NowPlayingContext";
import { Badge } from "@/components/ui/badge";

interface MusicComposerProps {
  initialCode?: string;
}

export function MusicComposer({ initialCode }: MusicComposerProps) {
  const [editingCode, setEditingCode] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentStyle, setCurrentStyle] = useState("custom");
  const [isExamplesOpen, setIsExamplesOpen] = useState(true);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  
  const { isPlaying, currentCode } = useNowPlaying();

  // Extract variables to add as dependencies
  const initialCodeValue = initialCode || '';
  const currentCodeValue = currentCode || '';
  
  useEffect(() => {
    // Get localStorage values
    const selectedPrompt = localStorage.getItem('selectedPrompt');
    const selectedStyle = localStorage.getItem('selectedStyle');
    const quickCreateCode = localStorage.getItem('quickCreateCode');
    const quickCreatePrompt = localStorage.getItem('quickCreatePrompt');
    const quickCreateModification = localStorage.getItem('quickCreateModification');
    
    // Initialize code states when initial code changes
    if (initialCodeValue && initialCodeValue !== editingCode) {
      setEditingCode(initialCodeValue);
      setIsCodeEditorOpen(true); // Show code editor when initial code is provided
    }

    // Handle selected prompt/style from localStorage (new music)
    if (selectedPrompt && selectedStyle && !initialCodeValue && !isPlaying) {
      setCurrentPrompt(selectedPrompt);
      setCurrentStyle(selectedStyle);
      setIsExamplesOpen(false); // Collapse examples since user already selected one
      
      // Clear the localStorage values
      localStorage.removeItem('selectedPrompt');
      localStorage.removeItem('selectedStyle');
    }

    // Handle Quick Create prompt (new music)
    if (quickCreatePrompt && !initialCodeValue && !isPlaying) {
      setCurrentPrompt(quickCreatePrompt);
      setCurrentStyle('custom');
      setIsExamplesOpen(false); // Hide examples when using quick create
      
      // Clear the localStorage value
      localStorage.removeItem('quickCreatePrompt');
      
      // Auto-trigger generation after a short delay to ensure component is ready
      setTimeout(() => {
        // Find and click the generate button
        const generateButton = document.querySelector('[data-generate-button]') as HTMLButtonElement;
        if (generateButton) {
          generateButton.click();
        }
      }, 100);
    }

    // Handle Quick Create modification (existing music)
    if (quickCreateModification && isPlaying && currentCodeValue) {
      setCurrentPrompt(quickCreateModification);
      setCurrentStyle('custom');
      setIsExamplesOpen(false); // Hide examples when modifying
      
      // Clear the localStorage value
      localStorage.removeItem('quickCreateModification');
      
      // Auto-trigger generation after a short delay to ensure component is ready
      setTimeout(() => {
        // Find and click the generate button
        const generateButton = document.querySelector('[data-generate-button]') as HTMLButtonElement;
        if (generateButton) {
          generateButton.click();
        }
      }, 100);
    }

    // Handle Quick Create code (legacy support)
    if (quickCreateCode && !initialCodeValue) {
      setEditingCode(quickCreateCode);
      setIsExamplesOpen(false); // Hide examples when showing quick create code
      setIsCodeEditorOpen(true); // Show code editor when displaying quick create code
      
      // Clear the localStorage value
      localStorage.removeItem('quickCreateCode');
    }
  }, [initialCodeValue, isPlaying, currentCodeValue, editingCode]);

  const handleSelectPrompt = (prompt: string, style: string) => {
    setCurrentPrompt(prompt);
    setCurrentStyle(style);
    setIsExamplesOpen(false); // Collapse after selection
  };

  // Show examples only if not playing something or no initial code
  const showExamples = !isPlaying && !initialCode;

  // Handle user code edits (only affects editing code, not playback)
  const handleCodeChange = (newCode: string) => {
    setEditingCode(newCode);
    setIsUserEditing(true); // Mark that user is actively editing
  };

  // Handle AI code generation (updates both states)
  const handleAICodeGenerated = (newCode: string) => {
    setEditingCode(newCode); // Sync editing code with generated code
    setIsUserEditing(false); // Clear editing flag since this is AI-generated
  };

  // Handle successful play of edited track (clears editing flag and syncs states)
  const handleEditedTrackPlayed = () => {
    setEditingCode(editingCode); // Sync generated code with applied edits
    setIsUserEditing(false); // User changes have been applied
  };

  return (
    <div className="space-y-8">
      {/* Expandable Quick Start Examples - Hidden when showing now playing */}
      {showExamples && (
        <Card>
          <Collapsible open={isExamplesOpen} onOpenChange={setIsExamplesOpen}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Quick Start Examples</CardTitle>
                    <CardDescription>
                      Choose from preset prompts to get started instantly
                    </CardDescription>
                  </div>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isExamplesOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle examples</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <ExampleGrid onSelectPrompt={handleSelectPrompt} />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* AI Prompt Input - Modified when showing now playing */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isPlaying && currentCode ? "Modify This Composition" : "Describe Your Music"}
          </CardTitle>
          <CardDescription>
            {isPlaying && currentCode 
              ? "Describe changes you'd like to make to the currently playing music"
              : "Tell the AI what kind of music you want to create"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIPromptInput 
            onCodeGenerated={handleAICodeGenerated}
            prompt={currentPrompt}
            onPromptChange={setCurrentPrompt}
            style={currentStyle}
            autoPlay={true}
          />
        </CardContent>
      </Card>

      {/* Code Editor - Collapsible */}
      <Card>
        <Collapsible open={isCodeEditorOpen} onOpenChange={setIsCodeEditorOpen}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>
                    {isPlaying && currentCode ? "Currently Playing Code" : "Edit & Play Code"}
                  </CardTitle>
                  <CardDescription>
                    {isPlaying && currentCode 
                      ? "This is the active composition - edit and replay to hear changes"
                      : "Review, modify, and play the generated Sonic Pi code"
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
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isCodeEditorOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle code editor</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
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
    </div>
  );
} 