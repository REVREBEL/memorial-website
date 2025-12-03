// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../db/getDb';
import { memoriesTable, likesTable } from '../../../db/schema';
import { desc, sql, eq } from 'drizzle-orm';

// CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDb(locals);
    
    // Get all memories with like counts, sorted by created date descending
    const memories = await db
      .select({
        id: memoriesTable.id,
        headline: memoriesTable.headline,
        name: memoriesTable.name,
        memory: memoriesTable.memory,
        memoryDate: memoriesTable.memoryDate,
        location: memoriesTable.location,
        mediaKey: memoriesTable.mediaKey,
        mediaType: memoriesTable.mediaType,
        tags: memoriesTable.tags,
        createdAt: memoriesTable.createdAt,
        likes: sql<number>`COALESCE((SELECT COUNT(*) FROM likes WHERE memory_id = memories.id), 0)`,
      })
      .from(memoriesTable)
      .orderBy(desc(memoriesTable.createdAt));

    // Parse tags from JSON strings
    const formattedMemories = memories.map(memory => ({
      ...memory,
      tags: JSON.parse(memory.tags),
      likes: Number(memory.likes) || 0,
    }));

    return new Response(JSON.stringify(formattedMemories), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Failed to fetch memories:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch memories',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        } 
      }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('POST /api/memories - Starting request');
  console.log('Request origin:', request.headers.get('origin'));
  console.log('Request content-type:', request.headers.get('content-type'));
  
  try {
    // Check if database is available
    if (!locals.runtime?.env?.DB) {
      console.error('Database not available');
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    // Check if R2 bucket is available
    if (!locals.runtime?.env?.MEDIA_BUCKET) {
      console.error('Media bucket not available');
      return new Response(
        JSON.stringify({ error: 'Media storage not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    const formData = await request.formData();
    console.log('FormData received, keys:', Array.from(formData.keys()));
    
    const db = getDb(locals);
    
    const headline = formData.get('headline') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const memory = formData.get('memory') as string;
    const memoryDate = formData.get('memoryDate') as string;
    const location = formData.get('location') as string;
    const tags = formData.get('tags') as string;
    const media = formData.get('media') as File | null;

    console.log('Parsed form data:', { 
      headline, 
      name, 
      email, 
      memoryLength: memory?.length, 
      memoryDate, 
      location, 
      tags,
      hasMedia: !!media,
      mediaSize: media?.size,
      mediaType: media?.type
    });

    if (!headline || !name || !email || !memory) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    let mediaKey = null;
    let mediaType = 'none';

    // Upload media to R2 if provided
    if (media && media.size > 0) {
      console.log('Uploading media to R2:', media.name, media.type, media.size);
      
      try {
        const mediaArrayBuffer = await media.arrayBuffer();
        const fileExtension = media.name.split('.').pop();
        const timestamp = Date.now();
        
        // Determine media type
        if (media.type.startsWith('image/')) {
          mediaType = 'photo';
          mediaKey = `photos/${timestamp}-${crypto.randomUUID()}.${fileExtension}`;
        } else if (media.type.startsWith('video/')) {
          mediaType = 'video';
          mediaKey = `videos/${timestamp}-${crypto.randomUUID()}.${fileExtension}`;
        }
        
        if (mediaKey) {
          console.log('Putting object to R2:', mediaKey);
          await locals.runtime.env.MEDIA_BUCKET.put(mediaKey, mediaArrayBuffer, {
            httpMetadata: {
              contentType: media.type,
            },
          });
          console.log('Media uploaded successfully');
        }
      } catch (uploadError) {
        console.error('Failed to upload media to R2:', uploadError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to upload media',
            details: uploadError instanceof Error ? uploadError.message : String(uploadError)
          }),
          { 
            status: 500, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            } 
          }
        );
      }
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newMemory = {
      id,
      headline,
      name,
      email,
      memory,
      memoryDate: memoryDate || null,
      location: location || null,
      mediaKey,
      mediaType,
      tags,
      createdAt: now,
    };

    console.log('Inserting memory into database:', { id, headline, name, mediaKey, mediaType });
    
    try {
      await db.insert(memoriesTable).values(newMemory);
      console.log('Memory inserted successfully');
    } catch (dbError) {
      console.error('Failed to insert memory into database:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save memory',
          details: dbError instanceof Error ? dbError.message : String(dbError)
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    const responseData = {
      ...newMemory,
      tags: JSON.parse(tags),
      likes: 0,
    };

    console.log('Memory created successfully:', id);

    return new Response(
      JSON.stringify(responseData),
      {
        status: 201,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Failed to create memory - unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create memory',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        } 
      }
    );
  }
};
