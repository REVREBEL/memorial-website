globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const prerender = false;
const GET = async ({ params, request, locals }) => {
  const requestUrl = request.url;
  console.log("=== MEDIA REQUEST START ===");
  console.log("Full URL:", requestUrl);
  console.log("Params:", params);
  try {
    let key = params.key;
    if (!key) {
      const url = new URL(request.url);
      const pathMatch = url.pathname.match(/\/api\/media\/(.+)$/);
      key = pathMatch ? pathMatch[1] : "";
    }
    console.log("Extracted key:", key);
    if (!key) {
      console.error("❌ No key provided in request");
      return new Response("Key is required", { status: 400 });
    }
    console.log("🔍 Fetching media from R2 with key:", key);
    const bucket = locals.runtime.env.MEDIA_BUCKET;
    if (!bucket) {
      console.error("❌ MEDIA_BUCKET not found in environment");
      return new Response("Storage not configured", { status: 500 });
    }
    const object = await bucket.get(key);
    if (!object) {
      console.error("❌ Media not found in R2:", key);
      try {
        const list = await bucket.list({ prefix: "photos/", limit: 20 });
        console.log("📁 Available objects in bucket:", list.objects.map((o) => ({ key: o.key, size: o.size })));
      } catch (e) {
        console.error("Failed to list bucket:", e);
      }
      return new Response("Media not found", { status: 404 });
    }
    console.log("✅ Media found in R2:", key);
    console.log("  Size:", object.size);
    console.log("  Type:", object.httpMetadata?.contentType);
    const arrayBuffer = await object.arrayBuffer();
    const headers = {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "ETag": object.httpEtag,
      "Cache-Control": "public, max-age=31536000, immutable"
    };
    if (object.httpMetadata?.contentEncoding) {
      headers["Content-Encoding"] = object.httpMetadata.contentEncoding;
    }
    console.log("=== MEDIA REQUEST SUCCESS ===");
    return new Response(arrayBuffer, { headers });
  } catch (error) {
    console.error("❌ Failed to fetch media:", error);
    console.error("Error details:", error instanceof Error ? error.stack : String(error));
    return new Response(`Failed to fetch media: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
