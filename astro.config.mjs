import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ¿Hay al menos un artículo de blog publicado (sin `draft: true`)?
// Si no, /blog/ queda fuera del sitemap (la página se marca noindex por su cuenta).
const blogDir = new URL('./src/content/blog/', import.meta.url);
const hasPublishedPosts =
  fs.existsSync(blogDir) &&
  fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .some((f) => {
      const frontmatter = fs.readFileSync(new URL(f, blogDir), 'utf8').split(/^---\s*$/m)[1] ?? '';
      return !/^draft:\s*true\s*$/m.test(frontmatter);
    });

export default defineConfig({
  site: 'https://devcorp-ec.com',
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        // Panel de contenido y portal de clientes (aún sin backend): no van a Google.
        // Cuando el portal esté operativo, quitar login|registro de esta lista
        // y poner SITE.portalEnabled = true en src/data/site.ts.
        if (/^\/(admin|login|registro)\/?$/.test(pathname)) return false;
        if (pathname === '/404/') return false;
        if (pathname === '/blog/' && !hasPublishedPosts) return false;
        return true;
      },
    }),
  ],
});
