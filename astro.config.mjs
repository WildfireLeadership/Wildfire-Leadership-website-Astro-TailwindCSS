// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// The live host is www.wildfireleadership.com (the bare domain 308-redirects
// there), so canonicals, the sitemap and JSON-LD all use the www host.
export default defineConfig({
  site: 'https://www.wildfireleadership.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
