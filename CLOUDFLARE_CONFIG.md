# Cloudflare Workers Configuration Guide for Webflow Cloud

This document summarizes all the Cloudflare-specific configurations for this Astro application deployed on Webflow Cloud.

## ✅ Configurations Applied

### 1. Astro Config (`astro.config.mjs`)

#### Base Path & Assets Configuration
```javascript
export default defineConfig({
  // Use BASE_URL in production (provided by Webflow)
  base: process.env.NODE_ENV === 'production' ? PRODUCTION_MOUNT_PATH : '',
  
  // Ensure assets use the same base path
  build: {
    assetsPrefix: process.env.NODE_ENV === 'production' ? PRODUCTION_MOUNT_PATH : undefined,
  },
  
  output: 'server',
});
```

**Why?** Webflow Cloud deploys apps on mount paths (e.g., `/memory-wall`). This ensures all routes and assets work correctly.

#### Platform Proxy Enabled
```javascript
adapter: cloudflare({
  platformProxy: {
    enabled: true, // Enables Cloudflare bindings in dev mode
  },
}),
```

**Why?** Allows access to D1, R2, and KV bindings during local development via `locals.runtime.env`.

#### CSRF Protection Disabled
```javascript
security: {
  checkOrigin: false, // Required for form submissions
},
```

**Why?** Astro's CSRF protection can block legitimate POST requests with FormData. Cloudflare Workers provides its own security layer.

#### React 19 Compatibility
```javascript
vite: {
  resolve: {
    alias: import.meta.env.PROD
      ? {
          'react-dom/server': 'react-dom/server.edge',
        }
      : undefined,
  },
}
```

**Why?** Required for React 19 to work on Cloudflare Workers runtime.

---

### 2. Wrangler Configuration (`wrangler.jsonc`)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "astro",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2025-04-15",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "observability": {
    "enabled": true
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "memory-wall-db",
      "database_id": "ef51dd7c-c700-4fb0-a3fd-29193928ad4e",
      "migrations_dir": "drizzle"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "memory-wall-media"
    }
  ]
}
```

**Important:** When you deploy to Webflow Cloud, Webflow automatically generates a production `wrangler.json` file. Your local `wrangler.jsonc` is only for local development.

---

### 3. Worker Configuration Types (`worker-configuration.d.ts`)

```typescript
interface Env {
  WEBFLOW_CMS_SITE_API_TOKEN?: string;
  WEBFLOW_API_HOST?: string;
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}
```

**Why?** Provides TypeScript types for all Cloudflare bindings and environment variables.

---

### 4. API Routes

All API routes include:

```typescript
// Enable Edge runtime for Cloudflare Workers
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // Access bindings
  const db = locals.runtime.env.DB;
  const bucket = locals.runtime.env.MEDIA_BUCKET;
  
  // Your code...
};
```

#### Routes Configured:
- ✅ `src/pages/api/memories/index.ts` - GET/POST memories
- ✅ `src/pages/api/memories/[memoryId]/like.ts` - Toggle likes
- ✅ `src/pages/api/media/[filename].ts` - Serve R2 media
- ✅ `src/pages/api/guestbook/index.ts` - GET/POST guestbook entries

---

### 5. Environment Variables

#### Webflow-Provided Variables

Webflow Cloud automatically provides these in production:

- `BASE_URL` - The mount path of your environment (e.g., `/memory-wall`)
- `ASSETS_PREFIX` - URL for static assets pointing to your Worker

#### How to Access

**In Astro Components (.astro files):**
```astro
---
// Built-in Astro env vars
const baseUrl = import.meta.env.BASE_URL;
const assetsPrefix = import.meta.env.ASSETS_PREFIX;

// Custom env vars from Webflow dashboard
const siteId = Astro.locals.runtime.env.WEBFLOW_SITE_ID;
---

<!-- Using BASE_URL for navigation -->
<a href={`${baseUrl}/guestbook`}>Guestbook</a>

<!-- Using ASSETS_PREFIX for static assets -->
<img src={`${assetsPrefix}/images/logo.png`} alt="Logo" />
```

**In API Routes:**
```typescript
export const GET: APIRoute = async ({ locals }) => {
  // Access Cloudflare bindings
  const db = locals.runtime.env.DB;
  const bucket = locals.runtime.env.MEDIA_BUCKET;
  
  // Access custom env vars
  const apiToken = locals.runtime.env.WEBFLOW_SITE_API_TOKEN;
  
  // Use them...
};
```

**In Client-Side Code:**
```typescript
// Use the baseUrl helper (already configured)
import { baseUrl } from '@/lib/base-url';

