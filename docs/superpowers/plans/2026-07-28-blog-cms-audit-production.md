# Go Go Gloss — Blog, CMS, Audit & Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 30-post SEO blog, Decap CMS admin panel, site-wide audit fixes, production files, and an SEO competitive research report to the existing Go Go Gloss static website.

**Architecture:** Pure static HTML/CSS/JS site deployed to Netlify via GitHub (gogoglossaz/gogoglossaz). No build step. nav.js injects the full navigation site-wide. Blog posts live at `/blog/[slug]/index.html`. Decap CMS uses Netlify Identity + Git Gateway for headless CMS on top of the existing Git repo.

**Tech Stack:** HTML5, CSS3 (custom properties, no framework), vanilla JS, Netlify (hosting + Identity + Git Gateway), Formspree (contact forms), GitHub.

## Global Constraints

- Domain: `https://gogoglossaz.com`
- Phone: `(623) 210-3418`
- Email: `info@gogoglossaz.com`
- Formspree endpoint: `https://formspree.io/f/xrenodyk`
- Brand colors: `--blue: #6BBDE3`, `--navy: #1A2744`, `--cta: #2563EB`
- Font: Inter (Google Fonts)
- All CSS referenced with `?v=1` cache-busting suffix
- Nav is injected by `js/nav.js` — static HTML nav in each file is overridden at runtime
- CSS depth convention: root pages use `css/`, depth-1 use `../css/`, depth-2 use `../../css/`
- All pages must include the 5-step quote modal HTML and `js/modal.js`
- Copyright: `© 2025 Go Go Gloss`

---

## Task 1: Site Audit Fixes

**Files:**
- Modify: `index.html` — add favicon link, OG meta tags, canonical
- Modify: `js/nav.js` — add Blog link to desktop and mobile nav
- Modify: `about/index.html` — add favicon, OG tags
- Modify: `gallery/index.html` — add favicon, OG tags
- Modify: `contact/index.html` — add favicon, OG tags
- Modify: `paver-sealing/index.html` — add favicon, OG tags
- Modify: `epoxy-coatings/index.html` — add favicon, OG tags
- Create: `assets/favicon.svg` — SVG favicon using brand blue

**Interfaces:**
- Produces: nav.js with Blog link consumed by all pages at runtime

- [ ] **Step 1: Create SVG favicon**

Write `assets/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#6BBDE3"/>
  <text x="32" y="46" font-family="Arial,sans-serif" font-size="38" font-weight="bold" text-anchor="middle" fill="#1A2744">GG</text>
</svg>
```

- [ ] **Step 2: Add favicon + OG + canonical to index.html**

In `<head>` after the `<meta name="description">` line, add:
```html
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="https://gogoglossaz.com/">
  <meta property="og:title" content="Go Go Gloss | Paver Sealing & Epoxy Coatings Scottsdale & Metro Phoenix">
  <meta property="og:description" content="Professional paver sealing and epoxy coatings in Scottsdale and Metro Phoenix, AZ. Licensed & insured. Free estimates. Call (623) 210-3418.">
  <meta property="og:url" content="https://gogoglossaz.com/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://gogoglossaz.com/assets/logo.png">
  <meta name="twitter:card" content="summary_large_image">
```

- [ ] **Step 3: Add favicon + OG to depth-1 pages (paver-sealing, epoxy-coatings, gallery, about, contact)**

For each of these pages (adjust og:url and og:title/description to match):
```html
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="[PAGE TITLE] | Go Go Gloss">
  <meta property="og:description" content="[PAGE META DESCRIPTION]">
  <meta property="og:url" content="https://gogoglossaz.com/[slug]/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://gogoglossaz.com/assets/logo.png">
  <meta name="twitter:card" content="summary_large_image">
```

- [ ] **Step 4: Add Blog link to nav.js**

In `js/nav.js`, after the `<li><a href="${r}gallery/">Gallery</a></li>` line in the desktop headerNav, add:
```js
      <li><a href="${r}blog/">Blog</a></li>
```

And in the mobile menu, after `<a href="${r}gallery/">Gallery</a>`, add:
```js
      <a href="${r}blog/">Blog</a>
```

Also add About and Contact links to the desktop nav (currently missing from nav.js rebuild):
```js
      <li><a href="${r}about/">About</a></li>
      <li><a href="${r}contact/">Contact</a></li>
```

- [ ] **Step 5: Commit**
```bash
git add assets/favicon.svg index.html about/index.html gallery/index.html contact/index.html paver-sealing/index.html epoxy-coatings/index.html js/nav.js
git commit -m "feat: favicon, OG meta tags, canonical, Blog nav link"
```

---

## Task 2: Blog CSS

**Files:**
- Create: `css/blog.css` — listing page and post page styles

- [ ] **Step 1: Create css/blog.css**

