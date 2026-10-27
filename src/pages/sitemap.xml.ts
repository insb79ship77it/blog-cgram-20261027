import type { APIRoute } from 'astro';
import {
  CATEGORIES,
  categorySlug,
  getSortedPosts,
  postUrl,
} from '../utils/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getSortedPosts();
  const abs = (path: string) => new URL(path, site).href;
  const day = (date?: Date) => (date ? date.toISOString().slice(0, 10) : '');

  const categories = [
    ...new Set([
      ...CATEGORIES.map((c) => c.name),
      ...posts.map((p) => p.data.category),
    ]),
  ];

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: abs('/'), lastmod: day(posts[0]?.data.pubDate) },
    ...['/about/', '/contact/', '/privacy/'].map((path) => ({ loc: abs(path) })),
    ...categories.map((name) => ({
      loc: abs(`/category/${categorySlug(name)}/`),
    })),
    ...posts.map((post) => ({
      loc: abs(postUrl(post)),
      lastmod: day(post.data.pubDate),
    })),
  ];

  const body = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
