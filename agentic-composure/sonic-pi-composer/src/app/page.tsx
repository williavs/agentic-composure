// Landing Page - Simple Overview
// Directs users to the main dashboard application

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, Sparkles, Play, Code, Grid3X3, Brain, Heart, HelpCircle, Info } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Example UI Notice */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center">
            <p className="text-sm font-medium">
              ⚠️ <strong>Example UI Only</strong> - To actually use this application, you must run it locally and install Sonic Pi. 
              <a href="https://github.com/williavs/agentic-composure" target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-blue-200">
                Get the code →
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
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
            From ambient soundscapes to driving techno beats - describe your music in natural language and watch AI create it instantly.
          </p>
          
          {/* Production Notice */}
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 text-left max-w-2xl mx-auto">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Local Sonic Pi Required</p>
              <p className="text-sm">This app connects to Sonic Pi running on your local machine. For full functionality, please run this app locally with Sonic Pi installed.</p>
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Music className="h-4 w-4" />
                Start Creating Music
              </Button>
            </Link>
            <Link href="/dashboard/compose">
              <Button variant="outline" size="lg" className="gap-2">
                <Brain className="h-4 w-4" />
                AI Composer
              </Button>
            </Link>
            <Link href="/dashboard/sequencer">
              <Button variant="outline" size="lg" className="gap-2">
                <Grid3X3 className="h-4 w-4" />
                Live Sequencer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
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
                <Grid3X3 className="h-5 w-5 text-primary" />
                Live Visualizer
              </CardTitle>
              <CardDescription>
                Real-time visualization of your music&apos;s structure and beats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Watch your music come alive with beat tracking, loop visualization, and real-time code structure analysis.
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

      {/* Requirements Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-600" />
                Setup Requirements
              </CardTitle>
              <CardDescription>
                What you need to get started with Sonic Pi Composer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3 text-amber-800 dark:text-amber-200">Prerequisites</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span><strong>Sonic Pi</strong> installed and running on your machine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Modern web browser (Chrome, Firefox, Safari, Edge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Audio output device (speakers or headphones)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span><strong>Local development environment</strong> for full functionality</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-amber-800 dark:text-amber-200">Quick Start</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">1.</span>
                      <span>Download and launch Sonic Pi from <a href="https://sonic-pi.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sonic-pi.net</a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">2.</span>
                      <span>Clone this repo: <a href="https://github.com/williavs/agentic-composure" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/williavs/agentic-composure</a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">3.</span>
                      <span>Run locally: <code className="text-xs bg-amber-100 dark:bg-amber-900 px-1 rounded">npm run dev</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">4.</span>
                      <span>Access at <code className="text-xs bg-amber-100 dark:bg-amber-900 px-1 rounded">localhost:3000</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">5.</span>
                      <span>Start creating music with AI!</span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Built with Sonic Pi */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Built with Sonic Pi
              </CardTitle>
              <CardDescription>
                This application is powered by the incredible Sonic Pi live coding music environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                <strong>Sonic Pi</strong> is a revolutionary live coding music environment created by <strong>Sam Aaron</strong> and the Sonic Pi Core Team. 
                Our AI composer builds on top of this amazing foundation to make music creation accessible through natural language.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://sonic-pi.net" target="_blank" rel="noopener noreferrer">
                    <Music className="h-4 w-4" />
                    Visit Sonic Pi
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://github.com/sonic-pi-net/sonic-pi" target="_blank" rel="noopener noreferrer">
                    <Code className="h-4 w-4" />
                    Sonic Pi on GitHub
                  </a>
                </Button>
              </div>
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
