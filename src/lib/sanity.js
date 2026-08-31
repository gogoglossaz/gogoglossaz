import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Set SANITY_FIXTURES=1 to build from migration/blog.ndjson instead of the live
 * dataset. Used to verify the build before the Sanity project exists, and to
 * work offline. Never set it in Netlify.
 */
const USE_FIXTURES = process.env.SANITY_FIXTURES === '1';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

if (!projectId && !USE_FIXTURES) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env and fill it in, ' +
    'or set it in Netlify under Site settings > Environment variables.'
  );
}

export const sanity = USE_FIXTURES
  ? null
  : createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false });

const builder = sanity ? imageUrlBuilder(sanity) : null;
export const urlFor = (source) =>
  builder ? builder.image(source) : { width: () => ({ auto: () => ({ url: () => '' }) }) };

export const CATEGORY_LABELS = { paver: 'Paver Sealing', epoxy: 'Epoxy Coatings' };

let fixtureCache = null;
function fixturePosts() {
  if (fixtureCache) return fixtureCache;
  const file = path.join(process.cwd(), 'migration', 'blog.ndjson');
  if (!fs.existsSync(file)) return (fixtureCache = []);
  fixtureCache = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const d = JSON.parse(line);
      return { ...d, slug: d.slug.current };
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return fixtureCache;
}

export async function getPosts() {
  if (USE_FIXTURES) return fixturePosts();
  return sanity.fetch(`*[_type == "blogPost" && defined(slug.current)]
    | order(publishedAt desc){
      title, "slug": slug.current, description, category,
      publishedAt, readTime, emoji, excerpt
    }`);
}

export async function getPost(slug) {
  if (USE_FIXTURES) return fixturePosts().find((p) => p.slug === slug) || null;
  return sanity.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{
      title, "slug": slug.current, description, category,
      publishedAt, readTime, emoji, excerpt, body
    }`,
    { slug }
  );
}

export async function getGallery() {
  if (USE_FIXTURES) return [];
  return sanity.fetch(`*[_type == "galleryItem"] | order(order asc, _createdAt desc){
    title, category, location, caption, featured, beforeImage, afterImage
  }`);
}

export async function getHomepage() {
  if (USE_FIXTURES) return {};
  return (await sanity.fetch(`*[_type == "homepage"][0]`)) || {};
}

export async function getSettings() {
  const s = USE_FIXTURES ? null : await sanity.fetch(`*[_type == "siteSettings"][0]`);
  return {
    phoneDisplay: '(623) 210-3418',
    phoneRaw: '6232103418',
    email: 'info@gogoglossaz.com',
    copyright: '© 2025 Go Go Gloss',
    serviceAreas: ['Scottsdale','Phoenix','Glendale','Peoria','Surprise','Tempe','Chandler','Gilbert','Mesa'],
    ...(s || {}),
  };
}
