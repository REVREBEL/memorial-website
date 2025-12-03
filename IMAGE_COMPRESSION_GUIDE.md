# Image Compression Implementation Guide

## Overview
This document explains how automatic image compression works in the Memory Journal app to prevent upload errors and improve performance.

## How It Works

### 1. User Selects an Image
When a user selects an image file in the memory form:

```typescript
handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>)
```

### 2. Size Check
The system first checks if compression is needed:
- **Files ≤1MB**: Used as-is, no compression
- **Files >1MB**: Automatically compressed

### 3. Compression Process
Using the `browser-image-compression` library:

```typescript
const options = {
  maxSizeMB: 1,              // Target 1MB
  maxWidthOrHeight: 1920,    // Max dimension
  useWebWorker: true,        // Use Web Worker for better performance
  fileType: 'image/jpeg',    // Convert to JPEG
};

const compressedFile = await imageCompression(file, options);
```

### 4. Upload
The compressed (or original small) file is then uploaded via FormData.

## Configuration

### Client-Side Limits (MemoryForm.tsx)
```typescript
// Images: Compressed to ~1MB
// Videos: 10MB max (no compression yet)
```

### Server-Side Limits (upload.ts)
```typescript
// Images: 1.5MB max (buffer for compression variance)
// Videos: 10MB max
```

### API Limits (memories/index.ts)
- No hard-coded size limits
- Relies on upload API validation

## Benefits

1. **Prevents 413 Errors**: Files stay under reverse proxy limits
2. **Faster Uploads**: Smaller files = faster transfers
3. **Better Performance**: Optimized images load faster
4. **Storage Savings**: Reduced R2 storage costs
5. **Bandwidth Savings**: Less data transfer

## User Experience

### Visual Feedback
```
Upload Photo
Auto-compressed to ~1MB
```

### Compression Status
While compressing large images, users see:
```
Compressing image...
```

### Console Logs (Development)
```javascript
📷 Original image: { name: "photo.jpg", size: "5.23 MB", type: "image/jpeg" }
🔄 Compressing image...
✅ Compressed image: { name: "photo.jpg", size: "0.98 MB", reduction: "81.3%" }
```

## Technical Details

### Compression Algorithm
- Uses browser-native Canvas API
- Maintains aspect ratio
- Adjusts quality to meet target size
- Converts all images to JPEG for optimal compression

### Browser Compatibility
- Modern browsers: ✅ Full support
- Older browsers: May not compress (will fail if file >1.5MB)

### Web Worker
- Compression runs in background thread
- Doesn't block UI
- Better user experience on slower devices

## Error Handling

### Client-Side
```typescript
try {
  const compressedFile = await imageCompression(file, options);
  // Success
} catch (error) {
  setErrors({ photo: 'Failed to process image' });
}
```

### Server-Side
```typescript
if (file.size > maxSize) {
  return new Response(
    JSON.stringify({ 
      error: `File too large. Max size is 1.5MB. Please compress your image first.` 
    }),
    { status: 400 }
  );
}
```

## Testing Scenarios

### Test Case 1: Small Image
- Input: 500KB JPEG
- Expected: No compression, uploads as-is
- Result: ✅ Fast upload

### Test Case 2: Medium Image
- Input: 3MB JPEG
- Expected: Compressed to ~1MB
- Result: ✅ Slight delay, uploads successfully

### Test Case 3: Large Image
- Input: 8MB PNG
- Expected: Compressed to ~1MB JPEG
- Result: ✅ Noticeable compression time, uploads successfully

### Test Case 4: Very Large Image
- Input: 20MB RAW
- Expected: Compressed to ~1MB JPEG
- Result: ✅ Longer compression time, significant quality adjustment

## Performance Metrics

### Compression Speed (Approximate)
- 1-3MB: < 1 second
- 3-5MB: 1-2 seconds
- 5-10MB: 2-4 seconds
- 10MB+: 4-8 seconds

### Typical Results
| Original Size | Compressed Size | Reduction | Quality Loss |
|--------------|-----------------|-----------|--------------|
| 2MB          | 0.9MB          | 55%       | Minimal      |
| 5MB          | 1.0MB          | 80%       | Slight       |
| 10MB         | 1.0MB          | 90%       | Noticeable   |
| 20MB         | 1.0MB          | 95%       | Significant  |

## Maintenance

### Adjusting Target Size
To change the target compression size:

```typescript
// In MemoryForm.tsx
const options = {
  maxSizeMB: 0.5,  // Change to 500KB
  // ...
};

// Also update in upload.ts
const maxSize = 0.6 * 1024 * 1024;  // 600KB buffer
```

### Disabling Compression
To disable automatic compression:

```typescript
// Remove the compression block in handlePhotoChange
// Just validate size and set the file directly
if (file.size > 1.5 * 1024 * 1024) {
  setErrors({ photo: 'File too large' });
  return;
}
setMediaFile(file);
```

## Future Enhancements

1. **Video Compression**: Add video compression for larger videos
2. **Custom Quality**: Let users choose compression quality
3. **Batch Processing**: Support multiple images at once
4. **Advanced Options**: EXIF preservation, format conversion options
5. **Progressive Upload**: Show upload progress bar
6. **Cloud Processing**: Move compression to server-side for heavier processing

## Troubleshooting

### Issue: Images Not Compressing
- Check browser console for errors
- Verify `browser-image-compression` is installed
- Test with different image formats

### Issue: Compression Too Slow
- Reduce `maxWidthOrHeight` (e.g., 1280 instead of 1920)
- Ensure `useWebWorker: true` is set
- Check device performance

### Issue: Quality Too Low
- Increase `maxSizeMB` (e.g., 1.5 instead of 1)
- Adjust server-side limits accordingly
- Consider manual quality slider

### Issue: Still Getting 413 Error
- Check actual compressed file size in console
- Verify server-side limits match client-side
- Check reverse proxy configuration
- Contact Webflow support for proxy limit increase
