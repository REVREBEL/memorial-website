# D1 Database Setup Guide

This guide will walk you through setting up Cloudflare D1 database for the Memory Wall application.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler` or use via `npx`)
- Authenticated with Wrangler (`npx wrangler login`)

## Step 1: Create the D1 Database

Run the following command to create your D1 database:

```bash
npx wrangler d1 create memory-wall-db
```

This will output something like:

```
✅ Successfully created DB 'memory-wall-db'!

[[d1_databases]]
binding = "DB"
database_name = "memory-wall-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Step 2: Update wrangler.jsonc

Copy the `database_id` from the output and replace `YOUR_DATABASE_ID_HERE` in `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "memory-wall-db",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // <-- paste your ID here
    "migrations_dir": "migrations"
  }
]
```

## Step 3: Run Migrations (Local Development)

Apply the database schema to your local development database:

```bash
npx wrangler d1 migrations apply memory-wall-db --local
```

This will create the `memories` and `likes` tables in your local D1 database.

## Step 4: Run Migrations (Production)

When you're ready to deploy to production, apply migrations to your remote database:

```bash
npx wrangler d1 migrations apply memory-wall-db --remote
```

## Step 5: Test Your Setup

Start your development server:

```bash
npm run dev
```

The app should now be using D1 for storage! Try:
1. Creating a new memory
2. Liking a memory
3. Refreshing the page to verify persistence

## Photo/Video Storage Recommendation

### Option 1: Cloudflare R2 (Recommended)

R2 is Cloudflare's S3-compatible object storage, perfect for media files.

**Setup:**

1. Create an R2 bucket:
```bash
npx wrangler r2 bucket create memory-wall-media
```

2. Uncomment the R2 binding in `wrangler.jsonc`:
```jsonc
"r2_buckets": [
  {
    "binding": "MEDIA_BUCKET",
    "bucket_name": "memory-wall-media"
  }
]
```

3. Update file upload logic to save to R2 and store URLs in D1

**Benefits:**
- No egress fees
- S3-compatible API
- Integrated with Cloudflare Workers
- Cost-effective for large files

### Option 2: Cloudflare Images

Cloudflare Images is optimized for image delivery with automatic optimization.

**Setup:**
1. Enable Cloudflare Images in your dashboard
2. Use the Direct Creator Upload API
3. Store image IDs/URLs in D1

**Benefits:**
- Automatic image optimization
- Responsive variants
- Global CDN delivery

### Option 3: Base64 Data URLs (Current - Not Recommended for Production)

Currently, the app stores images as base64 data URLs directly in the database.

**Issues:**
- Increases database size significantly
- Poor performance for large images
- Not scalable

**Recommendation:** Switch to R2 or Cloudflare Images before production deployment.

## Current Implementation Notes

### Like Tracking

The app now uses database-based like tracking:
- Individual likes are stored in the `likes` table
- Session IDs are generated from IP + User Agent (anonymous tracking)
- Users can like/unlike memories
- Like counts are accurate across sessions and devices

### Session ID Generation

A consistent session ID is generated from:
- Client IP address (from `cf-connecting-ip` header)
- User Agent string

This allows anonymous like tracking without requiring user authentication.

### Data Stored in D1

**Memories Table:**
- `id` - Unique memory identifier
- `headline` - Memory headline/title
- `name` - Submitter's name
- `email` - Submitter's email (not displayed publicly)
- `photo_url` - Photo URL (or base64 data URL)
- `video_url` - Video URL (or base64 data URL)
- `short_memory` - Short preview (200 chars)
- `full_story` - Full memory text
- `tags` - JSON array of tags
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Likes Table:**
- `id` - Auto-incrementing ID
- `memory_id` - Foreign key to memories
- `session_id` - Hashed session identifier
- `ip_address` - Client IP (optional)
- `user_agent` - Client user agent (optional)
- `created_at` - When the like was created

## Useful Commands

```bash
# List all D1 databases
npx wrangler d1 list

# Execute raw SQL (local)
npx wrangler d1 execute memory-wall-db --local --command "SELECT * FROM memories"

# Execute raw SQL (remote)
npx wrangler d1 execute memory-wall-db --remote --command "SELECT * FROM memories"

# View migration status
npx wrangler d1 migrations list memory-wall-db --local
npx wrangler d1 migrations list memory-wall-db --remote

# Delete database (careful!)
npx wrangler d1 delete memory-wall-db
```

## Troubleshooting

### Error: "DB is not defined"

Make sure:
1. You've created the database with `wrangler d1 create`
2. You've updated the `database_id` in `wrangler.jsonc`
3. You've restarted your dev server after updating config

### Migrations not applying

Try:
```bash
npx wrangler d1 migrations list memory-wall-db --local
```

If migrations show as pending, run:
```bash
npx wrangler d1 migrations apply memory-wall-db --local
```

### Data not persisting in dev

Local D1 data is stored in `.wrangler/state/v3/d1/`. If you need to reset:
```bash
rm -rf .wrangler/state
npx wrangler d1 migrations apply memory-wall-db --local
```

## Next Steps

1. ✅ Set up D1 database
2. ⏳ Implement R2 for photo/video storage
3. ⏳ Add file upload handling
4. ⏳ Test with production data
5. ⏳ Deploy to Cloudflare Workers

For R2 implementation help, see the code comments in the API endpoints or ask for assistance!
