/**
 * One-time migration: existing static blog HTML -> Sanity blogPost documents.
 *
 *   node scripts/migrate-blog.mjs            # writes migration/blog.ndjson
 *   node scripts/migrate-blog.mjs --import   # also uploads to Sanity
 *
 * Needs PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env for --import.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as cheerio from 'cheerio';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'blog');
const OUT_DIR = path.join(ROOT, 'migration');
const OUT_FILE = path.join(OUT_DIR, 'blog.ndjson');

/**
 * The original posts were removed from the working tree when the blog moved
 * into Sanity, so read them from git unless they are still on disk.
 */
const REF = process.env.PRE_CMS_REF || 'f63e273';
const FROM_DISK = fs.existsSync(BLOG_DIR);

function listSlugs() {
  if (FROM_DISK) {
    return fs.readdirSync(BLOG_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && fs.existsSync(path.join(BLOG_DIR, d.name, 'index.html')))
      .map((d) => d.name).sort();
  }
  return execSync(`git ls-tree --name-only -d ${REF}:blog`, { encoding: 'utf8' })
    .split('\n').map((x) => x.replace(/\/$/, '')).filter(Boolean).sort();
}

function readBlogFile(rel) {
  if (FROM_DISK) return fs.readFileSync(path.join(BLOG_DIR, rel), 'utf8');
  return execSync(`git show ${REF}:blog/${rel}`, { encoding: 'utf8', maxBuffer: 1 << 24 });
}

// Deterministic keys: the same source HTML always yields the same document,
// so re-running the migration is a true no-op instead of churning every key.
let keySeq = 0;
let keyScope = 'x';
const setKeyScope = (slug) => { keyScope = slug; keySeq = 0; };
const key = () => `${keyScope}-${(keySeq++).toString(36)}`;

/** Inline nodes -> portable text spans + markDefs */
function inlineToSpans($, el) {
  const spans = [];
  const markDefs = [];

  const walk = (node, marks) => {
    $(node).contents().each((_, child) => {
      if (child.type === 'text') {
        const text = child.data.replace(/\s+/g, ' ');
        if (text) spans.push({ _type: 'span', _key: key(), text, marks: [...marks] });
        return;
      }
      if (child.type !== 'tag') return;
      const tag = child.name.toLowerCase();
      if (tag === 'strong' || tag === 'b') return walk(child, [...marks, 'strong']);
      if (tag === 'em' || tag === 'i') return walk(child, [...marks, 'em']);
      if (tag === 'br') { spans.push({ _type: 'span', _key: key(), text: '\n', marks: [] }); return; }
      if (tag === 'a') {
        const href = $(child).attr('href');
        if (!href) return walk(child, marks);
        const defKey = key();
        markDefs.push({ _key: defKey, _type: 'link', href: normalizeHref(href) });
        return walk(child, [...marks, defKey]);
      }
      walk(child, marks);
    });
  };

  walk(el, []);
  return { spans, markDefs };
}

/** ../../paver-sealing/ -> /paver-sealing/  (absolute paths survive any URL depth) */
function normalizeHref(href) {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  return '/' + href.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
}

function block(style, { spans, markDefs }, extra = {}) {
  return { _type: 'block', _key: key(), style, markDefs, children: spans, ...extra };
}

function htmlToPortableText($, $article) {
  const blocks = [];
  $article.children().each((_, el) => {
    const tag = el.name?.toLowerCase();
    const $el = $(el);
    if ($el.hasClass('post-cta-box')) return; // template renders this, not content

    if (tag === 'p') {
      const parts = inlineToSpans($, el);
      if (parts.spans.some((s) => s.text.trim())) blocks.push(block('normal', parts));
    } else if (tag === 'h2' || tag === 'h3') {
      blocks.push(block(tag, inlineToSpans($, el)));
    } else if (tag === 'ul' || tag === 'ol') {
      const listItem = tag === 'ul' ? 'bullet' : 'number';
      $el.children('li').each((__, li) => {
        blocks.push(block('normal', inlineToSpans($, li), { listItem, level: 1 }));
      });
    } else if (tag === 'table' || $el.find('table').length) {
      const $t = tag === 'table' ? $el : $el.find('table').first();
      const headers = $t.find('thead th').map((__, th) => $(th).text().trim()).get();
      const rows = $t.find('tbody tr').map((__, tr) => ({
        _key: key(),
        _type: 'row',
        cells: $(tr).find('td').map((___, td) => $(td).text().trim()).get(),
      })).get();
      if (headers.length || rows.length) {
        blocks.push({ _type: 'comparisonTable', _key: key(), headers, rows });
      }
    } else if (tag === 'blockquote') {
      blocks.push(block('blockquote', inlineToSpans($, el)));
    }
  });
  return blocks;
}

