# Webflow Cloud Deployment Guide

## ✅ Pre-Deployment Checklist

Before deploying to Webflow Cloud, verify:

### 1. Configuration Files

- ✅ `astro.config.mjs` - Mount path set correctly
- ✅ `wrangler.jsonc` - All bindings configured
- ✅ `migrations/` folder exists with SQL files
- ✅ `worker-configuration.d.ts` - TypeScript types for bindings

### 2. Database Migrations

Your database migrations MUST be in the `migrations/` folder (NOT `drizzle/`).

Current migrations:
```
migrations/
  └── 0000_initial.sql
```

**Important:** Webflow Cloud looks for migrations in the directory specified in `wrangler.jsonc`:
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "memory-wall-db",
    "database_id": "ef51dd7c-c700-4fb0-a3fd-29193928ad4e",
    "migrations_dir": "migrations"  // ← This must match your folder name
  }
]
```

### 3. Build Verification

Run a local build to ensure everything compiles:
```bash
npm run build
```

Expected output:
- ✅ No TypeScript errors
- ✅ Build completes successfully
- ✅ `dist/` folder created with assets

---

## 🚀 Deployment Process

### What Webflow Cloud Does Automatically

When you deploy, Webflow Cloud will:

1. **Read your `wrangler.jsonc`** and detect:
   - D1 database binding
   - R2 bucket binding
   - Migrations directory

2. **Create/Update Resources**:
   - Create D1 database (if doesn't exist)
   - Create R2 bucket (if doesn't exist)
   - Apply migrations from `migrations/` folder

3. **Generate Production Config**:
   - Creates a production `wrangler.json` with your bindings
   - Sets environment variables (`BASE_URL`, `ASSETS_PREFIX`)
   - Configures Workers runtime

4. **Build & Deploy**:
   - Runs `npm ci` to install dependencies
   - Runs `astro build` to build your app
   - Packages everything into a Worker
   - Deploys to Cloudflare Workers

---

## 🔧 Mount Path Configuration

Your app is configured to run at: **`/memory-wall`**

This is set in `astro.config.mjs`:
```javascript
const PRODUCTION_MOUNT_PATH = '/memory-wall';
```

**Your app will be accessible at:**
```
https://your-webflow-domain.com/memory-wall
```

**Important:** All routes, assets, and API calls automatically use this base path via `src/lib/base-url.ts`:
```typescript
export const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
```

---

## 📦 What Gets Deployed

### Files Included:
- ✅ All built assets from `dist/`
- ✅ Server code from `dist/_worker.js/`
- ✅ Database migrations from `migrations/`
- ✅ Your `wrangler.jsonc` configuration

### Files Excluded:
- ❌ `node_modules/` (reinstalled during build)
- ❌ `drizzle/` folder (only `migrations/` is used)
- ❌ `.wrangler/` (local dev only)
- ❌ Source files (`src/`) - only built output is deployed

---

## 🗄️ Database Migration

### How Migrations Work

1. **Local Development:**
   ```bash
   # Generate new migration
   npm run db:generate
   
   # Apply to local database
   npm run db:apply:local
   ```

2. **Production (Webflow Cloud):**
   - Migrations are automatically applied during deployment
   - Webflow reads `migrations_dir` from `wrangler.jsonc`
   - Each migration file is applied in order (0000_, 0001_, etc.)

### Migration File Format

Migrations must be SQL files with numeric prefixes:
```
migrations/
  ├── 0000_initial.sql      ← Applied first
  ├── 0001_add_column.sql   ← Applied second
  └── 0002_add_index.sql    ← Applied third
```

### Current Schema

The database has these tables:

#### `memories` table:
- `id` - UUID primary key
- `name` - User name
- `email` - User email (not displayed)
- `headline` - Short headline
- `memory` - Full memory text
- `memory_date` - Optional memory date (YYYY-MM)
- `location` - Optional location
- `tags` - JSON array of tags
- `media_key` - R2 storage key for photo/video
- `media_type` - Type: photo/video/none
- `created_at` - Timestamp

#### `likes` table:
- `id` - Auto-incrementing ID
- `memory_id` - Foreign key to memories
- `created_at` - Timestamp

#### `guestbook` table:
- `id` - UUID primary key
- `name` - Guest name
- `location` - Guest location
- `relationship` - Relationship type
- `first_met` - Where they first met
- `message` - Guest message
- `email` - Guest email (not displayed)
- `created_at` - Timestamp

---

## 🪣 R2 Storage

### How Media is Stored

1. **Upload:**
   - User submits photo/video via form
   - File is uploaded to R2 bucket: `memory-wall-media`
   - Unique key generated: `photos/1234567890-filename.jpg`
   - Key is stored in database, not the file itself

2. **Retrieval:**
   - Client requests: `${baseUrl}/api/media/photos/1234567890-filename.jpg`
   - API route fetches from R2 and streams to client
   - Proper Content-Type headers set

### R2 API Endpoint

**File:** `src/pages/api/media/[filename].ts`

```typescript
// Serves files from R2 storage
GET /api/media/{key}
// Example: /api/media/photos/1234567890-image.jpg
```

---

## 🔌 API Endpoints

All API routes are server-side and run on Cloudflare Workers:

### Memories API
```typescript
// Get all memories
GET /api/memories
Response: { memories: Memory[] }

