import type { APIRoute } from "astro";
import { clearAllKV } from "../../../utils/kv-helpers";

export const POST: APIRoute = async ({ locals }) => {
  try {
    const webflowContent = (locals as any).webflowContent;
    const exposureSettings = (locals as any).exposureSettings;
    if (!webflowContent || !exposureSettings) {
      return new Response(
        JSON.stringify({ error: "KV namespaces not found in locals" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    await clearAllKV(webflowContent);
    await clearAllKV(exposureSettings);
    return new Response(
      JSON.stringify({ success: true, message: "All KV cleared" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to clear KV",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
