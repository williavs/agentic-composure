// Music Composer Page
// Dedicated page for music creation and generation

'use client';

import { MusicComposer } from "@/components/composer/MusicComposer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Volume2 } from "lucide-react";
import Link from "next/link";
import { useNowPlaying } from "@/contexts/NowPlayingContext";

export default function ComposePage() {
  const { isPlaying, currentCode } = useNowPlaying();

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Music className="h-6 w-6" />
              Music Composer
              {isPlaying && (
                <Badge variant="default" className="ml-2 gap-1">
                  <Volume2 className="h-3 w-3 animate-pulse" />
                  Now Playing
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground">
              {isPlaying && currentCode 
                ? "Viewing and editing the currently playing composition"
                : "Create and generate music with AI-powered Sonic Pi code"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Music Composer Interface */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isPlaying && currentCode ? "Now Playing - Music Studio" : "Music Creation Studio"}
          </CardTitle>
          <CardDescription>
            {isPlaying && currentCode 
              ? "This is the code currently being played. You can edit and replay it here."
              : "Generate, edit, and play your musical compositions"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MusicComposer initialCode={isPlaying && currentCode ? currentCode : undefined} />
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      {!isPlaying && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">💡 How to Create Music</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="text-muted-foreground space-y-1 text-sm">
              <li>1. Make sure Sonic Pi is installed and running on your machine</li>
              <li>2. Click any example above OR describe your own music in the prompt box</li>
              <li>3. Click &ldquo;Generate Code&rdquo; - your music will start playing automatically!</li>
              <li>4. Edit the generated code in the code editor and use the integrated play controls</li>
              <li>5. Try different examples to explore various musical styles and modify them</li>
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Now Playing Info */}
      {isPlaying && currentCode && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Volume2 className="h-5 w-5 animate-pulse" />
              Live Session Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              You&apos;re currently viewing the active composition. Any changes you make here will be preserved 
              when you stop the current playback. Use the integrated controls in the code editor to modify and replay your music.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 