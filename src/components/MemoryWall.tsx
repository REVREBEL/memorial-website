import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Plus, Play, Heart, Share2, AlertCircle } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import { MemoryForm } from './MemoryForm';
import { AppNav } from './AppNav';

export interface Memory {
  id: string;
  headline: string;
  name: string;
  email: string;
  photo?: string;
  video?: string;
  memory: string;
  memoryDate?: string;
  memoryLocation?: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

// Get or create session ID for like tracking
function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedMemories, setLikedMemories] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string>('');
  const [fetchError, setFetchError] = useState<string>('');

  useEffect(() => {
    fetchMemories();
    // Load liked memories from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('likedMemories');
      if (stored) {
        try {
          setLikedMemories(new Set(JSON.parse(stored)));
        } catch (e) {
          console.error('Failed to parse liked memories:', e);
        }
      }
    }
  }, []);

  const fetchMemories = async () => {
    setFetchError('');
    try {
      const response = await fetch(`${baseUrl}/api/memories`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(errorData?.error || `Failed to fetch memories: ${response.status}`);
      }
      const data = await response.json() as Memory[];
      setMemories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMemory = async (memory: Omit<Memory, 'id' | 'createdAt' | 'likes'>) => {
    setSubmitError('');
    try {
      const response = await fetch(`${baseUrl}/api/memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memory),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(errorData?.error || 'Failed to add memory');
      }

      const newMemory = await response.json() as Memory;
      setMemories([newMemory, ...memories]);
      setShowForm(false);
      setSubmitError('');
    } catch (error) {
      console.error('Failed to add memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add memory. Please try again.';
      setSubmitError(errorMessage);
      throw error;
    }
  };

  const handleLike = async (memoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isLiked = likedMemories.has(memoryId);
    const sessionId = getSessionId();
    
    // Optimistically update UI
    const newLiked = new Set(likedMemories);
    if (isLiked) {
      newLiked.delete(memoryId);
    } else {
      newLiked.add(memoryId);
    }
    setLikedMemories(newLiked);
    
    // Update memory likes count optimistically
    setMemories(memories.map(m => 
      m.id === memoryId 
        ? { ...m, likes: m.likes + (isLiked ? -1 : 1) } 
        : m
    ));
    
    try {
      const response = await fetch(`${baseUrl}/api/memories/${memoryId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          increment: !isLiked,
          sessionId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const updatedMemory = await response.json() as Memory;
      
      // Update with server response
      setMemories(memories.map(m => m.id === memoryId ? updatedMemory : m));
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('likedMemories', JSON.stringify([...newLiked]));
      }
      
      // Update selected memory if it's open
      if (selectedMemory?.id === memoryId) {
        setSelectedMemory(updatedMemory);
      }
    } catch (error) {
      console.error('Failed to like memory:', error);
      
      // Revert optimistic update on error
      setLikedMemories(likedMemories);
      setMemories(memories.map(m => 
        m.id === memoryId 
          ? { ...m, likes: m.likes + (isLiked ? 1 : -1) } 
          : m
      ));
    }
  };

  const handleShare = (memory: Memory, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const url = encodeURIComponent(window.location.href);
    const quote = encodeURIComponent(`${memory.headline} - ${memory.memory.substring(0, 100)}...`);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
    
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const getTagStyle = (tag: string): { bg: string; text: string } => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      'Family': { bg: '#ccb8a6', text: '#29708d' },
      'Church': { bg: '#c47577', text: '#fffbfa' },
      'Cooking': { bg: '#0097b2', text: '#fffbfa' },
      'Travel': { bg: '#29708d', text: '#fffbfa' },
      'Classmates': { bg: '#c47577', text: '#fffbfa' },
      'Worklife': { bg: '#ccb8a6', text: '#29708d' },
      '4H Club': { bg: '#0097b2', text: '#fffbfa' },
    };
    
    return colorMap[tag] || { bg: '#ccb8a6', text: '#29708d' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const truncateMemory = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Loading memories...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav currentPage="memory-wall" />
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-xl text-destructive mb-2">Failed to load memories</p>
              <p className="text-sm text-muted-foreground mb-4">{fetchError}</p>
              <Button onClick={fetchMemories}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav currentPage="memory-wall" />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">Memory Wall</h1>
            <p className="text-muted-foreground">Share your cherished moments and stories</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Memory
          </Button>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No memories yet</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create the first memory
            </Button>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {memories.map((memory) => (
              <Card
                key={memory.id}
                className="break-inside-avoid cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedMemory(memory)}
              >
                <CardContent className="p-0 space-y-3">
                  {memory.photo && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={memory.photo}
                        alt={memory.headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {memory.video && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <h3 className="text-xl font-heading font-semibold mb-1">{memory.headline}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {memory.memoryDate && <span>{memory.memoryDate}</span>}
                        {memory.memoryDate && memory.memoryLocation && <span>•</span>}
                        {memory.memoryLocation && <span>{memory.memoryLocation}</span>}
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground">
                      {truncateMemory(memory.memory)}
                      {memory.memory.length > 150 && (
                        <span className="text-primary font-medium ml-1">READ MORE</span>
                      )}
                    </p>
                    
                    {memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {memory.tags.map((tag) => {
                          const colors = getTagStyle(tag);
                          return (
                            <span
                              key={tag}
                              className="inline-flex px-3 py-1 items-center justify-center rounded-md font-bold text-xs tracking-wider lowercase transition-all duration-200"
                              style={{
                                backgroundColor: colors.bg,
                                color: colors.text,
                              }}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex items-center justify-between px-4 pb-4 pt-2 border-t">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">— {memory.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(memory.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleLike(memory.id, e)}
                      className={likedMemories.has(memory.id) ? 'text-red-500' : ''}
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${likedMemories.has(memory.id) ? 'fill-current' : ''}`}
                      />
                      {memory.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShare(memory, e)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Memory Detail Dialog */}
        <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
          <DialogContent className="!grid-cols-1 max-w-[calc(100%-2rem)] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">{selectedMemory?.headline}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedMemory?.photo && (
                <div className="w-full rounded-lg overflow-hidden">
                  <img
                    src={selectedMemory.photo}
                    alt={selectedMemory.headline}
                    className="w-full h-auto"
                  />
                </div>
              )}
              {selectedMemory?.video && (
                <div className="w-full rounded-lg overflow-hidden">
                  <video
                    src={selectedMemory.video}
                    controls
                    className="w-full h-auto"
                  />
                </div>
              )}
              {selectedMemory && (selectedMemory.memoryDate || selectedMemory.memoryLocation) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {selectedMemory.memoryDate && <span>{selectedMemory.memoryDate}</span>}
                  {selectedMemory.memoryDate && selectedMemory.memoryLocation && <span>•</span>}
                  {selectedMemory.memoryLocation && <span>{selectedMemory.memoryLocation}</span>}
                </div>
              )}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-foreground whitespace-pre-wrap">{selectedMemory?.memory}</p>
              </div>
              {selectedMemory && selectedMemory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedMemory.tags.map((tag) => {
                    const colors = getTagStyle(tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex px-3 py-1 items-center justify-center rounded-md font-bold text-xs tracking-wider lowercase transition-all duration-200"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Shared by {selectedMemory?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMemory && formatDate(selectedMemory.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => selectedMemory && handleLike(selectedMemory.id, e)}
                    className={likedMemories.has(selectedMemory?.id || '') ? 'text-red-500' : ''}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${likedMemories.has(selectedMemory?.id || '') ? 'fill-current' : ''}`}
                    />
                    {selectedMemory?.likes}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => selectedMemory && handleShare(selectedMemory, e)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Memory Form Dialog */}
        <Dialog open={showForm} onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setSubmitError('');
        }}>
          <DialogContent className="!grid-cols-1 max-w-[calc(100%-2rem)] sm:max-w-[90vw] md:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">Share a Memory</DialogTitle>
            </DialogHeader>
            {submitError && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}
            <MemoryForm onSubmit={handleAddMemory} onCancel={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
