const cheerio = require('cheerio'), fs = require('fs');
const files = process.argv.slice(2);
const unhandled = {};
for (const f of files) {
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  $('.post-content').children().each((_, el) => {
    const cls = $(el).attr('class') || '';
    if (cls.includes('post-cta-box')) return;
    if (['p','h2','h3','ul','ol','blockquote'].includes(el.name)) return;
    const k = el.name + (cls ? '.' + cls : '');
    unhandled[k] = unhandled[k] || { count: 0, sample: '', file: f };
    unhandled[k].count++;
    if (!unhandled[k].sample) unhandled[k].sample = $(el).text().replace(/\s+/g,' ').trim().slice(0,200);
  });
}
console.log(JSON.stringify(unhandled, null, 2));