// Create new memory
POST /api/memories
Body: FormData with photo/video, headline, memory, tags, etc.
Response: { success: true, memoryId: string }

// Toggle like
POST /api/memories/{id}/like
Response: { success: true, likes: number }
```

### Guestbook API
```typescript
// Get all entries
GET /api/guestbook
Response: { entries: GuestbookEntry[] }

// Create entry
POST /api/guestbook
Body: FormData with name, location, relationship, message, etc.
Response: { success: true, entryId: string }
```

### Media API
```typescript
// Serve media file from R2
GET /api/media/{key}
Response: Image or video file with proper Content-Type
```

---

## 🐛 Troubleshooting

### Build Fails During Deployment

**Error:** `tar: exited with non-zero exit code 2`

**Causes:**
- Symlinks in dist folder
- Invalid file permissions
- Migrations folder missing or misconfigured

**Solutions:**
1. Verify `migrations/` folder exists with SQL files
2. Check `wrangler.jsonc` has correct `migrations_dir`
3. Ensure no symlinks in project: `find . -type l`
4. Clean build: `rm -rf dist && npm run build`

### Database Not Working

**Error:** `DB binding not found`

**Solutions:**
1. Check database ID in `wrangler.jsonc` matches Webflow dashboard
2. Verify binding name is exactly `"DB"` (case-sensitive)
3. Redeploy to trigger resource creation

### Media Not Loading

**Error:** `Failed to fetch media`

**Solutions:**
1. Check R2 bucket exists in Webflow dashboard
2. Verify bucket binding: `"MEDIA_BUCKET"` in `wrangler.jsonc`
3. Check media API route: `/api/media/[filename].ts`

### 404 on Routes

**Error:** All routes return 404

**Solutions:**
1. Verify mount path matches in `astro.config.mjs`
2. Check `BASE_URL` environment variable
3. Ensure all routes use `baseUrl` from `src/lib/base-url.ts`

### Migrations Not Applied

**Error:** Table doesn't exist

**Solutions:**
1. Check migrations are in `migrations/` folder
2. Verify `wrangler.jsonc` has `"migrations_dir": "migrations"`
3. Check migration file names start with numbers: `0000_`, `0001_`, etc.
4. View deployment logs to see if migrations ran

---

## 📝 Environment Variables

### Automatic (Provided by Webflow):

- `BASE_URL` - Your mount path (e.g., `/memory-wall`)
- `ASSETS_PREFIX` - Asset URL prefix
- `NODE_ENV` - Set to `production`

### Custom (Set in Dashboard):

Add these in your Webflow Cloud environment settings:

- `WEBFLOW_CMS_SITE_API_TOKEN` - For CMS access (if needed)
- `WEBFLOW_API_HOST` - API host override (if needed)

**Access in code:**
```typescript
const token = locals.runtime.env.WEBFLOW_CMS_SITE_API_TOKEN;
```

---

## ✅ Post-Deployment Verification

After deployment succeeds, verify:

1. **App Loads:**
   - Visit: `https://your-domain.com/memory-wall`
   - Navigation works
   - Assets load correctly

2. **Database Works:**
   - Submit a test memory
   - View memories on wall
   - Like a memory

3. **Media Upload:**
   - Upload a photo
   - Verify it displays correctly
   - Check R2 storage in dashboard

4. **Guestbook:**
   - Visit: `https://your-domain.com/memory-wall/guestbook`
   - Submit a test entry
   - Verify it appears in the list

---

## 🔄 Updating After Deployment

### Code Changes:
1. Make changes locally
2. Test with `npm run dev`
3. Build locally: `npm run build`
4. Commit and push (triggers new deployment)

### Database Changes:
1. Generate migration: `npm run db:generate`
2. Test locally: `npm run db:apply:local`
3. Copy new migration to `migrations/` folder
4. Deploy (migrations auto-apply)

### Environment Variables:
1. Update in Webflow Cloud dashboard
2. Redeploy for changes to take effect

---

## 🎯 Key Differences: Local vs Production

| Feature | Local Development | Production (Webflow) |
|---------|------------------|---------------------|
| Mount Path | Root `/` | `/memory-wall` |
| BASE_URL | `` (empty) | `/memory-wall` |
| Database | Local SQLite in `.wrangler/` | Cloudflare D1 |
| Storage | Local file system | Cloudflare R2 |
| Bindings | Platform proxy (simulated) | Real Cloudflare bindings |
| Migrations | Manual (`db:apply:local`) | Automatic on deploy |

---

## 📚 Additional Resources

- [Webflow Cloud Docs](https://developers.webflow.com/cloud)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

## 🆘 Need Help?

If deployment continues to fail:

1. Check the full deployment logs in Webflow Cloud
2. Look for specific error messages
3. Verify all checklist items above
4. Try a clean build locally first
5. Contact Webflow Cloud support with:
   - Your app name
   - Environment name
   - Deployment timestamp
   - Full error logs
