globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderHead, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_C6yUJjNp.mjs';
/* empty css                                     */
/* empty css                                     */
/* empty css                                             */
export { r as renderers } from '../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const $$MemoryWallEmbed = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-chwnt2e5> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Memory Wall</title>${renderHead()}</head> <body class="__DARK_MODE_CLASS__" data-astro-cid-chwnt2e5> ${renderComponent($$result, "MemoryWall", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-chwnt2e5": true, "client:component-path": "/app/src/components/MemoryWall", "client:component-export": "MemoryWall" })} </body></html>`;
}, "/app/src/pages/memory-wall-embed.astro", void 0);

const $$file = "/app/src/pages/memory-wall-embed.astro";
const $$url = "/memory-journal/memory-wall-embed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MemoryWallEmbed,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
