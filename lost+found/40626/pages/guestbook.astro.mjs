globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_EdVLS0R4.mjs';
import { $ as $$Main, N as NavigationWrapper, F as Footer } from '../chunks/Footer_CYuzPxpS.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_NX0WvgIw.mjs';

const $$Guestbook = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "NavigationWrapper", NavigationWrapper, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/NavigationWrapper", "client:component-export": "NavigationWrapper" })} ${renderComponent($$result2, "GuestBook", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/GuestBook", "client:component-export": "GuestBook" })} ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/site-components/Footer", "client:component-export": "Footer" })} ` })}`;
}, "/app/src/pages/guestbook.astro", void 0);

const $$file = "/app/src/pages/guestbook.astro";
const $$url = "/guestbook";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Guestbook,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
