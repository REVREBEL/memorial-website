/**
 * For more details on how to configure Wrangler, refer to:
 * https://developers.cloudflare.com/workers/wrangler/configuration/
 */
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"name": "memory-wall-db",
	"main": "./dist/_worker.js/index.js",
	"compatibility_date": "2025-11-21",
	"compatibility_flags": [
		"nodejs_compat",
		"global_fetch_strictly_public"
	],
	"assets": {
		"binding": "ASSETS",
		"directory": "./dist"
	},
	"observability": {
		"enabled": true
	},
	{
	"d1_databases": [
		{
			"binding": "memory_wall_db",
			"database_name": "memory-wall-db",
			"database_id": "f8b28d77-21c0-4379-8e0a-6443142fc978"
		},
		{
			"binding": "memory_wall_db",
			"database_name": "memory-wall-db",
			"database_id": "ef51dd7c-c700-4fb0-a3fd-29193928ad4e",
			"remote": true
		}
	]
}
	/**
	 * Smart Placement
	 * Docs: https://developers.cloudflare.com/workers/configuration/smart-placement/#smart-placement
	 */
	// "placement": { "mode": "smart" }
	/**
	 * Bindings
	 * Bindings allow your Worker to interact with resources on the Cloudflare Developer Platform, including
	 * databases, object storage, AI inference, real-time communication and more.
	 * https://developers.cloudflare.com/workers/runtime-apis/bindings/
	 */
	/**
	 * Environment Variables
	 * https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables
	 */
	// "vars": { "MY_VARIABLE": "production_value" }
	/**
	 * Note: Use secrets to store sensitive data.
	 * https://developers.cloudflare.com/workers/configuration/secrets/
	 */
	/**
	 * Static Assets
	 * https://developers.cloudflare.com/workers/static-assets/binding/
	 */
	// "assets": { "directory": "./public/", "binding": "ASSETS" }
	/**
	 * Service Bindings (communicate between multiple Workers)
	 * https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings
	 */
	// "services": [{ "binding": "MY_SERVICE", "service": "my-service" }]
}