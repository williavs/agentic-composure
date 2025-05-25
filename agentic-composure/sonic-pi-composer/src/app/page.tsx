// Landing Page - Simple Overview
// Directs users to the main dashboard application

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Sparkles, Play, Code } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex justify-center">
            <Badge variant="outline" className="bg-primary text-primary-foreground">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Music Creation
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
            Sonic Pi Composer
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Generate and play beautiful music using AI-powered Sonic Pi code generation. 
            From ambient soundscapes to driving techno beats.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Music className="h-4 w-4" />
                Start Creating Music
              </Button>
            </Link>
            <Link href="/dashboard/examples">
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Browse Examples
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Generation
              </CardTitle>
              <CardDescription>
                Describe your music in natural language and watch AI create Sonic Pi code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                From &ldquo;chill lofi beats&rdquo; to &ldquo;driving techno&rdquo; - our AI understands music styles and generates valid Sonic Pi code instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Instant Playback
              </CardTitle>
              <CardDescription>
                Generated code plays automatically in your local Sonic Pi installation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No copy-pasting needed. Code generation triggers automatic playback so you hear your music immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Editor
              </CardTitle>
              <CardDescription>
                Fine-tune generated code with syntax highlighting and live editing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built-in editor lets you modify and experiment with the generated Sonic Pi code to perfect your sound.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold">Ready to Create?</h2>
          <p className="text-muted-foreground">
            Join the future of music creation with AI-powered Sonic Pi composition
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Music className="h-4 w-4" />
              Launch Composer Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
