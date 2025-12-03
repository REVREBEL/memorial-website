globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderHead, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_C6yUJjNp.mjs';
/* empty css                                     */
export { r as renderers } from '../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const $$Embed = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Memory Wall Embed</title>${renderHead()}</head> <body style="margin: 0; padding: 0; background: transparent;"> ${renderComponent($$result, "MemoryWall", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/MemoryWall", "client:component-export": "MemoryWall" })} </body></html>`;
}, "/app/src/pages/embed.astro", void 0);

const $$file = "/app/src/pages/embed.astro";
const $$url = "/memory-journal/embed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Embed,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