```css
/* Blog listing */
.blog-hero { background: var(--navy); color: #fff; padding: 80px 24px 64px; text-align: center; }
.blog-hero h1 { font-size: clamp(2rem,4vw,3rem); margin-bottom: 16px; }
.blog-hero p { color: rgba(255,255,255,0.8); max-width: 52ch; margin: 0 auto; }

.blog-filters { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; padding: 32px 24px 0; }
.blog-filter-btn { padding: 8px 20px; border-radius: 999px; border: 2px solid var(--gray-mid); background: #fff; color: var(--navy); font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: var(--transition); }
.blog-filter-btn.active, .blog-filter-btn:hover { background: var(--cta); border-color: var(--cta); color: #fff; }

.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; max-width: var(--max-width); margin: 40px auto; padding: 0 24px; }

.blog-card { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; display: flex; flex-direction: column; transition: transform var(--transition), box-shadow var(--transition); text-decoration: none; color: inherit; }
.blog-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.blog-card-img { aspect-ratio: 16/9; background: var(--gray-light); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.blog-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.blog-card-tag { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; }
.blog-card-tag--paver { background: #e0f2fe; color: #0369a1; }
.blog-card-tag--epoxy { background: #ede9fe; color: #6d28d9; }
.blog-card h2 { font-size: 1.15rem; line-height: 1.4; margin-bottom: 10px; color: var(--navy); }
.blog-card p { font-size: 0.9rem; color: var(--gray-text); flex: 1; margin-bottom: 16px; line-height: 1.6; }
.blog-card-meta { font-size: 0.78rem; color: var(--gray-text); display: flex; align-items: center; gap: 8px; }
.blog-card-meta span { display: flex; align-items: center; gap: 4px; }

/* Blog post page */
.post-hero { background: var(--navy); color: #fff; padding: 80px 24px 64px; }
.post-hero-inner { max-width: 800px; margin: 0 auto; }
.post-tag { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
.post-tag--paver { background: rgba(107,189,227,0.25); color: var(--blue); }
.post-tag--epoxy { background: rgba(167,139,250,0.25); color: #a78bfa; }
.post-hero h1 { font-size: clamp(1.75rem, 3.5vw, 2.75rem); line-height: 1.25; margin-bottom: 20px; }
.post-hero-meta { display: flex; gap: 20px; color: rgba(255,255,255,0.7); font-size: 0.85rem; flex-wrap: wrap; }

.post-layout { max-width: 860px; margin: 0 auto; padding: 56px 24px; }
.post-content { font-size: 1.0625rem; line-height: 1.8; color: var(--text-dark); }
.post-content h2 { font-size: 1.5rem; color: var(--navy); margin: 40px 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--gray-mid); }
.post-content h3 { font-size: 1.2rem; color: var(--navy); margin: 28px 0 12px; }
.post-content p { margin-bottom: 20px; }
.post-content ul, .post-content ol { margin: 0 0 20px 24px; }
.post-content li { margin-bottom: 8px; line-height: 1.7; }
.post-content strong { color: var(--navy); }
.post-content a { color: var(--cta); text-decoration: underline; }

.post-cta-box { background: var(--navy); color: #fff; border-radius: var(--radius); padding: 40px; text-align: center; margin: 48px 0; }
.post-cta-box h3 { font-size: 1.4rem; margin-bottom: 12px; }
.post-cta-box p { color: rgba(255,255,255,0.8); margin-bottom: 24px; }

.post-related { background: var(--gray-light); padding: 56px 24px; }
.post-related-inner { max-width: var(--max-width); margin: 0 auto; }
.post-related h2 { text-align: center; color: var(--navy); margin-bottom: 36px; }

@media (max-width: 768px) {
  .blog-grid { grid-template-columns: 1fr; }
  .post-hero { padding: 56px 20px 40px; }
  .post-layout { padding: 40px 20px; }
}
```

- [ ] **Step 2: Commit**
```bash
git add css/blog.css
git commit -m "feat: blog CSS for listing and post pages"
```

---

## Task 3: Blog Index Page

**Files:**
- Create: `blog/index.html` — listing of all 30 posts, filterable by category

- [ ] **Step 1: Create blog/index.html**

The file lists all 30 posts with filter buttons (All / Paver Sealing / Epoxy Coatings). Each card links to `/blog/[slug]/`. Use JavaScript to filter by data-category attribute.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Paver Sealing & Epoxy Tips for Arizona Homeowners | Go Go Gloss</title>
  <meta name="description" content="Expert tips on paver sealing, epoxy coatings, and outdoor surface care for Arizona homeowners. From how-to guides to cost breakdowns — learn from Go Go Gloss.">
  <link rel="canonical" href="https://gogoglossaz.com/blog/">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="Blog | Paver Sealing & Epoxy Tips | Go Go Gloss">
  <meta property="og:description" content="Expert tips on paver sealing, epoxy coatings, and outdoor surface care for Arizona homeowners.">
  <meta property="og:url" content="https://gogoglossaz.com/blog/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://gogoglossaz.com/assets/logo.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/variables.css?v=1">
  <link rel="stylesheet" href="../css/base.css?v=1">
  <link rel="stylesheet" href="../css/header.css?v=2">
  <link rel="stylesheet" href="../css/footer.css?v=1">
  <link rel="stylesheet" href="../css/modal.css?v=5">
  <link rel="stylesheet" href="../css/blog.css?v=1">
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a href="/" class="header-logo"><img src="../assets/logo.png" alt="Go Go Gloss"></a>
    <nav><ul class="header-nav"></ul></nav>
    <div class="header-actions">
      <a href="tel:6232103418" class="header-phone">📞 (623) 210-3418</a>
      <button class="btn btn-primary header-cta open-quote-modal">Get a Free Quote</button>
    </div>
    <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu"></div>

