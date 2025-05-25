// Root Layout - Minimal Global Structure
// Provides theming and notifications, lets route groups handle their own layouts

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sonic Pi Composer - AI Music Generation',
  description: 'Generate and play Sonic Pi code using AI with bulletproof prompts. Create ambient, techno, lofi, and experimental music instantly.',
  keywords: ['Sonic Pi', 'AI Music', 'Code Generation', 'Live Coding', 'Music Programming', 'AI Composer'],
  authors: [{ name: 'Sonic Pi Composer Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Let route groups handle their own layouts */}
          {children}
          
          {/* Global Toast Notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
