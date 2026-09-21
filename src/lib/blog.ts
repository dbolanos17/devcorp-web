import { getCollection } from 'astro:content';

/**
 * Artículos publicados del blog (excluye los marcados como borrador).
 * Un artículo con `draft: true` no se genera, no aparece en listados ni en el
 * sitemap. Para publicarlo: quitar `draft` o desmarcar "Borrador" en /admin.
 */
export async function getPublishedPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}
