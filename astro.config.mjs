import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://neustudio.es',
  output: 'static',
  adapter: cloudflare(),
  integrations: [tailwindcss(), sitemap(), react(), keystatic()],
});
