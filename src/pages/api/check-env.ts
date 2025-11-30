import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: 'unknown',
  };

  // Check what's available
  diagnostics.hasLocals = !!locals;
  diagnostics.hasRuntime = !!locals?.runtime;
  diagnostics.hasEnv = !!locals?.runtime?.env;
  
  if (locals?.runtime?.env) {
    const env = locals.runtime.env;
    diagnostics.envKeys = Object.keys(env);
    diagnostics.hasDB = 'DB' in env;
    diagnostics.hasMediaBucket = 'MEDIA_BUCKET' in env;
    
    // Try to identify the type of DB
    if (env.DB) {
      diagnostics.dbType = typeof env.DB;
      diagnostics.dbKeys = Object.keys(env.DB);
    }
  }

  // Check for platform context
  if (locals?.runtime?.ctx) {
    diagnostics.hasContext = true;
  }

  // Check if this is Cloudflare Workers environment
  diagnostics.isCloudflare = typeof locals?.runtime?.env?.DB !== 'undefined';

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
  });
};
