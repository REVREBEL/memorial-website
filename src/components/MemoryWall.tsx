import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart, X, Calendar, MapPin, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { MemoryForm } from './MemoryForm';
import { baseUrl } from '../lib/base-url';

interface Memory {
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

export function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [likedMemories, setLikedMemories] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags from all memories
  const allTags = Array.from(new Set(memories.flatMap(m => m.tags))).sort();

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
    console.log('🔄 [MemoryWall] Fetching memories...');
    setFetchError('');
    try {
      const response = await fetch(`${baseUrl}/api/memories`);
      console.log('📡 [MemoryWall] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { error?: string; details?: string } | null;
        throw new Error(errorData?.details || errorData?.error || `Failed to fetch memories: ${response.status}`);
      }
      
      const data = await response.json() as Memory[];
      console.log('📦 [MemoryWall] Raw data received:', data.length, 'items');
      
      // Map backend fields to frontend fields
      const formattedData = data.map((item: any) => {
        const photoUrl = item.mediaType === 'photo' && item.mediaKey ? `${baseUrl}/api/media/${item.mediaKey}` : undefined;
        const videoUrl = item.mediaType === 'video' && item.mediaKey ? `${baseUrl}/api/media/${item.mediaKey}` : undefined;
        
        console.log(`🖼️ [MemoryWall] Memory ${item.id}:`, {
          headline: item.headline,
          mediaType: item.mediaType,
          mediaKey: item.mediaKey,
          photoUrl,
          videoUrl
        });
        
        return {
          id: item.id,
          headline: item.headline,
          name: item.name,
          email: item.email,
          photo: photoUrl,
          video: videoUrl,
          memory: item.memory,
          memoryDate: item.memoryDate,
          memoryLocation: item.location,
          tags: item.tags,
          likes: item.likes,
          createdAt: item.createdAt,
        };
      });
      
      console.log('✅ [MemoryWall] Formatted memories:', formattedData.length, 'items');
      setMemories(Array.isArray(formattedData) ? formattedData : []);
    } catch (error) {
      console.error('❌ [MemoryWall] Failed to fetch memories:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to load memories');
    }
  };

  const handleLike = async (memoryId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/memories/${memoryId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like memory');
      }

      const updatedMemory = await response.json() as Memory;
      
      setMemories(prev =>
        prev.map(m => m.id === memoryId ? { ...m, likes: updatedMemory.likes } : m)
      );

      setLikedMemories(prev => {
        const newLiked = new Set(prev);
        newLiked.add(memoryId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('likedMemories', JSON.stringify(Array.from(newLiked)));
        }
        return newLiked;
      });

      if (selectedMemory?.id === memoryId) {
        setSelectedMemory({ ...selectedMemory, likes: updatedMemory.likes });
      }
    } catch (error) {
      console.error('Failed to like memory:', error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    console.log('📤 [MemoryWall] Submitting new memory...');
    console.log('📤 [MemoryWall] FormData keys:', Array.from(formData.keys()));
    console.log('📤 [MemoryWall] Target URL:', `${baseUrl}/api/memories`);
    
    try {
      const response = await fetch(`${baseUrl}/api/memories`, {
        method: 'POST',
        body: formData,
      });

      console.log('📡 [MemoryWall] Submit response status:', response.status);
      console.log('📡 [MemoryWall] Submit response headers:', Object.fromEntries(response.headers.entries()));

      // Try to get the response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('📡 [MemoryWall] Raw response:', responseText.substring(0, 500));

      if (!response.ok) {
        let errorData: { error?: string; details?: string } | null = null;
        
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ [MemoryWall] Failed to parse error response as JSON');
          throw new Error(`Server error (${response.status}): ${responseText.substring(0, 200)}`);
        }
        
        const errorMessage = errorData?.details || errorData?.error || `Failed to submit memory (${response.status})`;
        console.error('❌ [MemoryWall] Server error:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ [MemoryWall] Memory submitted successfully');
      await fetchMemories();
      setShowAddForm(false);
    } catch (error) {
      console.error('❌ [MemoryWall] Failed to submit memory:', error);
      console.error('❌ [MemoryWall] Error type:', error?.constructor?.name);
      console.error('❌ [MemoryWall] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  };

  const filteredMemories = selectedTag
    ? memories.filter(m => m.tags.includes(selectedTag))
    : memories;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-4">Memory Wall</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Share your cherished memories, photos, and stories
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            size="lg"
            className="font-button"
          >
            Add Your Memory
          </Button>
        </div>

        {/* Error Message */}
        {fetchError && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{fetchError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMemories}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedTag === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        )}

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map(memory => {
            const hasMedia = memory.photo || memory.video;
            
            return (
              <Card key={memory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="relative aspect-square bg-muted cursor-pointer"
                  onClick={() => setSelectedMemory(memory)}
                >
                  {memory.photo && (
                    <img
                      src={memory.photo}
                      alt={memory.headline}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {memory.video && (
                    <div className="relative w-full h-full">
                      <video
                        src={memory.video}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-8 border-t-4 border-b-4 border-l-primary border-t-transparent border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  {!hasMedia && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">No media</p>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <h3 className="font-heading font-semibold text-xl">{memory.headline}</h3>
                  <p className="text-sm text-muted-foreground">by {memory.name}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm line-clamp-3">{memory.memory}</p>
                  
                  {(memory.memoryDate || memory.memoryLocation) && (
                    <div className="mt-3 space-y-1">
                      {memory.memoryDate && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {memory.memoryDate}
                        </div>
                      )}
                      {memory.memoryLocation && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {memory.memoryLocation}
                        </div>
                      )}
                    </div>
                  )}

                  {memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {memory.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(memory.id);
                    }}
                    disabled={likedMemories.has(memory.id)}
                    className="gap-2"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedMemories.has(memory.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {memory.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMemory(memory)}
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredMemories.length === 0 && !fetchError && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedTag
                ? `No memories found with tag "${selectedTag}"`
                : 'No memories yet. Be the first to share!'}
            </p>
          </div>
        )}

        {/* Memory Detail Dialog */}
        <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedMemory && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-heading mb-2">
                        {selectedMemory.headline}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground">by {selectedMemory.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMemory(null)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  {selectedMemory.photo && (
                    <img
                      src={selectedMemory.photo}
                      alt={selectedMemory.headline}
                      className="w-full rounded-lg"
                    />
                  )}
                  {selectedMemory.video && (
                    <video
                      src={selectedMemory.video}
                      controls
                      className="w-full rounded-lg"
                    />
                  )}

                  {(selectedMemory.memoryDate || selectedMemory.memoryLocation) && (
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {selectedMemory.memoryDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {selectedMemory.memoryDate}
                        </div>
                      )}
                      {selectedMemory.memoryLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedMemory.memoryLocation}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMemory.memory}</p>
                  </div>

                  {selectedMemory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedMemory.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="ghost"
                      onClick={() => handleLike(selectedMemory.id)}
                      disabled={likedMemories.has(selectedMemory.id)}
                      className="gap-2"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedMemories.has(selectedMemory.id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                      {selectedMemory.likes} {selectedMemory.likes === 1 ? 'Like' : 'Likes'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Memory Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">Share Your Memory</DialogTitle>
            </DialogHeader>
            <MemoryForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