// ── Read card metadata (emoji + excerpt) off the existing listing page ────────
function readCards() {
  let raw;
  try { raw = readBlogFile('index.html'); } catch { return {}; }
  const $ = cheerio.load(raw);
  const cards = {};
  $('.blog-card').each((_, el) => {
    const $c = $(el);
    const href = ($c.attr('href') || '').replace(/^\.\//, '').replace(/\/$/, '');
    const slug = href.split('/').filter(Boolean).pop();
    if (!slug) return;
    cards[slug] = {
      emoji: $c.find('.blog-card-img').text().trim(),
      excerpt: $c.find('.blog-card-body p').first().text().trim(),
    };
  });
  return cards;
}

function parsePost(slug, cards) {
  setKeyScope(slug);
  const $ = cheerio.load(readBlogFile(`${slug}/index.html`));

  const title = $('.post-hero h1').first().text().trim() ||
                $('title').text().replace(/\s*\|\s*Go Go Gloss\s*$/, '').trim();
  const description = $('meta[name="description"]').attr('content') || '';

  const tagClass = $('.post-tag').attr('class') || '';
  const category = /post-tag--epoxy/.test(tagClass) ? 'epoxy' : 'paver';

  let publishedAt = null;
  const ld = $('script[type="application/ld+json"]').first().html();
  if (ld) {
    try { publishedAt = JSON.parse(ld).datePublished || null; } catch {}
  }
  if (!publishedAt) publishedAt = '2025-07-01';

  const metaText = $('.post-hero-meta').text();
  const readTime = (metaText.match(/(\d+\s*min read)/i) || [null, '5 min read'])[1];

  const $article = $('.post-content').first();
  const body = htmlToPortableText($, $article);

  const card = cards[slug] || {};

  return {
    _id: `blogPost-${slug}`,
    _type: 'blogPost',
    title,
    slug: { _type: 'slug', current: slug },
    description,
    category,
    publishedAt: new Date(`${publishedAt}T09:00:00Z`).toISOString(),
    readTime,
    emoji: card.emoji || (category === 'epoxy' ? '✨' : '🧱'),
    excerpt: card.excerpt || description,
    body,
  };
}

// ── Run ──────────────────────────────────────────────────────────────────────
const cards = readCards();
const slugs = listSlugs();
console.log(`Reading originals from ${FROM_DISK ? 'the working tree' : `git (${REF})`}`);

const docs = [];
const problems = [];
for (const slug of slugs) {
  try {
    const doc = parsePost(slug, cards);
    if (!doc.body.length) problems.push(`${slug}: empty body`);
    if (!doc.description) problems.push(`${slug}: missing meta description`);
    if (!doc.excerpt) problems.push(`${slug}: missing excerpt`);
    docs.push(doc);
  } catch (e) {
    problems.push(`${slug}: FAILED — ${e.message}`);
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');

console.log(`Parsed ${docs.length} posts -> ${path.relative(ROOT, OUT_FILE)}`);
const wc = docs.map((d) => ({
  slug: d.slug.current,
  blocks: d.body.length,
  words: d.body.flatMap((b) => (b.children || []).map((c) => c.text)).join(' ').split(/\s+/).filter(Boolean).length,
}));
console.table(wc);
if (problems.length) {
  console.log('\nWarnings:');
  problems.forEach((p) => console.log('  - ' + p));
}

if (process.argv.includes('--import')) {
  const { createClient } = await import('@sanity/client');
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) {
    console.error('\nSet PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN before --import.');
    process.exit(1);
  }
  const client = createClient({
    projectId,
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });
  let tx = client.transaction();
  docs.forEach((d) => { tx = tx.createOrReplace(d); });
  await tx.commit();
  console.log(`\nImported ${docs.length} posts into Sanity.`);
}
