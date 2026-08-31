/**
 * One-time migration: the original static gallery -> Sanity galleryItem docs.
 * Uploads each distinct image once and reuses the asset across pairs.
 *
 *   node --env-file=.env scripts/migrate-gallery.mjs --import
 *
 * Needs PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as cheerio from 'cheerio';
import { createClient } from '@sanity/client';

const REF = process.env.PRE_CMS_REF || 'f63e273';
const ASSETS = path.join(process.cwd(), 'public', 'assets');

const html = execSync(`git show ${REF}:gallery/index.html`, { encoding: 'utf8', maxBuffer: 1 << 24 });
const $ = cheerio.load(html);

const items = [];
$('.photo-item').each((i, el) => {
  const $i = $(el);
  const imgs = $i.find('img');
  const file = (src) => path.basename(src || '');
  items.push({
    index: i,
    category: $i.attr('data-category') === 'epoxy' ? 'epoxy' : 'paver',
    before: { file: file($(imgs[0]).attr('src')), alt: $(imgs[0]).attr('alt') || '' },
    after: { file: file($(imgs[1]).attr('src')), alt: $(imgs[1]).attr('alt') || '' },
  });
});

console.log(`Found ${items.length} gallery pairs.`);
const unique = [...new Set(items.flatMap((i) => [i.before.file, i.after.file]))];
console.log(`Distinct images to upload: ${unique.length}`);
unique.forEach((f) => {
  const ok = fs.existsSync(path.join(ASSETS, f));
  if (!ok) console.log(`  MISSING on disk: ${f}`);
});

if (!process.argv.includes('--import')) {
  console.log('\nDry run. Re-run with --import to upload.');
  process.exit(0);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('Set PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN first.');
  process.exit(1);
}
const client = createClient({
  projectId,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const assetIds = {};
for (const file of unique) {
  const p = path.join(ASSETS, file);
  if (!fs.existsSync(p)) continue;
  const asset = await client.assets.upload('image', fs.createReadStream(p), { filename: file });
  assetIds[file] = asset._id;
  console.log(`uploaded ${file} -> ${asset._id}`);
}

const imgRef = (f, alt) =>
  assetIds[f] ? { _type: 'image', asset: { _type: 'reference', _ref: assetIds[f] }, alt } : undefined;

let tx = client.transaction();
items.forEach((it) => {
  tx = tx.createOrReplace({
    _id: `galleryItem-${it.index}`,
    _type: 'galleryItem',
    title: it.after.alt.split('—')[0].trim() || `Project ${it.index + 1}`,
    category: it.category,
    beforeImage: imgRef(it.before.file, it.before.alt),
    afterImage: imgRef(it.after.file, it.after.alt),
    order: (it.index + 1) * 10,
    featured: it.index < 3,
  });
});
await tx.commit();
console.log(`\nImported ${items.length} gallery items.`);
