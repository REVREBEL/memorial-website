// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../db/getDb';
import { memoriesTable, likesTable } from '../../../db/schema';
import { desc, sql, eq } from 'drizzle-orm';

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
        likes: sql<number>`COALESCE((SELECT COUNT(*) FROM ${likesTable} WHERE ${likesTable.memoryId} = ${memoriesTable.id}), 0)`,
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
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch memories:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch memories',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const db = getDb(locals);
    
    const headline = formData.get('headline') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const memory = formData.get('memory') as string;
    const memoryDate = formData.get('memoryDate') as string;
    const location = formData.get('location') as string;
    const tags = formData.get('tags') as string;
    const media = formData.get('media') as File | null;

    if (!headline || !name || !email || !memory) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let mediaKey = null;
    let mediaType = 'none';

    // Upload media to R2 if provided
    if (media && media.size > 0) {
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
        await locals.runtime.env.MEDIA_BUCKET.put(mediaKey, mediaArrayBuffer, {
          httpMetadata: {
            contentType: media.type,
          },
        });
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

    await db.insert(memoriesTable).values(newMemory);

    return new Response(
      JSON.stringify({
        ...newMemory,
        tags: JSON.parse(tags),
        likes: 0,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Failed to create memory:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create memory',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
