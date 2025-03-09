// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';


import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  site: "https://alvaroluquecu.com",
  integrations: [sitemap()],
  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public", optional: false }),
    }
  }

});