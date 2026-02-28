import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://neustudio.es',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwindcss(), sitemap(), react(), keystatic()],
});
