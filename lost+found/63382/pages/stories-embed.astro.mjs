globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderHead, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_C6yUJjNp.mjs';
import { S as StoriesSection } from '../chunks/StoriesSection_CUgiJqvy.mjs';
/* empty css                                     */
/* empty css                                     */
/* empty css                                         */
export { r as renderers } from '../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const $$StoriesEmbed = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-p5huquit> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Stories</title>${renderHead()}</head> <body class="__DARK_MODE_CLASS__" data-astro-cid-p5huquit> ${renderComponent($$result, "StoriesSection", StoriesSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/StoriesSection", "client:component-export": "StoriesSection", "data-astro-cid-p5huquit": true })} </body></html>`;
}, "/app/src/pages/stories-embed.astro", void 0);

const $$file = "/app/src/pages/stories-embed.astro";
const $$url = "/memory-journal/stories-embed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$StoriesEmbed,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
