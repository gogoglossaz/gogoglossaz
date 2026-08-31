const cheerio = require('cheerio'), fs = require('fs');
function words(f, sel) {
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  const a = $(sel).clone(); a.find('.post-cta-box').remove();
  return a.text().replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
}
const slug = process.argv[2];
const A = words(`blog/${slug}/index.html`, '.post-content');
const B = words(`dist/blog/${slug}/index.html`, '.post-content');
const setB = new Set(B);
const missing = A.filter(w => !setB.has(w));
console.log('orig', A.length, 'new', B.length);
console.log('tokens in orig not in new:', [...new Set(missing)].slice(0, 40).join(' | '));
