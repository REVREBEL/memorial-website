globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_DNI3_57z.mjs';
import './chunks/astro/server_C6yUJjNp.mjs';
import { s as sequence } from './chunks/index_Cs6PuYBG.mjs';

const rateLimitMap = /* @__PURE__ */ new Map();
function getRateLimitKey(request) {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) return cfIp;
  const forwardedFor = request.headers.get("X-Forwarded-For");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
function checkRateLimit(request, maxRequests, windowMs) {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count++;
  return true;
}
function isAllowedOrigin(request) {
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");
  const host = request.headers.get("Host");
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host === host) return true;
      if (originUrl.hostname.endsWith(".webflow.io")) return true;
    } catch {
      return false;
    }
  }
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host) return true;
      if (refererUrl.hostname.endsWith(".webflow.io")) return true;
    } catch {
      return false;
    }
  }
  return false;
}
const onRequest$2 = async (ctx, next) => {
  const { request } = ctx;
  const url = new URL(request.url);
  const isApiRequest = url.pathname.startsWith("/api/");
  const isModifyingRequest = ["POST", "PUT", "DELETE"].includes(request.method);
  if (isApiRequest && isModifyingRequest) {
    if (!isAllowedOrigin(request)) {
      console.warn("[Security] Blocked request from unauthorized origin:", {
        origin: request.headers.get("Origin"),
        referer: request.headers.get("Referer"),
        path: url.pathname
      });
      return new Response(
        JSON.stringify({ error: "Unauthorized origin" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const isSubmission = url.pathname.includes("/memories") || url.pathname.includes("/guestbook");
    if (isSubmission && !checkRateLimit(request, 10, 6e4)) {
      console.warn("[Security] Rate limit exceeded:", {
        ip: getRateLimitKey(request),
        path: url.pathname
      });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
  return next();
};

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
