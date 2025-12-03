# Deployment Notes - Image Upload Fix

## Issue
Getting `413 Request Entity Too Large` error when uploading images in production.

## Root Cause
The reverse proxy (OpenResty/nginx) in front of Cloudflare Workers has a default request body size limit (typically 1MB) that was being exceeded by large image uploads.

## Solution
Implemented client-side image compression before upload to ensure images stay under the size limit.

### Changes Made:

1. **Added Image Compression Library**
   - Installed `browser-image-compression` package
   - Automatically compresses images to ~1MB before upload
   - Reduces to max 1920px width/height
   - Converts to JPEG for optimal compression

2. **Updated File Size Limits**
   - Images: 1.5MB max (after compression, most will be ~1MB)
   - Videos: 10MB max (down from 50MB)
   - Added clear error messages for users

3. **Enhanced User Experience**
   - Shows compression status while processing
   - Displays file size information
   - Logs compression details (original vs compressed)

4. **Added Comprehensive Logging**
   - Server-side logs for all upload/media operations
   - Client-side logs for debugging image loading
   - Emoji prefixes for easy log scanning:
     - 📤 Uploads
     - 🖼️ Media URLs
     - ✅ Success
     - ❌ Errors
     - 🔄 In progress

5. **Fixed Navigation Links**
   - Home → Main Webflow site
   - Life Events → Main Webflow site `/life-events`
   - Recipes → Main Webflow site `/recipes`
   - Share a Memory → App home
   - Guestbook → App guestbook

## Testing Instructions

### Before Deploying:
1. Test locally with various image sizes:
   - Small images (<1MB) - should upload without compression
   - Large images (>1MB) - should be automatically compressed
   - Very large images (>5MB) - should compress significantly

2. Check browser console for compression logs:
   ```
   📷 Original image: { name, size, type }
   🔄 Compressing image...
   ✅ Compressed image: { size, reduction }
   ```

### After Deploying:
1. Upload a test memory with an image in production
2. Verify the image displays correctly
3. Check that the 413 error no longer occurs
4. Test navigation links work correctly

## Deployment Checklist
- [ ] Deploy updated code to production
- [ ] Test image upload with various sizes
- [ ] Verify images display correctly
- [ ] Test navigation links
- [ ] Monitor server logs for any errors
- [ ] Check that existing memories still display

## Rollback Plan
If issues occur, you can revert to the previous version. However, note that:
- Old code will still have the 413 error
- Consider adjusting Webflow's reverse proxy limits instead

## Future Improvements
1. Consider adding video compression
2. Implement progress bars for uploads
3. Add image preview before compression
4. Support multiple image uploads per memory
