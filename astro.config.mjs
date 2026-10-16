// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://wildfireleadership.com',
  // /invest-marriage only redirects to the INVEST site, so keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/invest-marriage/') })],
  vite: {
    plugins: [tailwindcss()]
  }
});
