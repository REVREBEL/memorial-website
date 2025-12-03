import TurndownService from "turndown";

/**
 * Merges HTML attributes into an HTML string
 * @param html - The HTML string to merge attributes into
 * @param attributes - Key-value pairs of attributes to add
 * @returns HTML string with attributes merged before the first closing bracket
 */
export const mergeAttributes = (
  html: string,
  attributes: Record<string, any> = {}
): string => {
  if (!Object.keys(attributes).length || !html) return html;
  const firstTagEnd = html.indexOf(">");
  if (firstTagEnd === -1) return html;
  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return (
    html.slice(0, firstTagEnd) +
    " " +
    attributesString +
    html.slice(firstTagEnd)
  );
};

/**
 * Creates a configured TurndownService instance with custom rules
 */
export const createMarkdownConverter = () => {
  console.log("Creating markdown converter");
  const turndownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  console.log("Configuring markdown rules");

  // Basic element rules
  turndownService.addRule("headings", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content: string, node: Node): string => {
      if (!node || !("nodeName" in node)) return content;
      const level = node.nodeName.charAt(1);
      return `${"#".repeat(parseInt(level))} ${content.trim()}\n\n`;
    },
  });

  turndownService.addRule("paragraphs", {
    filter: ["p", "div"],
    replacement: (content: string): string => {
      return content.trim() ? `${content.trim()}\n\n` : "";
    },
  });

  turndownService.addRule("lists", {
    filter: ["ul", "ol"],
    replacement: (content: string): string => {
      return `\n${content.trim()}\n\n`;
    },
  });

  turndownService.addRule("listItems", {
    filter: "li",
    replacement: (content: string): string => {
      return `- ${content.trim()}\n`;
    },
  });

  // Navigation elements
  turndownService.addRule("skipNav", {
    filter: ["nav", "header"],
    replacement: () => "",
  });

  turndownService.addRule("skipNavClasses", {
    filter: (node: Node) => {
      if (!node || !("className" in node)) return false;
      const classNames = (node as any).className?.toLowerCase?.() || "";
      return (
        classNames.includes("nav") ||
        classNames.includes("navigation") ||
        classNames.includes("w-nav")
      );
    },
    replacement: () => "",
  });

  // Footer elements
  turndownService.addRule("skipFooter", {
    filter: "footer",
    replacement: () => "",
  });

  turndownService.addRule("skipFooterClasses", {
    filter: (node: Node) => {
      if (!node || !("className" in node)) return false;
      const classNames = (node as any).className?.toLowerCase?.() || "";
      return classNames.includes("footer");
    },
    replacement: () => "",
  });

  // Links
  turndownService.addRule("links", {
    filter: "a",
    replacement: (content: string, node: Node): string => {
      if (!node || !("getAttribute" in node)) return content;
      const href = (node as any).getAttribute?.("href") || "#";
      return `[${content.trim()}](${href})`;
    },
  });

  // Remove duplicate content
  turndownService.addRule("removeDuplicates", {
    filter: (node: Node): boolean => {
      if (!node || !("textContent" in node) || !("parentNode" in node))
        return false;
      const content = node.textContent;
      const parent = node.parentNode;
      if (parent && content) {
        const siblings = Array.from(parent.childNodes);
        const duplicateIndex = siblings.findIndex(
          (sibling) => sibling !== node && sibling.textContent === content
        );
        return duplicateIndex !== -1;
      }
      return false;
    },
    replacement: (): string => "",
  });

  return turndownService;
};
