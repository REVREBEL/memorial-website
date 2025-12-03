export const prerender = false;

import type { APIRoute } from 'astro';

interface GuestbookEntry {
  id: string;
  name: string;
  location: string;
  relationship: string;
  firstMet: string;
  message: string;
  email: string;
  createdAt: string;
}

interface KVListKey {
  name: string;
}

interface KVListResult {
  keys: KVListKey[];
}

interface KVNamespace {
  list(options: { prefix: string }): Promise<KVListResult>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

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
    const KV = locals.runtime?.env?.KV as KVNamespace | undefined;
    
    if (!KV) {
      return new Response(
        JSON.stringify({ error: 'KV not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    // List all keys with the guestbook: prefix
    const list = await KV.list({ prefix: 'guestbook:' });
    
    // Fetch all entries
    const entries = await Promise.all(
      list.keys.map(async (key: KVListKey) => {
        const value = await KV.get(key.name);
        return value ? JSON.parse(value) : null;
      })
    );

    // Filter out null entries and sort by date (newest first)
    const validEntries = entries
      .filter((entry): entry is GuestbookEntry => entry !== null)
      .sort((a: GuestbookEntry, b: GuestbookEntry) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify(validEntries), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Failed to fetch guestbook entries:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch entries',
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
  try {
    const KV = locals.runtime?.env?.KV as KVNamespace | undefined;
    
    if (!KV) {
      return new Response(
        JSON.stringify({ error: 'KV not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          } 
        }
      );
    }

    const body = await request.json() as { 
      name: string; 
      location: string; 
      relationship: string; 
      firstMet: string; 
      message: string; 
      email: string; 
    };
    
    const { name, location, relationship, firstMet, message, email } = body;

    if (!name || !location || !relationship || !firstMet || !message || !email) {
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

    const id = crypto.randomUUID();
    const entry: GuestbookEntry = {
      id,
      name,
      location,
      relationship,
      firstMet,
      message,
      email,
      createdAt: new Date().toISOString(),
    };

    // Store in KV with a prefixed key
    await KV.put(`guestbook:${id}`, JSON.stringify(entry));

    return new Response(JSON.stringify(entry), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Failed to create guestbook entry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create entry',
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
