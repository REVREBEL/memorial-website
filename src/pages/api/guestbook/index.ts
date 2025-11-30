// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../db/getDb';
import { guestbookTable } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDb(locals);
    
    const entries = await db
      .select()
      .from(guestbookTable)
      .orderBy(desc(guestbookTable.createdAt));

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch guestbook entries:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch guestbook entries',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const db = getDb(locals);
    
    const { name, email, location, relationship, firstMet, message } = data;

    if (!name || !email || !relationship || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newEntry = {
      id,
      name,
      email,
      location: location || null,
      relationship,
      firstMet: firstMet || null,
      message,
      createdAt: now,
    };

    await db.insert(guestbookTable).values(newEntry);

    return new Response(
      JSON.stringify(newEntry),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Failed to create guestbook entry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create guestbook entry',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
