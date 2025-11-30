import React, { useEffect, useState } from 'react';
import { baseUrl } from '../lib/base-url';
import { DevLinkProvider } from '../site-components/DevLinkProvider';
import { Stories } from '../site-components/Stories';

interface Memory {
  id: number;
  headline: string;
  memory: string;
  name: string;
  mediaUrl?: string;
  mediaType?: string;
  tags?: string;
  createdAt: string;
  memoryDate?: string;
  location?: string;
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
        const data = await response.json();
        console.log('[StoriesSection] Fetched memories:', data.length);
        setMemories(data);
      } else {
        const errorText = await response.text();
        console.error('[StoriesSection] Error response:', errorText);
        setError(`Failed to load memories: ${response.status}`);
      }
    } catch (error) {
      console.error('[StoriesSection] Error fetching memories:', error);
      setError('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMediaUrl = (mediaUrl?: string) => {
    if (!mediaUrl) return undefined;
    if (mediaUrl.startsWith('http')) return mediaUrl;
    return `${baseUrl}${mediaUrl}`;
  };

  const getFirstTag = (tags?: string) => {
    if (!tags) return undefined;
    return tags.split(',')[0].trim();
  };

  if (error) {
    console.error('[StoriesSection] Rendering error state:', error);
    return (
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        fontFamily: 'var(--_apps---typography--body-font)',
        color: 'var(--_apps---colors--destructive)',
        backgroundColor: 'var(--_apps---colors--background)'
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
            backgroundColor: 'var(--_apps---colors--primary)',
            color: 'var(--_apps---colors--primary-foreground)',
            border: 'none',
            borderRadius: 'var(--_apps---sizes--radius)',
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
        fontFamily: 'var(--_apps---typography--body-font)',
        color: 'var(--_apps---colors--foreground)',
        backgroundColor: 'var(--_apps---colors--background)'
      }}>
        Loading stories...
      </div>
    );
  }

  // If no memories yet, show placeholder
  if (memories.length === 0) {
    console.log('[StoriesSection] No memories found');
    return (
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        fontFamily: 'var(--_apps---typography--body-font)',
        color: 'var(--_apps---colors--foreground)',
        backgroundColor: 'var(--_apps---colors--background)'
      }}>
        No stories yet. Be the first to share a memory!
      </div>
    );
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
    return (
      <DevLinkProvider>
        <Stories
          // Featured story (large)
          featuredFeaturedTitle={featured?.headline}
          featuredText={truncateText(featured?.memory || '', 150)}
          featuredTagText={getFirstTag(featured?.tags)}
          featuredImage={
            featured?.mediaUrl && featured?.mediaType?.startsWith('image')
              ? { src: getMediaUrl(featured.mediaUrl), alt: featured.headline }
              : undefined
          }
          featuredAltText={featured?.headline}
          
          // Small feature 1
          smallFeature1Title={smallFeature1?.headline}
          smallFeature1BodyText={truncateText(smallFeature1?.memory || '', 100)}
          smallFeature1TagText={getFirstTag(smallFeature1?.tags)}
          smallFeature1Image={
            smallFeature1?.mediaUrl && smallFeature1?.mediaType?.startsWith('image')
              ? { src: getMediaUrl(smallFeature1.mediaUrl), alt: smallFeature1.headline }
              : undefined
          }
          smallFeature1AltText={smallFeature1?.headline}
          smallFeature1Visibility={smallFeature1 ? undefined : { hidden: true }}
          
          // Small feature 2
          smallFeature2Title={smallFeature2?.headline}
          smallFeature2Text={truncateText(smallFeature2?.memory || '', 100)}
          smallFeature2TagText={getFirstTag(smallFeature2?.tags)}
          smallFeature2Image={
            smallFeature2?.mediaUrl && smallFeature2?.mediaType?.startsWith('image')
              ? { src: getMediaUrl(smallFeature2.mediaUrl), alt: smallFeature2.headline }
              : undefined
          }
          smallFeature2AltText={smallFeature2?.headline}
          smallFeature2Visibility={smallFeature2 ? undefined : { hidden: true }}
          
          // Text feature 1
          textFeature1Title={textFeature1?.headline}
          textFeature1Text={truncateText(textFeature1?.memory || '', 80)}
          textFeature1Visibility={textFeature1 ? undefined : { hidden: true }}
          
          // Text feature 2
          textFeature2Title={textFeature2?.headline}
          textFeature2Text={truncateText(textFeature2?.memory || '', 80)}
          textFeature2Visibility={textFeature2 ? undefined : { hidden: true }}
          
          // Text feature 3
          textFeature3Title={textFeature3?.headline}
          textFeature3Text={truncateText(textFeature3?.memory || '', 80)}
          textFeature3Visibility={textFeature3 ? undefined : { hidden: true }}
          
          // Text feature 4
          textFeature4Title={textFeature4?.headline}
          textFeature4Visibility={textFeature4 ? undefined : { hidden: true }}
          
          // Text feature 5
          textFeature5Title={textFeature5?.headline}
          textFeature5Text={truncateText(textFeature5?.memory || '', 80)}
          textFeature5Text2={truncateText(textFeature5?.memory || '', 80)}
          textFeature5Visibility={textFeature5 ? undefined : { hidden: true }}
        />
      </DevLinkProvider>
    );
  } catch (err) {
    console.error('[StoriesSection] Error rendering Stories:', err);
    return (
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        fontFamily: 'var(--_apps---typography--body-font)',
        color: 'var(--_apps---colors--destructive)',
        backgroundColor: 'var(--_apps---colors--background)'
      }}>
        Error displaying stories. Please refresh the page.
      </div>
    );
  }
}
