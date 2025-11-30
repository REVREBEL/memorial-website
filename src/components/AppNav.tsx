import { Button } from './ui/button';
import { BookOpen, Images } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface AppNavProps {
  currentPage: 'memory-wall' | 'guestbook';
}

export function AppNav({ currentPage }: AppNavProps) {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          <a href={`${baseUrl}/`}>
            <Button
              variant={currentPage === 'memory-wall' ? 'default' : 'ghost'}
              className="gap-2"
            >
              <Images className="w-4 h-4" />
              Memory Wall
            </Button>
          </a>
          <a href={`${baseUrl}/guestbook`}>
            <Button
              variant={currentPage === 'guestbook' ? 'default' : 'ghost'}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Guest Book
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
