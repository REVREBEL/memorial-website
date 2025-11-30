import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // Check context properties
  diagnostics.checks.hasContext = !!context;
  diagnostics.checks.contextKeys = context ? Object.keys(context) : [];
  
  // Check locals
  diagnostics.checks.hasLocals = !!context.locals;
  diagnostics.checks.localsKeys = context.locals ? Object.keys(context.locals) : [];
  
  // Check runtime
  diagnostics.checks.hasRuntime = !!context.locals?.runtime;
  diagnostics.checks.runtimeKeys = context.locals?.runtime ? Object.keys(context.locals.runtime) : [];
  
  // Check env
  diagnostics.checks.hasEnv = !!context.locals?.runtime?.env;
  diagnostics.checks.envKeys = context.locals?.runtime?.env ? Object.keys(context.locals.runtime.env) : [];

  // Check if DB is available in different locations
  const possibleDbLocations = [
    { path: 'locals.runtime.env.DB', value: context.locals?.runtime?.env?.DB },
    { path: 'locals.env.DB', value: (context.locals as any)?.env?.DB },
    { path: 'context.env.DB', value: (context as any)?.env?.DB },
  ];

  diagnostics.dbLocations = possibleDbLocations.map(loc => ({
    path: loc.path,
    exists: !!loc.value,
    type: typeof loc.value,
    hasKeys: loc.value ? Object.keys(loc.value).length > 0 : false,
  }));

  // Try to find DB anywhere
  let db = null;
  let dbSource = 'not found';
  
  if (context.locals?.runtime?.env?.DB) {
    db = context.locals.runtime.env.DB;
    dbSource = 'locals.runtime.env.DB';
  } else if ((context.locals as any)?.env?.DB) {
    db = (context.locals as any).env.DB;
    dbSource = 'locals.env.DB';
  } else if ((context as any)?.env?.DB) {
    db = (context as any).env.DB;
    dbSource = 'context.env.DB';
  }

  diagnostics.dbFound = {
    found: !!db,
    source: dbSource,
    type: db ? typeof db : null,
  };

  // If we found DB, try a simple query
  if (db) {
    try {
      const result = await db.prepare('SELECT 1 as test').first();
      diagnostics.dbTest = {
        success: true,
        result: result,
      };
    } catch (error) {
      diagnostics.dbTest = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
  });
};
