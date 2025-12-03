globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_1Hg5a3QD.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D4eWfoLR.mjs';
import { manifest } from './manifest_Qf333omY.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/guestbook.astro.mjs');
const _page2 = () => import('./pages/api/media/_---key_.astro.mjs');
const _page3 = () => import('./pages/api/memories/_memoryid_/like.astro.mjs');
const _page4 = () => import('./pages/api/memories.astro.mjs');
const _page5 = () => import('./pages/api/upload.astro.mjs');
const _page6 = () => import('./pages/embed.astro.mjs');
const _page7 = () => import('./pages/guestbook.astro.mjs');
const _page8 = () => import('./pages/memory-wall-embed.astro.mjs');
const _page9 = () => import('./pages/stories-embed.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/api/guestbook/index.ts", _page1],
    ["src/pages/api/media/[...key].ts", _page2],
    ["src/pages/api/memories/[memoryId]/like.ts", _page3],
    ["src/pages/api/memories/index.ts", _page4],
    ["src/pages/api/upload.ts", _page5],
    ["src/pages/embed.astro", _page6],
    ["src/pages/guestbook.astro", _page7],
    ["src/pages/memory-wall-embed.astro", _page8],
    ["src/pages/stories-embed.astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