<section class="blog-hero">
  <h1>Arizona Home Tips & Guides</h1>
  <p>Expert advice on paver sealing, epoxy coatings, and keeping your outdoor surfaces looking their best in the Arizona heat.</p>
</section>

<div class="blog-filters">
  <button class="blog-filter-btn active" data-filter="all">All Posts</button>
  <button class="blog-filter-btn" data-filter="paver">🧱 Paver Sealing</button>
  <button class="blog-filter-btn" data-filter="epoxy">✨ Epoxy Coatings</button>
</div>

<div class="blog-grid" id="blog-grid">
  <!-- PAVER POSTS -->
  <a href="how-long-does-paver-sealing-last/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🧱</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>How Long Does Paver Sealing Last in Arizona?</h2>
      <p>Arizona's intense UV and 115°F summers are brutal on sealers. Here's the honest answer on how long your seal will actually last.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="best-time-to-seal-pavers-arizona/" class="blog-card" data-category="paver">
    <div class="blog-card-img">☀️</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Best Time of Year to Seal Pavers in Arizona</h2>
      <p>Timing your paver seal is critical in the desert. Learn when Arizona professionals schedule their jobs — and when to avoid.</p>
      <div class="blog-card-meta"><span>⏱ 4 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="diy-vs-professional-paver-sealing/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🔧</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>DIY vs Professional Paver Sealing: What Arizona Homeowners Get Wrong</h2>
      <p>DIY sealing looks easy — until you see the results. Here's what pros do differently and why it matters in the Arizona heat.</p>
      <div class="blog-card-meta"><span>⏱ 6 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="paver-sealing-cost-scottsdale/" class="blog-card" data-category="paver">
    <div class="blog-card-img">💰</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>How Much Does Paver Sealing Cost in Scottsdale?</h2>
      <p>Real price ranges from a Scottsdale-based company — no fluff. Learn what drives cost up or down on your project.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="travertine-sealing-guide/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🪨</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Travertine Sealing 101: Complete Guide for Arizona Homeowners</h2>
      <p>Travertine is the most popular paver surface in Scottsdale — and the most misunderstood. Here's everything you need to know.</p>
      <div class="blog-card-meta"><span>⏱ 7 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="pool-deck-paver-sealing/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🏊</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Pool Deck Paver Sealing: Safety & Style for Arizona Pools</h2>
      <p>Pool deck sealing is about more than looks. Learn how anti-slip sealers keep families safe and surfaces beautiful.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="wet-look-vs-matte-sealer/" class="blog-card" data-category="paver">
    <div class="blog-card-img">✨</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Wet Look vs Matte Paver Sealer: Which Is Right for Your Arizona Home?</h2>
      <p>Choosing the right finish is a big decision. Here's how to pick between wet look and matte for your specific surface.</p>
      <div class="blog-card-meta"><span>⏱ 4 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="brick-paver-sealing-guide/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🧱</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Brick Paver Sealing: Complete Guide for Phoenix Homeowners</h2>
      <p>Brick pavers are classic but require specific sealers. Get the full guide on protecting brick in the Phoenix metro area.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="paver-sealing-preparation/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🧹</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>How to Prepare Pavers Before Sealing (What Pros Do)</h2>
      <p>Preparation is 90% of a successful seal job. See the exact steps Go Go Gloss technicians follow before applying any sealer.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="signs-pavers-need-resealing/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🔍</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>5 Signs Your Pavers Need to Be Resealed</h2>
      <p>Not sure if it's time to reseal? These five warning signs tell you it's time before damage gets expensive to fix.</p>
      <div class="blog-card-meta"><span>⏱ 4 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="driveway-paver-sealing-guide/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🚗</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Driveway Paver Sealing: Everything You Need to Know</h2>
      <p>Your driveway takes more abuse than any other paved surface. Here's how to protect it for years with one smart investment.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="paver-sealing-hoa-communities/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🏘️</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Paver Sealing for HOA Communities: A Complete Guide</h2>
      <p>Managing paver sealing across an HOA community has unique challenges. Here's how to streamline it and get board buy-in.</p>
      <div class="blog-card-meta"><span>⏱ 6 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="why-pavers-fade-arizona/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🌵</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Why Arizona Pavers Fade Fast (And How to Stop It)</h2>
      <p>Arizona UV is 2x stronger than the national average. Learn the science behind paver fading and what actually prevents it.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="sealer-stripping-guide/" class="blog-card" data-category="paver">
    <div class="blog-card-img">⚗️</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>When and How to Strip Old Paver Sealer</h2>
      <p>Sometimes a fresh seal isn't enough — you need to strip the old one first. Here's how to know when stripping is necessary.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="commercial-paver-sealing-guide/" class="blog-card" data-category="paver">
    <div class="blog-card-img">🏢</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--paver">Paver Sealing</span>
      <h2>Commercial Paver Sealing: Keeping Business Surfaces Professional</h2>
      <p>Commercial paver surfaces face heavy traffic and liability risks. Learn how regular sealing protects your business investment.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>

  <!-- EPOXY POSTS -->
  <a href="epoxy-garage-floor-arizona/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🏠</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Epoxy Garage Floor Coating in Arizona: What You Need to Know</h2>
      <p>Arizona's heat creates unique challenges for epoxy garage floors. Here's what works, what doesn't, and what to ask your contractor.</p>
      <div class="blog-card-meta"><span>⏱ 6 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="how-long-does-epoxy-last/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">⏳</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>How Long Does Epoxy Floor Coating Last?</h2>
      <p>Properly installed epoxy can last 10-20 years. Here's what determines lifespan and how to maximize it in Arizona's conditions.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-vs-polyurea/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">⚖️</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Epoxy vs. Polyurea Floor Coating: Which Is Better for Arizona?</h2>
      <p>Both are popular floor coatings but they're very different products. Here's a straight comparison for Arizona garage floors.</p>
      <div class="blog-card-meta"><span>⏱ 6 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="metallic-epoxy-floors/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🌟</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Metallic Epoxy Floors: Transform Your Space with a Show-Stopping Finish</h2>
      <p>Metallic epoxy creates a one-of-a-kind floor that looks like liquid metal. Here's everything you need to know before ordering.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-floor-cost-phoenix/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">💵</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>How Much Does Epoxy Garage Floor Cost in Phoenix?</h2>
      <p>Real Phoenix pricing — not national averages. See what a two-car garage costs, what drives prices up, and how to avoid overpaying.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="prepare-garage-floor-epoxy/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🧹</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>How to Prepare Your Garage Floor for Epoxy Coating</h2>
      <p>Diamond grinding, acid etching, crack repair — proper prep is what separates a floor that lasts 15 years from one that peels in 2.</p>
      <div class="blog-card-meta"><span>⏱ 6 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-flake-vs-solid-color/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🎨</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Epoxy Flake vs. Solid Color: Choosing Your Garage Floor Look</h2>
      <p>Flake hides dirt, solid color looks sleek. Both are great options — here's how to choose the right one for your garage.</p>
      <div class="blog-card-meta"><span>⏱ 4 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="commercial-epoxy-flooring/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🏭</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Commercial Epoxy Flooring: Benefits for Arizona Businesses</h2>
      <p>Commercial epoxy floors handle forklifts, chemicals, and heavy machinery. Here's what makes epoxy the go-to choice for Arizona businesses.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-medical-facilities/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🏥</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Epoxy Floor Coating for Medical Facilities: Clean, Safe & Durable</h2>
      <p>Medical facilities need floors that pass health inspections and hold up to heavy cleaning chemicals. Epoxy delivers both.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="restaurant-epoxy-floors/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🍽️</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Restaurant Epoxy Floors: Durable, Safe & Easy to Clean</h2>
      <p>Restaurant kitchens are the hardest floors on earth. Here's why epoxy is the standard for commercial food service environments.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-floor-maintenance/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🧽</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>How to Maintain an Epoxy Floor: Simple Care Guide</h2>
      <p>Epoxy is low-maintenance — but "low" doesn't mean "zero." Here's the simple routine that keeps your floor looking new for years.</p>
      <div class="blog-card-meta"><span>⏱ 4 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-auto-shops/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🔧</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Epoxy Flooring for Auto Shops and Garages</h2>
      <p>Auto shops need oil-resistant, easy-to-clean floors that look professional. Epoxy is the industry standard — here's why.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="epoxy-new-construction/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🏗️</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Epoxy Floors for New Construction: Start Right</h2>
      <p>New construction is the perfect time to install epoxy — the slab is fresh, the conditions are ideal. Here's what to know.</p>
      <div class="blog-card-meta"><span>⏱ 4 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="residential-epoxy-coatings/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🏡</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Residential Epoxy Coatings: Transform Your Home's Interior</h2>
      <p>Epoxy isn't just for garages. Laundry rooms, basements, and patios all benefit. Here's a guide for Arizona homeowners.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
  <a href="outdoor-epoxy-arizona/" class="blog-card" data-category="epoxy">
    <div class="blog-card-img">🌞</div>
    <div class="blog-card-body">
      <span class="blog-card-tag blog-card-tag--epoxy">Epoxy Coatings</span>
      <h2>Can You Apply Epoxy Outdoors in Arizona?</h2>
      <p>Standard epoxy yellows and peels in direct sunlight. But there are outdoor-rated options that hold up to Arizona's 115°F summers.</p>
      <div class="blog-card-meta"><span>⏱ 5 min read</span><span>📅 July 2025</span></div>
    </div>
  </a>
