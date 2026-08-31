import { STATIC_URLS } from '../data/static-urls.js';
import { getPosts } from '../lib/sanity.js';

export async function GET() {
  const posts = await getPosts();
  const urls = [
    ...STATIC_URLS.map((loc) => ({ loc })),
    { loc: 'https://gogoglossaz.com/blog/' },
    ...posts.map((p) => ({
      loc: `https://gogoglossaz.com/blog/${p.slug}/`,
      lastmod: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : undefined,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ loc, lastmod }) =>
    `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
