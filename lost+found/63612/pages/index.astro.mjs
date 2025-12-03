globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_C6yUJjNp.mjs';
import { $ as $$Main, N as NavigationWrapper, F as FooterWrapper } from '../chunks/FooterWrapper_DFEooNEx.mjs';
import { S as StoriesSection } from '../chunks/StoriesSection_BQRROUba.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_1Hg5a3QD.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "NavigationWrapper", NavigationWrapper, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/NavigationWrapper", "client:component-export": "NavigationWrapper" })} ${renderComponent($$result2, "StoriesSection", StoriesSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/StoriesSection", "client:component-export": "StoriesSection" })} ${renderComponent($$result2, "MemoryWall", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/MemoryWall", "client:component-export": "MemoryWall" })} ${renderComponent($$result2, "FooterWrapper", FooterWrapper, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/FooterWrapper", "client:component-export": "FooterWrapper" })} ` })}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "/memory-journal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
