// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { filename } = params;
    
    if (!filename) {
      return new Response('Filename is required', { status: 400 });
    }

    // Get the media file from R2
    const object = await locals.runtime.env.MEDIA_BUCKET.get(filename);
    
    if (!object) {
      return new Response('Media not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return new Response('Failed to fetch media', { status: 500 });
  }
};
