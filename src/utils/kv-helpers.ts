import type { APIContext } from "astro";
import type { MinimalKV } from "../types";

export const config = {
  runtime: "edge",
};

const llmsKey = "llms.txt";

export const getKVContent = async (
  context: APIContext,
  key: string,
  defaultValue: any = null
) => {
  try {
    // Use KV from Cloudflare Worker env
    const kv = (context.locals as any).runtime.env.WEBFLOW_CONTENT;
    if (import.meta.env.DEV)
      console.log("[KV Debug] Attempting to get content:", {
        key,
        hasContext: !!context,
        hasLocals: !!context?.locals,
        hasWebflowContent: !!kv,
        webflowContentType: kv ? typeof kv : "undefined",
        webflowContentMethods: kv ? Object.keys(kv) : [],
      });

    const content = await kv.get(key);

    if (import.meta.env.DEV)
      console.log("[KV Debug] Get result:", {
        key,
        hasContent: !!content,
        contentType: typeof content,
      });

    return content ?? defaultValue;
  } catch (error) {
    if (import.meta.env.DEV)
      console.error("[KV Debug] Error getting content:", {
        key,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
    return defaultValue;
  }
};

/**
 * Helper function to update a section in llms.txt while preserving other sections
 */
export async function updateLLMSSection(
  kv: MinimalKV,
  sectionTitle: string,
  sectionContent: string[]
): Promise<void> {
  // Get existing content
  const existingContent = (await kv.get(llmsKey)) || "";
  const lines = existingContent.split("\n");

  // Find section boundaries
  let sectionStart = -1;
  let sectionEnd = -1;
  let nextSectionStart = -1;

  // Find the target section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === `## ${sectionTitle}`) {
      sectionStart = i;
    } else if (
      sectionStart !== -1 &&
      line.startsWith("## ") &&
      i > sectionStart
    ) {
      nextSectionStart = i;
      sectionEnd = i - 1;
      break;
    }
  }

  // If section not found, append it
  if (sectionStart === -1) {
    const newContent = [
      ...lines,
      lines.length > 0 ? "" : "", // Add extra newline if content exists
      `## ${sectionTitle}`,
      "",
      ...sectionContent,
    ].join("\n");
    await kv.put(llmsKey, newContent);
    return;
  }

  // If no next section found, section extends to end
  if (nextSectionStart === -1) {
    sectionEnd = lines.length;
  }

  // Replace section content
  const newLines = [
    ...lines.slice(0, sectionStart + 1),
    "",
    ...sectionContent,
    "",
    ...lines.slice(nextSectionStart !== -1 ? nextSectionStart : lines.length),
  ];

  // Clean up multiple blank lines
  const cleanedLines = newLines.reduce((acc: string[], line: string) => {
    if (acc.length === 0 || !(line === "" && acc[acc.length - 1] === "")) {
      acc.push(line);
    }
    return acc;
  }, []);

  await kv.put(llmsKey, cleanedLines.join("\n"));
}

/**
 * Utility to clear all keys from a MinimalKV instance (mock or real)
 */
export async function clearAllKV(kv: MinimalKV): Promise<void> {
  if (typeof (kv as any).clear === "function") {
    // Use the fast clear if available (MockKVNamespace)
    await (kv as any).clear();
    return;
  }
  // Otherwise, list and delete all keys (for real KV)
  const listResult = await kv.list();
  for (const { name } of listResult.keys) {
    await kv.delete(name);
  }
}
