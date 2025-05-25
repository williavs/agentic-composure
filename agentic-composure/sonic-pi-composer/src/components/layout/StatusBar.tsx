// StatusBar Component - Footer with Status and Links
// Simple footer with app information

import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

export function StatusBar() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          {/* Status Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                🎵 Production Agent Active
              </Badge>
              <span>•</span>
              <span>AI-Powered Music Generation</span>
            </div>
          </div>

          {/* Credits */}
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>for Sonic Pi creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 