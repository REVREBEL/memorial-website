globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, l as likesTable, s as sql, m as memoriesTable, e as eq } from '../../../../chunks/getDb_DiPBwBUr.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const prerender = false;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};
const POST = async ({ params, locals }) => {
  const { memoryId } = params;
  if (!memoryId) {
    return new Response(
      JSON.stringify({ error: "Memory ID is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
  try {
    const db = getDb(locals);
    await db.insert(likesTable).values({
      memoryId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const [updatedMemory] = await db.select({
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
      likes: sql`COALESCE((SELECT COUNT(*) FROM ${likesTable} WHERE memory_id = ${memoriesTable.id}), 0)`
    }).from(memoriesTable).where(eq(memoriesTable.id, memoryId));
    if (!updatedMemory) {
      return new Response(
        JSON.stringify({ error: "Memory not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    const response = {
      ...updatedMemory,
      tags: JSON.parse(updatedMemory.tags),
      likes: Number(updatedMemory.likes) || 0
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Failed to like memory:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to like memory",
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
