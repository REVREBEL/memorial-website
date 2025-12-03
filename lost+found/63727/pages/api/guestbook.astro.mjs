globalThis.process ??= {}; globalThis.process.env ??= {};
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
    const KV = locals.runtime?.env?.KV;
    if (!KV) {
      return new Response(
        JSON.stringify({ error: "KV not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    const list = await KV.list({ prefix: "guestbook:" });
    const entries = await Promise.all(
      list.keys.map(async (key) => {
        const value = await KV.get(key.name);
        return value ? JSON.parse(value) : null;
      })
    );
    const validEntries = entries.filter((entry) => entry !== null).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return new Response(JSON.stringify(validEntries), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch entries",
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
  try {
    const KV = locals.runtime?.env?.KV;
    if (!KV) {
      return new Response(
        JSON.stringify({ error: "KV not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    const body = await request.json();
    const { name, location, relationship, firstMet, message, email } = body;
    if (!name || !location || !relationship || !firstMet || !message || !email) {
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
    const id = crypto.randomUUID();
    const entry = {
      id,
      name,
      location,
      relationship,
      firstMet,
      message,
      email,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await KV.put(`guestbook:${id}`, JSON.stringify(entry));
    return new Response(JSON.stringify(entry), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Failed to create guestbook entry:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create entry",
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
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
