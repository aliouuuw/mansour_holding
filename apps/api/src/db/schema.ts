// Re-export all schemas from the local consolidated schema file
// Using local file instead of @mansour/database workspace package to avoid
// build-time resolution issues with Cloudflare Workers bundler
export * from './schema-for-migrations'
