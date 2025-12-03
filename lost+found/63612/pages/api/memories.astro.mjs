globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, s as sql, m as memoriesTable, d as desc } from '../../chunks/getDb_DiPBwBUr.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const prerender = false;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};
const GET = async ({ locals }) => {
  try {
    const db = getDb(locals);
    const memories = await db.select({
      id: memoriesTable.id,
      headline: memoriesTable.headline,
      name: memoriesTable.name,
      memory: memoriesTable.memory,
      memoryDate: memoriesTable.memoryDate,
      location: memoriesTable.location,
      mediaKey: memoriesTable.mediaKey,
      mediaType: memoriesTable.mediaType,
      tags: memoriesTable.tags,
      createdAt: memoriesTable.createdAt,
      likes: sql`COALESCE((SELECT COUNT(*) FROM likes WHERE memory_id = memories.id), 0)`
    }).from(memoriesTable).orderBy(desc(memoriesTable.createdAt));
    const formattedMemories = memories.map((memory) => ({
      ...memory,
      tags: JSON.parse(memory.tags),
      likes: Number(memory.likes) || 0
    }));
    return new Response(JSON.stringify(formattedMemories), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Failed to fetch memories:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch memories",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};
const POST = async ({ request, locals }) => {
  console.log("POST /api/memories - Starting request");
  console.log("Request origin:", request.headers.get("origin"));
  console.log("Request content-type:", request.headers.get("content-type"));
  try {
    if (!locals.runtime?.env?.DB) {
      console.error("Database not available");
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    if (!locals.runtime?.env?.MEDIA_BUCKET) {
      console.error("Media bucket not available");
      return new Response(
        JSON.stringify({ error: "Media storage not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    const formData = await request.formData();
    console.log("FormData received, keys:", Array.from(formData.keys()));
    const db = getDb(locals);
    const headline = formData.get("headline");
    const name = formData.get("name");
    const email = formData.get("email");
    const memory = formData.get("memory");
    const memoryDate = formData.get("memoryDate");
    const location = formData.get("location");
    const tags = formData.get("tags");
    const media = formData.get("media");
    console.log("Parsed form data:", {
      headline,
      name,
      email,
      memoryLength: memory?.length,
      memoryDate,
      location,
      tags,
      hasMedia: !!media,
      mediaSize: media?.size,
      mediaType: media?.type
    });
    if (!headline || !name || !email || !memory) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    let mediaKey = null;
    let mediaType = "none";
    if (media && media.size > 0) {
      console.log("Uploading media to R2:", media.name, media.type, media.size);
      try {
        const mediaArrayBuffer = await media.arrayBuffer();
        const fileExtension = media.name.split(".").pop();
        const timestamp = Date.now();
        if (media.type.startsWith("image/")) {
          mediaType = "photo";
          mediaKey = `photos/${timestamp}-${crypto.randomUUID()}.${fileExtension}`;
        } else if (media.type.startsWith("video/")) {
          mediaType = "video";
          mediaKey = `videos/${timestamp}-${crypto.randomUUID()}.${fileExtension}`;
        }
        if (mediaKey) {
          console.log("Putting object to R2:", mediaKey);
          await locals.runtime.env.MEDIA_BUCKET.put(mediaKey, mediaArrayBuffer, {
            httpMetadata: {
              contentType: media.type
            }
          });
          console.log("Media uploaded successfully");
        }
      } catch (uploadError) {
        console.error("Failed to upload media to R2:", uploadError);
        return new Response(
          JSON.stringify({
            error: "Failed to upload media",
            details: uploadError instanceof Error ? uploadError.message : String(uploadError)
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }
    }
    const id = crypto.randomUUID();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newMemory = {
      id,
      headline,
      name,
      email,
      memory,
      memoryDate: memoryDate || null,
      location: location || null,
      mediaKey,
      mediaType,
      tags,
      createdAt: now
    };
    console.log("Inserting memory into database:", { id, headline, name, mediaKey, mediaType });
    try {
      await db.insert(memoriesTable).values(newMemory);
      console.log("Memory inserted successfully");
    } catch (dbError) {
      console.error("Failed to insert memory into database:", dbError);
      return new Response(
        JSON.stringify({
          error: "Failed to save memory",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    const responseData = {
      ...newMemory,
      tags: JSON.parse(tags),
      likes: 0
    };
    console.log("Memory created successfully:", id);
    return new Response(
      JSON.stringify(responseData),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Failed to create memory - unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create memory",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : void 0
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
