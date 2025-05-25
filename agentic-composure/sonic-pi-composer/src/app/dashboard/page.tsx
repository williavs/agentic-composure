// Sonic Pi Composer - AI-Powered Music Generation
// Dashboard explaining what this app does and crediting Sonic Pi

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Brain, Sparkles, Heart, Code } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 space-y-8 w-full">
      {/* Hero Section */}
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-wrap items-center justify-center gap-3 text-3xl md:text-4xl">
            <Brain className="h-8 w-8 text-primary" />
            <Music className="h-8 w-8 text-primary" />
            <span>Sonic Pi Composer</span>
          </CardTitle>
          <CardDescription className="text-lg md:text-xl mt-4">
            AI-powered music generation for Sonic Pi. Describe your music in natural language and watch AI create valid Sonic Pi code instantly.
          </CardDescription>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/dashboard/compose">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Sparkles className="h-5 w-5" />
                Start Composing
              </Button>
            </Link>
            <Link href="/dashboard/examples">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Code className="h-5 w-5" />
                View Examples
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      
      {/* Built With Sonic Pi */}
      <section>
        <Card className="w-full border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Built with Sonic Pi
            </CardTitle>
            <CardDescription>
              This application is powered by the incredible Sonic Pi live coding music environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Sonic Pi</strong> is a revolutionary live coding music environment created by <strong>Sam Aaron</strong> and the Sonic Pi Core Team. 
              Our AI composer builds on top of this amazing foundation to make music creation accessible through natural language.
            </p>
            <p className="text-muted-foreground text-sm">
              This app would not be possible without the incredible work of the Sonic Pi community. 
              We&apos;re proud to contribute to the ecosystem while giving full credit where it&apos;s due.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="gap-2 w-full sm:w-auto">
                <a href="https://sonic-pi.net" target="_blank" rel="noopener noreferrer">
                  <Music className="h-4 w-4" />
                  Visit Sonic Pi
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 w-full sm:w-auto">
                <a href="https://github.com/sonic-pi-net/sonic-pi" target="_blank" rel="noopener noreferrer">
                  <Code className="h-4 w-4" />
                  Sonic Pi on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Get Started */}
      <section>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Ready to create music with AI? Here&apos;s what you need to begin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Prerequisites</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Sonic Pi installed and running on your machine</li>
                  <li>• Modern web browser</li>
                  <li>• Audio output device (speakers or headphones)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quick Start</h4>
                <ol className="text-muted-foreground space-y-1 text-sm">
                  <li>1. Launch Sonic Pi on your computer</li>
                  <li>2. Click &ldquo;Start Composing&rdquo; above</li>
                  <li>3. Describe your music or choose an example</li>
                  <li>4. Generate and listen to your AI-created music!</li>
                </ol>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/dashboard/compose">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Sparkles className="h-5 w-5" />
                  Start Creating Music Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
