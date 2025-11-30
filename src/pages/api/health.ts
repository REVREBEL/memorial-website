import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, request }) => {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    url: url.toString(),
    pathname: url.pathname,
    headers: Object.fromEntries(request.headers.entries()),
    base: '/memories'
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
};

export const prerender = false;
