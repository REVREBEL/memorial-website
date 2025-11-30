// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../db/getDb';
import { likesTable } from '../../../../db/schema';

export const POST: APIRoute = async ({ params, locals }) => {
  try {
    const { memoryId } = params;
    
    if (!memoryId) {
      return new Response(
        JSON.stringify({ error: 'Memory ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(locals);
    const now = new Date().toISOString();

    await db.insert(likesTable).values({
      memoryId,
      createdAt: now,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to like memory:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to like memory',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
