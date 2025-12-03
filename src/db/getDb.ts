import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// For dynamic routes
export const getDb = (locals: App.Locals) => {
  // Access the Cloudflare D1 binding from runtime environment
  const env = locals?.runtime?.env;
  
  if (!env?.DB) {
    throw new Error(
      'DB binding not found. Make sure:\n' +
      '1. wrangler.jsonc has the DB binding configured\n' +
      '2. platformProxy.enabled is set to true in astro.config.mjs\n' +
      '3. You have restarted the dev server after making config changes'
    );
  }
  
  return drizzle(env.DB, { schema });
};

// For static routes
export const getDbAsync = async (locals: App.Locals) => {
  return getDb(locals);
};
