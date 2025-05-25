'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Download, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Music,
  Monitor,
  Smartphone,
  Apple
} from "lucide-react"

interface SetupHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SetupHelpModal({ open, onOpenChange }: SetupHelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Setup Guide: Getting Started with Sonic Pi
          </DialogTitle>
          <DialogDescription>
            Follow these steps to set up Sonic Pi and start creating AI-powered music
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Overview */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Important: Sonic Pi Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This web app requires <strong>Sonic Pi to be installed and running</strong> on your computer. 
                Sonic Pi handles all audio processing while our web interface provides AI-powered code generation.
              </p>
            </CardContent>
          </Card>

          {/* Step 1: Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                Download Sonic Pi
              </CardTitle>
              <CardDescription>
                Get the latest version for your operating system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {/* Windows */}
                <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                  <Monitor className="h-8 w-8 text-blue-500" />
                  <h4 className="font-medium">Windows</h4>
                  <Badge variant="secondary">Windows 10/11</Badge>
                  <Button asChild size="sm" className="w-full">
                    <a 
                      href="https://sonic-pi.net/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>

                {/* Mac */}
                <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                  <Apple className="h-8 w-8 text-gray-600" />
                  <h4 className="font-medium">macOS</h4>
                  <Badge variant="secondary">macOS 12+</Badge>
                  <Button asChild size="sm" className="w-full">
                    <a 
                      href="https://sonic-pi.net/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>

                {/* Linux */}
                <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                  <Smartphone className="h-8 w-8 text-orange-500" />
                  <h4 className="font-medium">Linux/Pi</h4>
                  <Badge variant="secondary">Raspberry Pi OS</Badge>
                  <Button asChild size="sm" className="w-full">
                    <a 
                      href="https://sonic-pi.net/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild variant="outline" className="gap-2">
                  <a 
                    href="https://sonic-pi.net/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Official Sonic Pi Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Install */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                Install Sonic Pi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Run the installer</p>
                    <p className="text-sm text-muted-foreground">Double-click the downloaded file and follow installation prompts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Complete installation</p>
                    <p className="text-sm text-muted-foreground">Allow any system permissions if prompted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Launch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                Launch Sonic Pi
              </CardTitle>
              <CardDescription>
                Keep Sonic Pi running while using our web app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Open Sonic Pi application</p>
                    <p className="text-sm text-muted-foreground">Find it in your Applications folder or Start menu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Wait for full startup</p>
                    <p className="text-sm text-muted-foreground">Audio system needs about 8 seconds to initialize</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Keep it running</p>
                    <p className="text-sm text-muted-foreground">Don&apos;t close Sonic Pi while using our web app</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Use Web App */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                Start Creating Music
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Use our AI composer</p>
                    <p className="text-sm text-muted-foreground">Describe music in natural language</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Generate code</p>
                    <p className="text-sm text-muted-foreground">AI creates valid Sonic Pi code</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Play instantly</p>
                    <p className="text-sm text-muted-foreground">Music plays through Sonic Pi automatically</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-200">
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Music not playing?</strong> Make sure Sonic Pi is running and fully loaded</p>
              <p><strong>Connection errors?</strong> Check that Sonic Pi is listening on port 4560 (default)</p>
              <p><strong>Audio issues?</strong> Verify your speakers/headphones are connected and working</p>
              <p><strong>Still having trouble?</strong> Visit the official Sonic Pi documentation for more help</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <a 
              href="https://sonic-pi.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Sonic Pi
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 