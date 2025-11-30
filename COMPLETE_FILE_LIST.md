# 📦 Complete File List for Memory Wall App

## Essential Files to Backup/Recreate

### Configuration Files
- package.json
- tsconfig.json
- astro.config.mjs
- wrangler.jsonc
- webflow.json
- tailwind.config.mjs (if exists)

### Source Code
- src/pages/index.astro
- src/pages/guestbook.astro
- src/layouts/main.astro
- src/components/MemoryWall.tsx
- src/components/MemoryForm.tsx
- src/components/StoriesSection.tsx
- src/lib/db.ts
- src/lib/base-url.ts
- src/lib/memoryStore.ts
- src/middleware.ts
- src/env.d.ts

### API Routes
- src/pages/api/memories/index.ts
- src/pages/api/memories/[memoryId]/like.ts
- src/pages/api/upload.ts

### Database
- migrations/0000_initial.sql
- migrations/ (all migration files)

### Styles
- src/styles/global.css
- src/site-components/global.css

### Site Components (Devlink)
- All files in src/site-components/

Total: ~50-60 files
