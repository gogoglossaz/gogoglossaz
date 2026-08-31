import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gogoglossaz.com',
  output: 'static',
  build: {
    // Emit /blog/slug/index.html rather than /blog/slug.html so existing URLs
    // (with trailing slash) stay byte-for-byte identical.
    format: 'directory',
  },
  trailingSlash: 'always',
});
