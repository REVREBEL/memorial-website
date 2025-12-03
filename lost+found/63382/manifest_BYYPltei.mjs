globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as decodeKey } from './chunks/astro/server_C6yUJjNp.mjs';
import './chunks/astro-designed-error-pages_DNI3_57z.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_BHFCnp4B.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///app/","cacheDir":"file:///app/node_modules/.astro/","outDir":"file:///app/dist/","srcDir":"file:///app/src/","publicDir":"file:///app/public/","buildClientDir":"file:///app/dist/memory-journal/","buildServerDir":"file:///app/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/guestbook","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/guestbook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"guestbook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/guestbook/index.ts","pathname":"/api/guestbook","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/media/[...key]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/media(?:\\/(.*?))?\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"...key","dynamic":true,"spread":true}]],"params":["...key"],"component":"src/pages/api/media/[...key].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/memories/[memoryid]/like","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/memories\\/([^/]+?)\\/like\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"memories","dynamic":false,"spread":false}],[{"content":"memoryId","dynamic":true,"spread":false}],[{"content":"like","dynamic":false,"spread":false}]],"params":["memoryId"],"component":"src/pages/api/memories/[memoryId]/like.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/memories","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/memories\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"memories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/memories/index.ts","pathname":"/api/memories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/upload.ts","pathname":"/api/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/memory-journal/_astro/guestbook.CvExq4EY.css"}],"routeData":{"route":"/embed","isIndex":false,"type":"page","pattern":"^\\/embed\\/?$","segments":[[{"content":"embed","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/embed.astro","pathname":"/embed","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/memory-journal/_astro/guestbook.B1kDR7Ty.css"},{"type":"external","src":"/memory-journal/_astro/guestbook.CvExq4EY.css"},{"type":"inline","content":"html.splash main{display:flex!important}html.splash ol,html.splash ul{padding-left:0!important;margin:0!important}\n"}],"routeData":{"route":"/guestbook","isIndex":false,"type":"page","pattern":"^\\/guestbook\\/?$","segments":[[{"content":"guestbook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/guestbook.astro","pathname":"/guestbook","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/memory-journal/_astro/guestbook.B1kDR7Ty.css"},{"type":"external","src":"/memory-journal/_astro/guestbook.CvExq4EY.css"},{"type":"inline","content":"body{margin:0;padding:0;background:var(--background, #F5F1EB)}html,body{height:auto;min-height:100vh}\n"}],"routeData":{"route":"/memory-wall-embed","isIndex":false,"type":"page","pattern":"^\\/memory-wall-embed\\/?$","segments":[[{"content":"memory-wall-embed","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/memory-wall-embed.astro","pathname":"/memory-wall-embed","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/memory-journal/_astro/guestbook.B1kDR7Ty.css"},{"type":"external","src":"/memory-journal/_astro/guestbook.CvExq4EY.css"},{"type":"inline","content":"body{margin:0;padding:0;background:var(--background, #F5F1EB)}html,body{height:auto;min-height:100vh}body>div[data-astro-cid-p5huquit]{padding:2rem 0}\n"}],"routeData":{"route":"/stories-embed","isIndex":false,"type":"page","pattern":"^\\/stories-embed\\/?$","segments":[[{"content":"stories-embed","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/stories-embed.astro","pathname":"/stories-embed","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/memory-journal/_astro/guestbook.B1kDR7Ty.css"},{"type":"external","src":"/memory-journal/_astro/guestbook.CvExq4EY.css"},{"type":"inline","content":"html.splash main{display:flex!important}html.splash ol,html.splash ul{padding-left:0!important;margin:0!important}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/memory-journal","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/app/src/pages/embed.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/memory-wall-embed.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/stories-embed.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/guestbook.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/guestbook/index@_@ts":"pages/api/guestbook.astro.mjs","\u0000@astro-page:src/pages/api/media/[...key]@_@ts":"pages/api/media/_---key_.astro.mjs","\u0000@astro-page:src/pages/api/memories/[memoryId]/like@_@ts":"pages/api/memories/_memoryid_/like.astro.mjs","\u0000@astro-page:src/pages/api/memories/index@_@ts":"pages/api/memories.astro.mjs","\u0000@astro-page:src/pages/api/upload@_@ts":"pages/api/upload.astro.mjs","\u0000@astro-page:src/pages/embed@_@astro":"pages/embed.astro.mjs","\u0000@astro-page:src/pages/guestbook@_@astro":"pages/guestbook.astro.mjs","\u0000@astro-page:src/pages/memory-wall-embed@_@astro":"pages/memory-wall-embed.astro.mjs","\u0000@astro-page:src/pages/stories-embed@_@astro":"pages/stories-embed.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BYYPltei.mjs","/app/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/app/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DNx13Jyz.mjs","/app/src/components/NavigationWrapper":"_astro/NavigationWrapper.BV9iXBKi.js","/app/src/components/FooterWrapper":"_astro/FooterWrapper.l5COcrXK.js","/app/src/components/StoriesSection":"_astro/StoriesSection.Cxwnpuse.js","/app/src/components/GuestBook":"_astro/GuestBook.BZkDknkC.js","/app/src/components/MemoryWall":"_astro/MemoryWall.Du6aN9ou.js","@astrojs/react/client.js":"_astro/client.WsnUez7P.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/memory-journal/_astro/guestbook.B1kDR7Ty.css","/memory-journal/_astro/guestbook.CvExq4EY.css","/memory-journal/favicon.ico","/memory-journal/_astro/BackgroundVideo.Djk_rsrv.js","/memory-journal/_astro/FooterWrapper.l5COcrXK.js","/memory-journal/_astro/GuestBook.BZkDknkC.js","/memory-journal/_astro/MemoryWall.Du6aN9ou.js","/memory-journal/_astro/NavigationWrapper.BV9iXBKi.js","/memory-journal/_astro/StoriesSection.Cxwnpuse.js","/memory-journal/_astro/base-url.BuhEC7Hq.js","/memory-journal/_astro/client.WsnUez7P.js","/memory-journal/_astro/index.0yr9KlQE.js","/memory-journal/_astro/index.ViApDAiE.js","/memory-journal/_astro/jsx-runtime.D_zvdyIk.js","/memory-journal/_astro/map-pin.DNlAivKP.js"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"YdwTr7hrtYBFve9/0+7FIRT7D+yk5lq3x+Jx9SbpeHk=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
