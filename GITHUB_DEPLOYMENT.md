# GitHub Deployment Guide for Memory Wall

This guide walks you through deploying the Memory Wall app to Webflow Cloud using GitHub integration.

## Prerequisites

- GitHub repository connected to Webflow
- Database already created in Webflow with ID: `ef51dd7c-c700-4fb0-a3fd-29193928ad4e`
- R2 bucket configured (optional, for media uploads)

## Configuration

The app is configured to run on the `/memories` endpoint:
- **Worker name**: `memories`
- **Base path**: `/memories`
- **Database binding**: `DB` → `memory-wall-db`
- **R2 bucket binding**: `MEDIA_BUCKET` → `memory-wall-media`

## Deployment Steps

### 1. Push to GitHub

```bash
# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/your-username/your-repo.git

# Push the code
git push -u origin main
```

### 2. In Webflow Cloud Dashboard

1. Go to your site's Apps section
2. Create a new app or select existing app
3. Connect to your GitHub repository
4. Configure the deployment:
   - **Branch**: `main`
   - **Endpoint**: `/memories`
   - **Build command**: `npm ci && npm run build`
   - **Output directory**: `dist`

### 3. Database Setup

The database binding should already be configured since you've been testing. Verify in Webflow:

1. Go to Data → Databases
2. Confirm `memory-wall-db` exists with ID `ef51dd7c-c700-4fb0-a3fd-29193928ad4e`
3. Check that the database has the required tables:
   - `memories`
   - `users`
   - `guestbook_entries`

### 4. Environment Variables (if needed)

If you have any custom environment variables, add them in Webflow Cloud dashboard:

- `WEBFLOW_CMS_SITE_API_TOKEN` (if using CMS features)
- `WEBFLOW_API_HOST` (if using a custom API host)

### 5. Deploy

Once everything is configured:
1. Click **Deploy** in Webflow
2. Wait for the build to complete
3. Your app will be available at: `https://your-site.webflow.io/memories`

## Verification

After deployment:

1. Visit `https://your-site.webflow.io/memories`
2. Test the memory submission form
3. Check that likes work
4. Verify media uploads (if R2 is configured)

## Troubleshooting

### Build Fails

- Check the build logs in Webflow dashboard
- Verify all dependencies are in `package.json`
- Ensure `package-lock.json` is committed

### Database Not Working

- Verify the database ID matches in `wrangler.jsonc`
- Check that migrations have been applied
- Confirm the database binding is set up in Webflow

### App Not Loading

- Check that the base path `/memories` matches in:
  - `astro.config.mjs` (base)
  - Webflow app endpoint configuration
  - Worker name in `wrangler.jsonc`

### GitHub Not Syncing

- Verify GitHub integration is active in Webflow
- Check repository permissions
- Ensure the branch name matches (main vs master)

## Fresh Database Setup (if needed)

If you need to start fresh with the database:

```bash
# In Webflow terminal or via wrangler CLI:
wrangler d1 execute memory-wall-db --file=./migrations/0000_initial.sql --remote
```

## Key Files

- `astro.config.mjs` - Base path configuration
- `wrangler.jsonc` - Worker and binding configuration
- `migrations/0000_initial.sql` - Database schema
- `src/lib/base-url.ts` - Dynamic base URL helper

## Support

If you encounter issues:
1. Check build logs in Webflow dashboard
2. Verify database connection in Webflow Data section
3. Contact Webflow support if needed

---

**Note**: This is a fresh deployment to the `/memories` endpoint, which should avoid any caching issues from previous deployments.