</div>

<script>
  document.querySelectorAll('.blog-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.blog-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });
</script>

<!-- FOOTER and MODAL (see Task 4 post template for exact HTML) -->
</body>
</html>
```

*(Full footer + modal HTML mirrors the pattern from paver-sealing/scottsdale/index.html, depth-adjusted to `../`)*

- [ ] **Step 2: Commit**
```bash
git add blog/index.html
git commit -m "feat: blog listing page with 30 posts and category filter"
```

---

## Task 4: 15 Paver Sealing Blog Posts

**Files:** Create `blog/[slug]/index.html` for each of the 15 paver posts below.

Each post shares this structure:
- `<head>`: charset, viewport, title (post title + "| Go Go Gloss"), description, canonical, favicon, OG tags, BlogPosting schema, Inter font, CSS at `../../css/` depth
- Header: standard site-header with nav.js
- Breadcrumb: Home › Blog › [Post Title]
- `.post-hero`: tag chip, h1, meta (date + read time)
- `.post-layout > .post-content`: full article body with h2/h3/p/ul
- `.post-cta-box`: inline CTA to get a free quote
- Footer: standard footer
- Modal: standard 5-step quote modal
- Scripts: `../../js/nav.js`, `../../js/modal.js?v=2`

**BlogPosting schema template** (customize per post):
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[POST TITLE]",
  "description": "[META DESCRIPTION]",
  "datePublished": "2025-07-01",
  "author": {"@type": "Organization", "name": "Go Go Gloss"},
  "publisher": {"@type": "Organization", "name": "Go Go Gloss", "url": "https://gogoglossaz.com"},
  "mainEntityOfPage": "https://gogoglossaz.com/blog/[slug]/"
}
```

**Posts to create:**

1. `blog/how-long-does-paver-sealing-last/index.html`
   - Title: "How Long Does Paver Sealing Last in Arizona? | Go Go Gloss"
   - H1: "How Long Does Paver Sealing Last in Arizona?"
   - Sections: Arizona vs national averages / factors that affect longevity (UV, heat, sealer quality, prep) / sealer types and their lifespans / warning signs it's time to reseal / CTA
   - Link to: `/paver-sealing/` and `/contact/`

2. `blog/best-time-to-seal-pavers-arizona/index.html`
   - Title: "Best Time of Year to Seal Pavers in Arizona | Go Go Gloss"
   - H1: "Best Time of Year to Seal Pavers in Arizona"
   - Sections: Why timing matters in AZ / spring (ideal) / fall (second best) / why summer is risky / why winter is acceptable / monsoon season caution / CTA

3. `blog/diy-vs-professional-paver-sealing/index.html`
   - Title: "DIY vs Professional Paver Sealing: What Arizona Homeowners Get Wrong | Go Go Gloss"
   - H1: "DIY vs Professional Paver Sealing: What Arizona Homeowners Get Wrong"
   - Sections: What DIY sealers actually are / the prep problem / product quality gap / application errors / cost comparison over 5 years / when DIY is OK / CTA

4. `blog/paver-sealing-cost-scottsdale/index.html`
   - Title: "How Much Does Paver Sealing Cost in Scottsdale? | Go Go Gloss"
   - H1: "How Much Does Paver Sealing Cost in Scottsdale?"
   - Sections: Average price range ($200-$800) / price per sq ft / what's included / what drives cost up / what to watch out for / free quote CTA

5. `blog/travertine-sealing-guide/index.html`
   - Title: "Travertine Sealing 101: Complete Guide for Arizona Homeowners | Go Go Gloss"
   - H1: "Travertine Sealing 101: Complete Guide for Arizona Homeowners"
   - Sections: What makes travertine different / honed vs tumbled vs brushed / sealer types for travertine / anti-slip considerations near pools / how often to seal / CTA

6. `blog/pool-deck-paver-sealing/index.html`
   - Title: "Pool Deck Paver Sealing: Safety & Style for Arizona Pools | Go Go Gloss"
   - H1: "Pool Deck Paver Sealing: Safety & Style for Arizona Pools"
   - Sections: Why pool decks are special / anti-slip additives / heat reflectivity / chemical resistance / sealer types / how often to reseal / CTA

7. `blog/wet-look-vs-matte-sealer/index.html`
   - Title: "Wet Look vs Matte Paver Sealer: Which Is Right for Your Arizona Home? | Go Go Gloss"
   - H1: "Wet Look vs Matte Paver Sealer: Which Is Right for Your Arizona Home?"
   - Sections: What wet look does / what matte does / comparison table / which surfaces suit which finish / maintenance differences / CTA

8. `blog/brick-paver-sealing-guide/index.html`
   - Title: "Brick Paver Sealing: Complete Guide for Phoenix Homeowners | Go Go Gloss"
   - H1: "Brick Paver Sealing: Complete Guide for Phoenix Homeowners"
   - Sections: Types of brick pavers / why brick needs special sealers / prep for brick / efflorescence treatment / sealer choices / how often / CTA

9. `blog/paver-sealing-preparation/index.html`
   - Title: "How to Prepare Pavers Before Sealing (What Pros Do) | Go Go Gloss"
   - H1: "How to Prepare Pavers Before Sealing (What Pros Do)"
   - Sections: Why prep = 90% of the job / power washing steps / efflorescence removal / joint sand / crack repair / drying time / what happens when prep is skipped / CTA

10. `blog/signs-pavers-need-resealing/index.html`
    - Title: "5 Signs Your Pavers Need to Be Resealed | Go Go Gloss"
    - H1: "5 Signs Your Pavers Need to Be Resealed"
    - Sections: Sign 1 (fading color) / Sign 2 (weeds) / Sign 3 (water soaks in) / Sign 4 (stains stick) / Sign 5 (sand washing away) / what to do next / CTA

11. `blog/driveway-paver-sealing-guide/index.html`
    - Title: "Driveway Paver Sealing: Everything You Need to Know | Go Go Gloss"
    - H1: "Driveway Paver Sealing: Everything You Need to Know"
    - Sections: Why driveways need sealing / unique driveway threats (oil, tires, heat) / driveway-specific sealer options / how long it lasts / cost / CTA

12. `blog/paver-sealing-hoa-communities/index.html`
    - Title: "Paver Sealing for HOA Communities: A Complete Guide | Go Go Gloss"
    - H1: "Paver Sealing for HOA Communities: A Complete Guide"
    - Sections: HOA paver challenges / written quotes for board approval / scheduling large-scale jobs / liability / maintenance schedules / commercial rates / CTA

13. `blog/why-pavers-fade-arizona/index.html`
    - Title: "Why Arizona Pavers Fade Fast (And How to Stop It) | Go Go Gloss"
    - H1: "Why Arizona Pavers Fade Fast (And How to Stop It)"
    - Sections: UV index in Arizona vs US average / how UV degrades concrete and clay / iron oxide fading in travertine / what UV-resistant sealers do / prevention timeline / CTA

14. `blog/sealer-stripping-guide/index.html`
    - Title: "When and How to Strip Old Paver Sealer | Go Go Gloss"
    - H1: "When and How to Strip Old Paver Sealer"
    - Sections: Why old sealer sometimes must go / signs sealer is failing (peeling, whitening, hazing) / chemical stripping vs mechanical / what happens after stripping / Go Go Gloss stripping service / CTA
    - Link to: `/paver-sealing/stripping/`

15. `blog/commercial-paver-sealing-guide/index.html`
    - Title: "Commercial Paver Sealing: Keeping Business Surfaces Professional | Go Go Gloss"
    - H1: "Commercial Paver Sealing: Keeping Business Surfaces Professional"
    - Sections: Commercial vs residential sealing / high-traffic considerations / liability and slip resistance / scheduling around business hours / written scope for management / CTA
    - Link to: `/paver-sealing/commercial/`

- [ ] **Step 1–15: Create each post HTML file** (one per slug above, full 800+ word article content)
- [ ] **Step 16: Commit**
```bash
git add blog/
git commit -m "feat: 15 paver sealing blog posts"
```

---

## Task 5: 15 Epoxy Coatings Blog Posts

**Files:** Create `blog/[slug]/index.html` for each of the 15 epoxy posts below. Same structural template as Task 4.

**Posts to create:**

1. `blog/epoxy-garage-floor-arizona/index.html`
   - Title: "Epoxy Garage Floor Coating in Arizona: What You Need to Know | Go Go Gloss"
   - H1: "Epoxy Garage Floor Coating in Arizona: What You Need to Know"
   - Sections: Why AZ is different (heat delamination, UV yellowing) / moisture vapor transmission / diamond grinding requirement / polyaspartic vs epoxy for AZ / what to ask / CTA

2. `blog/how-long-does-epoxy-last/index.html`
   - Title: "How Long Does Epoxy Floor Coating Last? | Go Go Gloss"
   - H1: "How Long Does Epoxy Floor Coating Last?"
   - Sections: 10-20 year range / factors that reduce lifespan / proper prep importance / commercial vs residential / maintenance impact / warranty / CTA

3. `blog/epoxy-vs-polyurea/index.html`
   - Title: "Epoxy vs. Polyurea Floor Coating: Which Is Better for Arizona? | Go Go Gloss"
   - H1: "Epoxy vs. Polyurea Floor Coating: Which Is Better for Arizona?"
   - Sections: What each is / UV stability comparison / cure time / flexibility / cost / winner for AZ / CTA

4. `blog/metallic-epoxy-floors/index.html`
   - Title: "Metallic Epoxy Floors: Transform Your Space with a Show-Stopping Finish | Go Go Gloss"
   - H1: "Metallic Epoxy Floors: Transform Your Space with a Show-Stopping Finish"
   - Sections: What metallic epoxy is / how it's applied / color options / where it works best / cost / care / CTA

5. `blog/epoxy-floor-cost-phoenix/index.html`
   - Title: "How Much Does Epoxy Garage Floor Cost in Phoenix? | Go Go Gloss"
   - H1: "How Much Does Epoxy Garage Floor Cost in Phoenix?"
   - Sections: Two-car garage price range ($1,200-$3,500) / per sq ft rates / what's included / prep upcharges / flake vs metallic / how to compare quotes / CTA

6. `blog/prepare-garage-floor-epoxy/index.html`
   - Title: "How to Prepare Your Garage Floor for Epoxy Coating | Go Go Gloss"
   - H1: "How to Prepare Your Garage Floor for Epoxy Coating"
   - Sections: Why prep is everything / diamond grinding vs acid etching / moisture test / crack and spall repair / degreasing / drying time / what to watch for / CTA

7. `blog/epoxy-flake-vs-solid-color/index.html`
   - Title: "Epoxy Flake vs. Solid Color: Choosing Your Garage Floor Look | Go Go Gloss"
   - H1: "Epoxy Flake vs. Solid Color: Choosing Your Garage Floor Look"
   - Sections: What flake is / what solid is / hide dirt / aesthetics / texture / popular colors / price difference / CTA

8. `blog/commercial-epoxy-flooring/index.html`
   - Title: "Commercial Epoxy Flooring: Benefits for Arizona Businesses | Go Go Gloss"
   - H1: "Commercial Epoxy Flooring: Benefits for Arizona Businesses"
   - Sections: Durability for heavy traffic / chemical resistance / OSHA slip standards / quick install turnaround / ROI / industries served / CTA
   - Link to: `/epoxy-coatings/commercial/`

9. `blog/epoxy-medical-facilities/index.html`
   - Title: "Epoxy Floor Coating for Medical Facilities: Clean, Safe & Durable | Go Go Gloss"
   - H1: "Epoxy Floor Coating for Medical Facilities: Clean, Safe & Durable"
   - Sections: Health code requirements / antimicrobial options / chemical resistance to disinfectants / seamless surface / slip compliance / install during off hours / CTA

10. `blog/restaurant-epoxy-floors/index.html`
    - Title: "Restaurant Epoxy Floors: Durable, Safe & Easy to Clean | Go Go Gloss"
    - H1: "Restaurant Epoxy Floors: Durable, Safe & Easy to Clean"
    - Sections: Kitchen floor challenges / grease resistance / slip rating for kitchens / health inspection readiness / install timing / front of house vs back of house / CTA

11. `blog/epoxy-floor-maintenance/index.html`
    - Title: "How to Maintain an Epoxy Floor: Simple Care Guide | Go Go Gloss"
    - H1: "How to Maintain an Epoxy Floor: Simple Care Guide"
    - Sections: Weekly cleaning / avoid harsh chemicals / scratch prevention / UV protection for garages / what damages epoxy / when to call pros / CTA

12. `blog/epoxy-auto-shops/index.html`
    - Title: "Epoxy Flooring for Auto Shops and Garages | Go Go Gloss"
    - H1: "Epoxy Flooring for Auto Shops and Garages"
    - Sections: Oil and chemical resistance / tire stain prevention / anti-fatigue and slip / easy washdown / professional look for customers / install off-hours / CTA
    - Link to: `/industries/auto/`

13. `blog/epoxy-new-construction/index.html`
    - Title: "Epoxy Floors for New Construction: Start Right | Go Go Gloss"
    - H1: "Epoxy Floors for New Construction: Start Right"
    - Sections: Why new slabs are ideal / cure time before coating / coordinate with GC / spec epoxy in scope of work / avoid common mistakes / CTA
    - Link to: `/industries/new-construction/`

14. `blog/residential-epoxy-coatings/index.html`
    - Title: "Residential Epoxy Coatings: Transform Your Home's Interior | Go Go Gloss"
    - H1: "Residential Epoxy Coatings: Transform Your Home's Interior"
    - Sections: Beyond the garage / laundry rooms / utility spaces / man caves / interior patios / cost for residential / popular finishes / CTA
    - Link to: `/epoxy-coatings/residential/`

15. `blog/outdoor-epoxy-arizona/index.html`
    - Title: "Can You Apply Epoxy Outdoors in Arizona? | Go Go Gloss"
    - H1: "Can You Apply Epoxy Outdoors in Arizona?"
    - Sections: Why standard epoxy fails outdoors / UV yellowing explained / polyaspartic and polyurea alternatives / what we use for outdoor AZ applications / patio coating options / CTA

- [ ] **Step 1–15: Create each post HTML file**
- [ ] **Step 16: Commit**
```bash
git add blog/
git commit -m "feat: 15 epoxy coatings blog posts"
```

---

## Task 6: Decap CMS Admin

**Files:**
- Create: `admin/index.html` — Decap CMS entry point
- Create: `admin/config.yml` — CMS configuration for blog posts

**Interfaces:**
- Consumes: Netlify Identity (enabled in Netlify dashboard) + Git Gateway (enabled in Netlify dashboard)
- Produces: `/admin/` route serving the CMS for editing blog posts

- [ ] **Step 1: Create admin/index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow">
  <title>Content Manager | Go Go Gloss</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create admin/config.yml**
```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "assets"
public_folder: "/assets"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "blog"
    create: true
    slug: "{{slug}}/index"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Meta Description", name: "description", widget: "string" }
      - { label: "Category", name: "category", widget: "select", options: ["paver", "epoxy"] }
      - { label: "Publish Date", name: "date", widget: "datetime" }
      - { label: "Read Time", name: "read_time", widget: "string", default: "5 min read" }
      - { label: "Emoji Icon", name: "emoji", widget: "string", default: "🧱" }
      - { label: "Excerpt", name: "excerpt", widget: "text" }
      - { label: "Body", name: "body", widget: "markdown" }
```

- [ ] **Step 3: Add Netlify Identity widget redirect to index.html**

Add this script before `</body>` in the root `index.html`:
```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

- [ ] **Step 4: Commit**
```bash
git add admin/
git commit -m "feat: Decap CMS admin panel at /admin/"
```

---

## Task 7: Production Files

**Files:**
- Create: `sitemap.xml` — all URLs for gogoglossaz.com
- Create: `robots.txt` — allow all, point to sitemap
- Create: `404.html` — branded 404 page
- Create: `_headers` — Netlify security & cache headers

- [ ] **Step 1: Create sitemap.xml**

Include all pages: `/`, `/paver-sealing/`, all 6 paver sub-pages, all 12 paver city pages, `/epoxy-coatings/`, all 3 epoxy sub-pages, all 12 epoxy city pages, `/gallery/`, `/about/`, `/contact/`, `/industries/`, all 8 industry sub-pages, `/blog/`, all 30 blog post pages.

Format:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://gogoglossaz.com/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <!-- ... all pages ... -->
</urlset>
```

- [ ] **Step 2: Create robots.txt**
```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://gogoglossaz.com/sitemap.xml
```

- [ ] **Step 3: Create 404.html**

Full branded 404 page using site styles (depth-0 paths), with a big emoji, "Page Not Found" heading, helpful links to homepage, paver sealing, epoxy coatings, gallery, and a "Get a Free Quote" button.

- [ ] **Step 4: Create _headers**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 5: Commit**
```bash
git add sitemap.xml robots.txt 404.html _headers
git commit -m "feat: sitemap, robots.txt, 404 page, Netlify headers"
```

---

## Task 8: SEO Competitive Research Report

**Files:**
- Create: `docs/superpowers/seo-competitive-research-2026.md` — research report

- [ ] **Step 1: Research top competitors in Phoenix/Scottsdale paver sealing and epoxy**

Search for:
- "paver sealing Scottsdale AZ" top 5 organic results
- "epoxy garage floor Phoenix AZ" top 5 organic results
- "paver sealing Phoenix AZ" top 5 organic results
- "epoxy coatings Scottsdale" top 5 organic results

For each competitor note: domain, page title, meta description, keywords targeted, content structure, backlink signals (domain authority if visible), unique positioning.

- [ ] **Step 2: Keyword gap analysis**

Identify keywords competitors rank for that Go Go Gloss is not yet targeting. Focus on:
- Long-tail city + service combos
- "Cost" and "price" queries
- "How long does" queries
- "Best [service] in [city]" patterns

- [ ] **Step 3: Write report**

Structure:
```markdown
# SEO Competitive Research Report — Go Go Gloss
**Date:** 2026-07-28

## Executive Summary

## Top Competitors: Paver Sealing

### [Competitor 1]
- URL:
- Title/H1:
- Keywords targeted:
- Strengths:
- Weaknesses vs Go Go Gloss:

...

## Top Competitors: Epoxy Coatings

...

## Keyword Gap Analysis

### High-Priority Unaddressed Keywords

| Keyword | Estimated Monthly Searches | Difficulty | Recommendation |
|---------|---------------------------|------------|----------------|

## Content Recommendations

## Backlink Opportunities

## Summary Action Items (Ranked by Priority)
```

- [ ] **Step 4: Commit**
```bash
git add docs/superpowers/seo-competitive-research-2026.md
git commit -m "docs: SEO competitive research report"
```

---

## Final: Push to GitHub

- [ ] **Push all commits**
```bash
git push origin claude/go-go-gloss-website-load-d01139
```

Then open a PR from `claude/go-go-gloss-website-load-d01139` → `main` on GitHub.
