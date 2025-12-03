globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, l as likesTable, s as sql, m as memoriesTable, e as eq } from '../../../../chunks/getDb_COEkAWyA.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_NX0WvgIw.mjs';

const prerender = false;
const POST = async ({ params, locals }) => {
  try {
    const { memoryId } = params;
    if (!memoryId) {
      return new Response(
        JSON.stringify({ error: "Memory ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const db = getDb(locals);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await db.insert(likesTable).values({
      memoryId,
      createdAt: now
    });
    const updatedMemory = await db.select({
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
    }).from(memoriesTable).where(eq(memoriesTable.id, memoryId)).limit(1);
    if (!updatedMemory || updatedMemory.length === 0) {
      return new Response(
        JSON.stringify({ error: "Memory not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const formattedMemory = {
      ...updatedMemory[0],
      tags: JSON.parse(updatedMemory[0].tags),
      likes: Number(updatedMemory[0].likes) || 0
    };
    return new Response(
      JSON.stringify(formattedMemory),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to like memory:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to like memory",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
