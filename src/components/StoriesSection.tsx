import React, { useEffect, useState } from 'react';
import { baseUrl } from '../lib/base-url';
import { DevLinkProvider } from '../site-components/DevLinkProvider';
import { Stories } from '../site-components/Stories';

interface Memory {
  id: string;
  headline: string;
  memory: string;
  name: string;
  mediaKey?: string | null;
  mediaType?: string | null;
  tags?: string[];
  createdAt: string;
  memoryDate?: string | null;
  location?: string | null;
  likes: number;
}

export function StoriesSection() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[StoriesSection] Component mounted, fetching memories...');
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      console.log('[StoriesSection] Fetching from:', `${baseUrl}/api/memories`);
      const response = await fetch(`${baseUrl}/api/memories`);
      console.log('[StoriesSection] Response status:', response.status);
      
      if (response.ok) {
        const data: Memory[] = await response.json();
        console.log('[StoriesSection] Fetched memories:', data?.length || 0, 'items');
        
        // Log media info for debugging
        if (data && Array.isArray(data) && data.length > 0) {
          data.forEach((mem: Memory, idx: number) => {
            console.log(`[StoriesSection] Memory ${idx}:`, {
              id: mem.id,
              headline: mem.headline,
              hasMediaKey: !!mem.mediaKey,
              mediaKey: mem.mediaKey,
              mediaType: mem.mediaType,
            });
          });
        }
        
        setMemories(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('[StoriesSection] Error response:', errorText);
        setError(`Failed to load memories: ${response.status}`);
      }
    } catch (err) {
      console.error('[StoriesSection] Error fetching memories:', err);
      setError('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMediaUrl = (memory: Memory) => {
    if (!memory.mediaKey) {
      console.log('[StoriesSection] No mediaKey for memory:', memory.id);
      return undefined;
    }
    const url = `${baseUrl}/api/media/${memory.mediaKey}`;
    console.log('[StoriesSection] Constructed media URL:', url);
    return url;
  };

  const getFirstTag = (tags?: string[]) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return undefined;
    return tags[0];
  };

  if (error) {
    console.error('[StoriesSection] Rendering error state:', error);
    return (
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        fontFamily: 'var(--body-font)',
        color: 'var(--destructive)',
        backgroundColor: 'var(--background)'
      }}>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchMemories();
          }}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    console.log('[StoriesSection] Rendering loading state');
    return (
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        fontFamily: 'var(--body-font)',
        color: 'var(--foreground)',
        backgroundColor: 'var(--background)'
      }}>
        Loading stories...
      </div>
    );
  }

  // If no memories yet, don't show anything
  if (!memories || memories.length === 0) {
    console.log('[StoriesSection] No memories found, not rendering Stories component');
    return null;
  }

  console.log('[StoriesSection] Rendering Stories component with', memories.length, 'memories');

  // Map memories to Stories component slots
  const featured = memories[0];
  const smallFeature1 = memories[1];
  const smallFeature2 = memories[2];
  const textFeature1 = memories[3];
  const textFeature2 = memories[4];
  const textFeature3 = memories[5];
  const textFeature4 = memories[6];
  const textFeature5 = memories[7];

  try {
    const storiesProps: any = {};

    // Featured story (required)
    if (featured) {
      storiesProps.featuredFeaturedTitle = featured.headline || '';
      storiesProps.featuredText = truncateText(featured.memory || '', 150);
      storiesProps.featuredTagText = getFirstTag(featured.tags);
      
      console.log('[StoriesSection] Featured memory check:', {
        hasMediaKey: !!featured.mediaKey,
        mediaKey: featured.mediaKey,
        mediaType: featured.mediaType,
        isPhoto: featured.mediaType === 'photo'
      });
      
      if (featured.mediaKey && featured.mediaType === 'photo') {
        const mediaUrl = getMediaUrl(featured);
        console.log('[StoriesSection] Setting featured image URL:', mediaUrl);
        if (mediaUrl) {
          // Image should be passed as a string URL, not an object
          storiesProps.featuredImage = mediaUrl;
          storiesProps.featuredAltText = featured.headline || 'Featured memory';
        }
      } else {
        console.log('[StoriesSection] Featured memory has no photo - skipping image');
      }
    }

    // Small feature 1
    if (smallFeature1) {
      storiesProps.smallFeature1Title = smallFeature1.headline || '';
      storiesProps.smallFeature1BodyText = truncateText(smallFeature1.memory || '', 100);
      storiesProps.smallFeature1TagText = getFirstTag(smallFeature1.tags);
      
      if (smallFeature1.mediaKey && smallFeature1.mediaType === 'photo') {
        const mediaUrl = getMediaUrl(smallFeature1);
        console.log('[StoriesSection] Setting smallFeature1 image URL:', mediaUrl);
        if (mediaUrl) {
          storiesProps.smallFeature1Image = mediaUrl;
          storiesProps.smallFeature1AltText = smallFeature1.headline || 'Memory';
        }
      }
    } else {
      storiesProps.smallFeature1Visibility = { hidden: true };
    }

    // Small feature 2
    if (smallFeature2) {
      storiesProps.smallFeature2Title = smallFeature2.headline || '';
      storiesProps.smallFeature2Text = truncateText(smallFeature2.memory || '', 100);
      storiesProps.smallFeature2TagText = getFirstTag(smallFeature2.tags);
      
      if (smallFeature2.mediaKey && smallFeature2.mediaType === 'photo') {
        const mediaUrl = getMediaUrl(smallFeature2);
        console.log('[StoriesSection] Setting smallFeature2 image URL:', mediaUrl);
        if (mediaUrl) {
          storiesProps.smallFeature2Image = mediaUrl;
          storiesProps.smallFeature2AltText = smallFeature2.headline || 'Memory';
        }
      }
    } else {
      storiesProps.smallFeature2Visibility = { hidden: true };
    }

    // Text features
    if (textFeature1) {
      storiesProps.textFeature1Title = textFeature1.headline || '';
      storiesProps.textFeature1Text = truncateText(textFeature1.memory || '', 80);
    } else {
      storiesProps.textFeature1Visibility = { hidden: true };
    }

    if (textFeature2) {
      storiesProps.textFeature2Title = textFeature2.headline || '';
      storiesProps.textFeature2Text = truncateText(textFeature2.memory || '', 80);
    } else {
      storiesProps.textFeature2Visibility = { hidden: true };
    }

    if (textFeature3) {
      storiesProps.textFeature3Title = textFeature3.headline || '';
      storiesProps.textFeature3Text = truncateText(textFeature3.memory || '', 80);
    } else {
      storiesProps.textFeature3Visibility = { hidden: true };
    }

    if (textFeature4) {
      storiesProps.textFeature4Title = textFeature4.headline || '';
    } else {
      storiesProps.textFeature4Visibility = { hidden: true };
    }

    if (textFeature5) {
      storiesProps.textFeature5Title = textFeature5.headline || '';
      storiesProps.textFeature5Text = truncateText(textFeature5.memory || '', 80);
      storiesProps.textFeature5Text2 = truncateText(textFeature5.memory || '', 80);
    } else {
      storiesProps.textFeature5Visibility = { hidden: true };
    }

    console.log('[StoriesSection] Final props keys:', Object.keys(storiesProps));
    console.log('[StoriesSection] Has featuredImage:', !!storiesProps.featuredImage);
    console.log('[StoriesSection] featuredImage value:', storiesProps.featuredImage);

    return (
      <DevLinkProvider>
        <Stories {...storiesProps} />
      </DevLinkProvider>
    );
  } catch (err) {
    console.error('[StoriesSection] Error rendering Stories:', err);
    console.error('[StoriesSection] Error stack:', err instanceof Error ? err.stack : 'No stack');
    // Don't show the error to users, just skip the section
    return null;
  }
}
