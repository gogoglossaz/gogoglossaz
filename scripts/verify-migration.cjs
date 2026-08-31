/**
 * Verifies the Sanity-rendered blog output matches the original static HTML.
 * Originals are read from git (they were removed from the working tree when
 * the blog moved into the CMS).
 *
 *   node scripts/verify-migration.cjs [git-ref]      default ref: the pre-CMS commit
 */
const cheerio = require('cheerio');
const fs = require('fs');
const { execSync } = require('child_process');

const REF = process.argv[2] || 'f63e273';

function textWords(html) {
  const $ = cheerio.load(html);
  const a = $('.post-content').clone();
  a.find('.post-cta-box').remove();
  // space every tag boundary so block elements don't fuse into one token
  const spaced = a.html().replace(/></g, '> <');
  return cheerio.load(spaced).root().text().replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
}

const slugs = execSync(`git ls-tree --name-only -d ${REF}:blog`, { encoding: 'utf8' })
  .split('\n').map((s) => s.replace(/\/$/, '')).filter(Boolean);

let bad = 0, checked = 0;
for (const slug of slugs) {
  const outFile = `dist/blog/${slug}/index.html`;
  if (!fs.existsSync(outFile)) { console.log(`MISSING OUTPUT: ${slug}`); bad++; continue; }
  let orig;
  try { orig = execSync(`git show ${REF}:blog/${slug}/index.html`, { encoding: 'utf8', maxBuffer: 1 << 24 }); }
  catch { console.log(`NO ORIGINAL: ${slug}`); bad++; continue; }

  const A = textWords(orig);
  const B = textWords(fs.readFileSync(outFile, 'utf8'));
  const setB = new Set(B);
  const missing = [...new Set(A.filter((w) => !setB.has(w)))];

  // head-level SEO fields must match exactly
  const $o = cheerio.load(orig), $n = cheerio.load(fs.readFileSync(outFile, 'utf8'));
  const fields = ['title', 'description', 'canonical'];
  const got = {
    orig: [$o('title').text(), $o('meta[name="description"]').attr('content'), $o('link[rel="canonical"]').attr('href')],
    new: [$n('title').text(), $n('meta[name="description"]').attr('content'), $n('link[rel="canonical"]').attr('href')],
  };
  const seoMismatch = fields.filter((_, i) => got.orig[i] !== got.new[i]);

  if (missing.length || seoMismatch.length) {
    bad++;
    console.log(`${slug}: ${missing.length} missing words${seoMismatch.length ? ` | SEO mismatch: ${seoMismatch.join(', ')}` : ''}`);
    if (missing.length) console.log('   ', missing.slice(0, 10).join(' | '));
  }
  checked++;
}
console.log(bad === 0
  ? `\n✓ ${checked} posts verified — article text and title/description/canonical all match the originals.`
  : `\n✗ ${bad} post(s) differ.`);
