import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://devcorp-ec.com',
  integrations: [sitemap()],
});
