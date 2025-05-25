'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { BookOpen, Code, Cog, Zap, List, FileText, ExternalLink, Heart, Users, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  fileName: string;
  description: string;
  content: string;
}

export default function DocsPage() {
  const [docSections, setDocSections] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);

  const docs = useMemo(() => ([
    {
      id: 'overview',
      title: 'Overview',
      icon: <BookOpen className="h-4 w-4" />,
      fileName: '00-README.md',
      description: 'Introduction to Sonic Pi JavaScript API'
    },
    {
      id: 'home',
      title: 'Getting Started',
      icon: <Zap className="h-4 w-4" />,
      fileName: '01-home.md',
      description: 'Feature matrix and package overview'
    },
    {
      id: 'api',
      title: 'SonicPiAPI',
      icon: <Code className="h-4 w-4" />,
      fileName: '02-SonicPiAPI.md',
      description: 'Core API class documentation'
    },
    {
      id: 'osc',
      title: 'OSC Server',
      icon: <Cog className="h-4 w-4" />,
      fileName: '03-SonicPiOSCServer.md',
      description: 'OSC communication layer'
    },
    {
      id: 'reference',
      title: 'API Reference',
      icon: <List className="h-4 w-4" />,
      fileName: '04-API-Reference.md',
      description: 'Complete API reference guide'
    },
    {
      id: 'fx',
      title: 'FX Documentation',
      icon: <FileText className="h-4 w-4" />,
      fileName: 'docs.md',
      description: 'Comprehensive effects documentation'
    }
  ]), []);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const loadedDocs = await Promise.all(
          docs.map(async (doc) => {
            try {
              const response = await fetch(`/sonic-pi-js-api-docs/${doc.fileName}`);
              if (!response.ok) {
                throw new Error(`Failed to load ${doc.fileName}`);
              }
              const content = await response.text();
              return {
                ...doc,
                content
              };
            } catch (error) {
              console.error(`Error loading ${doc.fileName}:`, error);
              return {
                ...doc,
                content: `# Error Loading Document\n\nFailed to load ${doc.fileName}. Please check if the file exists.`
              };
            }
          })
        );
        setDocSections(loadedDocs);
      } catch (error) {
        console.error('Error loading documentation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [docs]);

  const toggleMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  // Maximized view - takes over the entire viewport with minimal header
  if (isMaximized) {
    return (
      <div className="space-y-4">
        {/* Minimized Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Sonic Pi API Documentation</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMaximized}
            className="flex items-center gap-2"
          >
            <Minimize2 className="h-4 w-4" />
            Collapse View
          </Button>
        </div>

        {/* Expanded Documentation */}
        <Tabs defaultValue="overview" className="space-y-4">
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {docSections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id} 
                className="flex items-center gap-2"
              >
                {section.icon}
                <span className="hidden sm:inline">{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content - Expanded Height */}
          {docSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-160px)]">
                    <MarkdownRenderer content={section.content} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  // Normal view
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Sonic Pi JavaScript API Documentation</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMaximized}
            className="flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Expand View
          </Button>
        </div>
        <p className="text-muted-foreground text-lg">
          This documentation is used to build our Sonic Pi Composer application. All credit goes to the amazing original creators.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">v4.x Compatible</Badge>
          <Badge variant="outline">Experimental</Badge>
          <Badge variant="secondary"><Heart className="h-3 w-3 mr-1" />Third-party docs</Badge>
        </div>
      </div>

      {/* Attribution Section */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800 dark:text-amber-200">Attribution & Credits</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">Sonic Pi</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                The amazing live coding music synthesis platform that makes all of this possible.
              </p>
              <Button size="sm" variant="outline" asChild className="h-8">
                <a href="https://sonic-pi.net" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  sonic-pi.net
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">JavaScript API</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Documentation from @sunderb/sonic-pi-js-api - the JavaScript interface to Sonic Pi.
              </p>
              <Button size="sm" variant="outline" asChild className="h-8">
                <a href="https://sunderb.me/sonic-pi-js-api/latest/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  API Docs
                </a>
              </Button>
            </div>
          </div>
          <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              <Heart className="h-3 w-3 inline mr-1" />
              This documentation is redistributed with respect and gratitude to help developers integrate Sonic Pi into their applications.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        {/* Tabs List */}
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {docSections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id} 
              className="flex items-center gap-2"
            >
              {section.icon}
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {docSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMaximized}
                    className="flex items-center gap-1"
                  >
                    <Maximize2 className="h-3 w-3" />
                    <span className="text-xs">Expand</span>
                  </Button>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <MarkdownRenderer content={section.content} />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 