import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://neustudio.es',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    tailwindcss(),
    sitemap({
      filter: (page) =>
        !page.includes('/keystatic') &&
        !page.includes('/aviso-legal') &&
        !page.includes('/privacidad') &&
        !page.includes('/cookies'),
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize: (item) => {
        if (item.url === 'https://neustudio.es/') {
          item.priority = 1.0;
        } else if (item.url.includes('/contacto') || item.url.includes('/reservar')) {
          item.priority = 0.9;
        } else if (item.url.includes('/artistas/') && item.url !== 'https://neustudio.es/artistas/') {
          item.priority = 0.7;
        } else {
          item.priority = 0.8;
        }
        return item;
      },
    }),
    react(),
    keystatic(),
  ],
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});