// API fetch with correct path
fetch(`${baseUrl}/api/memories`);
```

#### Setting Custom Environment Variables

Add custom environment variables in your Webflow Cloud dashboard:
1. Go to your app's environment settings
2. Add variables (they'll be available via `locals.runtime.env.VARIABLE_NAME`)
3. Redeploy for changes to take effect

---

### 6. Database Access Pattern

```typescript
import { getDb } from '../../../db/getDb';

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals);  // Gets D1 binding from locals.runtime.env.DB
  
  // Perform database operations with Drizzle ORM
  const memories = await db.select().from(memoriesTable);
  
  return new Response(JSON.stringify(memories), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

### 7. R2 Storage Access

```typescript
export const POST: APIRoute = async ({ request, locals }) => {
  const formData = await request.formData();
  const file = formData.get('photo') as File;
  
  // Upload to R2
  const fileKey = `photos/${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  
  await locals.runtime.env.MEDIA_BUCKET.put(fileKey, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
  });
  
  // Return the key to store in database
  return new Response(JSON.stringify({ key: fileKey }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

### 8. React Components

All interactive React components use client directives:

```astro
---
import { Navigation } from '@/site-components/Navigation';
import { MemoryWall } from '@/components/MemoryWall';
---

<!-- Server-render first, then hydrate -->
<Navigation client:load />

<!-- Client-only rendering (uses browser APIs) -->
<MemoryWall client:only="react" />
```

---

## 🚀 Development vs Production

### Local Development (`npm run dev`)

**What happens:**
- Platform proxy creates **local versions** of all bindings
- D1 database stored in `.wrangler/state/v3/d1/`
- R2 bucket simulated locally
- `BASE_URL` is empty (root path)
- Access bindings via `locals.runtime.env.*`

**Database setup:**
```bash
# Generate migrations
npm run db:generate

# Apply migrations locally
npm run db:apply:local
```

### Production (Webflow Cloud)

**What happens:**
- Webflow reads your `wrangler.jsonc` bindings
- Automatically creates D1 database and R2 bucket
- Generates production `wrangler.json` with all configuration
- Provides `BASE_URL` and `ASSETS_PREFIX` environment variables
- Same code works - no changes needed!

**Database setup:**
- Migrations are automatically applied during deployment
- Webflow reads `migrations_dir` from `wrangler.jsonc`
- D1 database is automatically provisioned

---

## 📋 Deployment Checklist

Before deploying to Webflow Cloud:

1. ✅ Set your mount path in `astro.config.mjs` (`PRODUCTION_MOUNT_PATH`)
2. ✅ Ensure `wrangler.jsonc` has all required bindings:
   - D1 database with `migrations_dir: "drizzle"`
   - R2 bucket for media storage
3. ✅ All API routes have `export const prerender = false;`
4. ✅ Database migrations are in the `drizzle/` folder
5. ✅ All URLs use `baseUrl` from `src/lib/base-url.ts`
6. ✅ React components have proper `client:` directives
7. ✅ Run `npm run build` locally to verify it builds successfully

---

## 🔍 Troubleshooting

### "DB binding not found" error (Local Dev)
**Fix:**
- Check `platformProxy.enabled` is `true` in `astro.config.mjs`
- Restart dev server: `npm run dev`
- Verify `wrangler.jsonc` has DB binding configured

### "DB binding not found" error (Production)
**Fix:**
- Check Webflow Cloud created the D1 database (look in dashboard)
- Verify binding name matches: `"binding": "DB"` in `wrangler.jsonc`
- Redeploy the app

### POST requests failing
**Fix:**
- Verify `security.checkOrigin: false` in `astro.config.mjs`
- Check Content-Type headers match request body format
- Make sure API route has `export const prerender = false;`

### Assets not loading in production
**Fix:**
- Verify `base` path in `astro.config.mjs` matches your mount path
- Check all URLs use `baseUrl` from `src/lib/base-url.ts`
- Check `assetsPrefix` is configured in `build` section

### Database migration errors
**Fix:**
- Make sure `migrations_dir: "drizzle"` in `wrangler.jsonc`
- Verify migration files are in `drizzle/` folder
- Check migration SQL is compatible with SQLite (D1 uses SQLite)

---

## 📚 Additional Resources

- [Webflow Cloud Documentation](https://developers.webflow.com/cloud)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
