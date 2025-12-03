import type {MiddlewareHandler} from 'astro';

// Simple in-memory rate limiting (resets on deployment)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: Request): string {
  // In production, use CF-Connecting-IP header from Cloudflare
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp;
  
  // Fallback to X-Forwarded-For or a generic key
  const forwardedFor = request.headers.get('X-Forwarded-For');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  
  return 'unknown';
}

function checkRateLimit(request: Request, maxRequests: number, windowMs: number): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  const host = request.headers.get('Host');

  // In development, allow localhost
  if (import.meta.env.DEV) {
    return true;
  }

  // Check if request comes from same origin
  if (origin) {
    try {
      const originUrl = new URL(origin);
      // Allow if origin matches host
      if (originUrl.host === host) return true;
      // Allow webflow.io domains
      if (originUrl.hostname.endsWith('.webflow.io')) return true;
    } catch {
      return false;
    }
  }

  // Check referer as fallback
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      // Allow if referer matches host
      if (refererUrl.host === host) return true;
      // Allow webflow.io domains
      if (refererUrl.hostname.endsWith('.webflow.io')) return true;
    } catch {
      return false;
    }
  }

  // If no origin or referer, block in production (likely direct API access)
  return false;
}

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const {request} = ctx;
  const url = new URL(request.url);

  // Allow Webflow ready check
  if (import.meta.env.DEV && url.pathname === '/-wf/ready') {
    const resHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return new Response(JSON.stringify({ready: true}), {
      headers: resHeaders,
    });
  }

  // Apply security checks to API POST/PUT/DELETE requests
  const isApiRequest = url.pathname.startsWith('/api/');
  const isModifyingRequest = ['POST', 'PUT', 'DELETE'].includes(request.method);

  if (isApiRequest && isModifyingRequest) {
    // Check origin/referer
    if (!isAllowedOrigin(request)) {
      console.warn('[Security] Blocked request from unauthorized origin:', {
        origin: request.headers.get('Origin'),
        referer: request.headers.get('Referer'),
        path: url.pathname,
      });
      
      return new Response(
        JSON.stringify({ error: 'Unauthorized origin' }), 
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Apply rate limiting
    // 10 requests per minute for memory/guestbook submissions
    const isSubmission = url.pathname.includes('/memories') || url.pathname.includes('/guestbook');
    if (isSubmission && !checkRateLimit(request, 10, 60000)) {
      console.warn('[Security] Rate limit exceeded:', {
        ip: getRateLimitKey(request),
        path: url.pathname,
      });

      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }), 
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  return next();
};
