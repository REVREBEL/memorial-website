import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('=== UPLOAD REQUEST START ===');
  
  try {
    const mediaBucket = locals.runtime.env.MEDIA_BUCKET;
    
    if (!mediaBucket) {
      console.error('❌ Media storage not configured');
      return new Response(JSON.stringify({ error: 'Media storage not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('📤 Upload details:');
    console.log('  File name:', file?.name);
    console.log('  File size:', file?.size, 'bytes', '(' + (file?.size / 1024 / 1024).toFixed(2) + ' MB)');
    console.log('  File type:', file?.type);

    if (!file) {
      console.error('❌ No file provided');
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (1.5MB for images, 10MB for videos)
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 1.5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '10MB' : '1.5MB';
      console.error('❌ File too large:', file.size, 'bytes. Max:', maxSize);
      return new Response(
        JSON.stringify({ 
          error: `File too large. Max size is ${maxSizeMB}. Please compress your ${file.type.startsWith('video/') ? 'video' : 'image'} first.` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only images and videos are allowed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename with proper prefix
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const prefix = file.type.startsWith('video/') ? 'videos' : 'photos';
    const filename = `${prefix}/${timestamp}-${randomString}.${extension}`;

    console.log('📝 Generated filename:', filename);

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await mediaBucket.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    console.log('✅ File uploaded to R2:', filename);

    // Return the public URL
    const url = `/api/media/${filename}`;
    
    console.log('🔗 Media URL:', url);
    console.log('=== UPLOAD REQUEST SUCCESS ===');

    return new Response(
      JSON.stringify({ 
        url,
        type: file.type.startsWith('video/') ? 'video' : 'photo',
        filename 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('Error details:', error instanceof Error ? error.stack : String(error));
    return new Response(
      JSON.stringify({ error: 'Failed to upload file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
