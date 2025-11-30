import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  base: "/",
  output: "server",
  
  adapter: cloudflare({ 
    platformProxy: {
      enabled: true
    },
    imageService: "compile",
    routes: {
      strategy: "auto"
    }
  }),

  integrations: [react()],

  vite: {
    resolve: {
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : undefined,
    },
    ssr: {
      external: [
        "node:buffer", 
        "node:path", 
        "node:fs", 
        "node:os", 
        "node:crypto", 
        "node:async_hooks",
        "node-html-markdown"
      ]
    }
  },

  // Security settings
  security: {
    checkOrigin: false
  }
});
