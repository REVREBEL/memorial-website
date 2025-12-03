// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const requestUrl = request.url;
  console.log('=== MEDIA REQUEST START ===');
  console.log('Full URL:', requestUrl);
  console.log('Params:', params);
  
  try {
    // For catch-all routes, Astro provides the matched path in params.key
    // But we need to reconstruct it from the URL if that doesn't work
    let key = params.key;
    
    // If key is undefined, try to extract from the URL path
    if (!key) {
      const url = new URL(request.url);
      const pathMatch = url.pathname.match(/\/api\/media\/(.+)$/);
      key = pathMatch ? pathMatch[1] : '';
    }
    
    console.log('Extracted key:', key);
    
    if (!key) {
      console.error('❌ No key provided in request');
      return new Response('Key is required', { status: 400 });
    }

    console.log('🔍 Fetching media from R2 with key:', key);

    // Get the media file from R2
    const bucket = locals.runtime.env.MEDIA_BUCKET;
    if (!bucket) {
      console.error('❌ MEDIA_BUCKET not found in environment');
      return new Response('Storage not configured', { status: 500 });
    }

    const object = await bucket.get(key);
    
    if (!object) {
      console.error('❌ Media not found in R2:', key);
      // List what's in the bucket for debugging
      try {
        const list = await bucket.list({ prefix: 'photos/', limit: 20 });
        console.log('📁 Available objects in bucket:', list.objects.map(o => ({ key: o.key, size: o.size })));
      } catch (e) {
        console.error('Failed to list bucket:', e);
      }
      return new Response('Media not found', { status: 404 });
    }

    console.log('✅ Media found in R2:', key);
    console.log('  Size:', object.size);
    console.log('  Type:', object.httpMetadata?.contentType);

    // Convert the R2 object body to an ArrayBuffer for development compatibility
    const arrayBuffer = await object.arrayBuffer();

    // Manually construct headers to avoid serialization issues in dev
    const headers: Record<string, string> = {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'ETag': object.httpEtag,
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    // Add content-encoding if present
    if (object.httpMetadata?.contentEncoding) {
      headers['Content-Encoding'] = object.httpMetadata.contentEncoding;
    }

    console.log('=== MEDIA REQUEST SUCCESS ===');
    return new Response(arrayBuffer, { headers });
  } catch (error) {
    console.error('❌ Failed to fetch media:', error);
    console.error('Error details:', error instanceof Error ? error.stack : String(error));
    return new Response(`Failed to fetch media: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
};
