# R2 Photo/Video Storage Setup Guide

Your Memory Wall now uses **Cloudflare R2** for efficient photo and video storage instead of storing large base64-encoded files in the database.

## ✅ What You've Already Done

1. **Created R2 Bucket** (locally):
   ```bash
   npx wrangler r2 bucket create memory-wall-media
   ```

2. **Updated Configuration**:
   - `wrangler.jsonc` now includes the R2 bucket binding
   - `worker-configuration.d.ts` includes R2 TypeScript types

## 🎯 How It Works

### Upload Flow:
1. User selects a photo/video in the form
2. File is uploaded to `/api/upload` endpoint
3. API saves file to R2 bucket with a unique filename
4. API returns the URL path (e.g., `/api/media/12345-abc.jpg`)
5. Memory is saved to database with the URL (not base64 data)
6. When displaying, files are served from `/api/media/[filename]`

### File Limits:
- **Photos**: 5MB max
- **Videos**: 50MB max
- **Supported formats**: 
  - Images: JPEG, PNG, GIF, WebP
  - Videos: MP4, WebM, QuickTime

## 📁 Files Created/Updated

### New Files:
- `src/pages/api/upload.ts` - Handles file uploads to R2
- `src/pages/api/media/[filename].ts` - Serves files from R2

### Updated Files:
- `src/components/MemoryForm.tsx` - Now uploads to R2 instead of base64
- `wrangler.jsonc` - Added R2 bucket binding
- `worker-configuration.d.ts` - Added R2 TypeScript types

## 🔒 Access & Permissions

The R2 bucket is **private by default**. Files are served through your API endpoints at `/api/media/[filename]`, which:
- Are part of your Cloudflare Workers deployment
- Use the same domain as your app
- Don't require public bucket access
- Include proper caching headers

## 🚀 Benefits

✅ **Much smaller database** - No large base64 strings  
✅ **Faster performance** - Files served with CDN caching  
✅ **Better scalability** - R2 handles unlimited media files  
✅ **Cost effective** - R2 has no egress fees  
✅ **Proper content types** - Correct MIME types for images/videos  

## 🧪 Testing

Once deployed in Webflow:
1. Click "Add Memory" 
2. Upload a photo or video
3. You should see an upload progress indicator
4. File will be stored in R2 and served via `/api/media/*`
5. Memory will display the uploaded media

## 🔍 Troubleshooting

**Upload fails:**
- Check that R2 bucket was created successfully
- Verify `wrangler.jsonc` has correct bucket name
- Check browser console for detailed error messages

**Media not displaying:**
- Verify the memory has a valid photo/video URL
- Check that `/api/media/[filename]` endpoint returns the file
- Inspect network tab to see if files are loading

## 📊 Database Schema

The database stores URLs, not file data:

```sql
CREATE TABLE memories (
  photo_url TEXT,      -- e.g., '/api/media/12345-abc.jpg'
  video_url TEXT,      -- e.g., '/api/media/67890-xyz.mp4'
  ...
);
```

## 🎉 You're All Set!

Your Memory Wall is now configured to use R2 for efficient media storage. When you preview or deploy in Webflow, everything should work seamlessly!
