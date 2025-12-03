export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../db/getDb';
import { likesTable, memoriesTable } from '../../../../db/schema';
import { eq, sql } from 'drizzle-orm';

// CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const POST: APIRoute = async ({ params, locals }) => {
  const { memoryId } = params;

  if (!memoryId) {
    return new Response(
      JSON.stringify({ error: 'Memory ID is required' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        } 
      }
    );
  }

  try {
    const db = getDb(locals);

    // Insert a like (id will be auto-generated)
    await db.insert(likesTable).values({
      memoryId,
      createdAt: new Date().toISOString(),
    });

    // Get updated memory with like count
    const [updatedMemory] = await db
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
        likes: sql<number>`COALESCE((SELECT COUNT(*) FROM ${likesTable} WHERE memory_id = ${memoriesTable.id}), 0)`,
      })
      .from(memoriesTable)
      .where(eq(memoriesTable.id, memoryId));

    if (!updatedMemory) {
      return new Response(
        JSON.stringify({ error: 'Memory not found' }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    const response = {
      ...updatedMemory,
      tags: JSON.parse(updatedMemory.tags),
      likes: Number(updatedMemory.likes) || 0,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Failed to like memory:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to like memory',
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
