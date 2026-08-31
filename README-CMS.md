# Go Go Gloss — CMS Setup

The site is an **Astro** static build that reads content from **Sanity**.
Netlify runs `npm run build`, Astro pulls from Sanity, and the result is the
same static HTML the site has always served — same URLs, same design.

```
~/Sites/gogogloss/
├── gogoglossaz/          # the website (this repo)
└── studio-gogo-website/  # the Sanity Studio — standalone, deploys separately
```

Sanity project: **g5mbxnle**, dataset **production**.

## What is CMS-driven

| Area | Editable in Sanity | Notes |
|---|---|---|
| Blog posts | Yes | All 28 migrated. Create/edit/delete; listing + sitemap update automatically |
| Gallery | Yes | Before/after pairs, hotspot cropping, sort order, "show on homepage" |
| Homepage | Yes | Hero, trust bar, service cards, why-us, testimonials, CTA banner |
| Site-wide info | Yes | Phone, email, service areas, copyright — used across every rendered page |
| Service + city pages | **Not yet** | Phase 2. Still static in `public/`, deploying byte-identical |

## Everyday use

All commands run from this repo; the Studio lives in the sibling folder
`../studio-gogo-website` and is driven through these scripts.

```bash
npm run studio           # open the Studio locally at localhost:3333
npm run studio:deploy    # publish it to gogogloss.sanity.studio
npm run studio:install   # install Studio dependencies
npm run dev              # site dev server
npm run build            # production build (what Netlify runs)
```

## First-time setup

1. **Install Studio deps** — `npm run studio:install`
2. **Log in** — `npx sanity login`
3. **Import the existing 28 posts** (one time):
   - Sanity dashboard → project → API → Tokens → Add token → **Editor**
   - Paste it into `.env` as `SANITY_WRITE_TOKEN=...`
   - `npm run migrate:import`
   - Safe to re-run: it's `createOrReplace` on deterministic IDs (`blogPost-<slug>`)
4. **Netlify env vars** — Site settings → Environment variables:
   - `PUBLIC_SANITY_PROJECT_ID=g5mbxnle`
   - `PUBLIC_SANITY_DATASET=production`
5. **CORS** — Sanity → API → CORS origins: add `https://gogoglossaz.com`
6. **Auto-rebuild on publish** — Netlify → Build hooks → create one, then add it
   in Sanity → API → Webhooks so publishing content triggers a deploy.

## Guardrails worth knowing

- **The build fails loudly** if `PUBLIC_SANITY_PROJECT_ID` is missing, rather than
  deploying an empty site. That's deliberate.
- **`npm run build:offline`** builds from `migration/blog.ndjson` instead of the
  network — useful to test a template change without touching Sanity.
- **`npm run verify:migration`** re-checks every rendered post against the original
  static HTML in git (text + title/description/canonical). Currently 28/28 pass.
- **The migration reads originals from git**, not the working tree — the static
  blog files were removed when the blog moved into the CMS. Keys are deterministic,
  so re-running produces byte-identical output and re-importing is a no-op.
- **Don't change a post's slug** once it's live — it changes the URL and drops the
  page's search ranking. The field warns about this in the Studio.
- **Homepage falls back to the current live copy** field by field, so the page
  renders correctly even before the Homepage document is filled in.

## Known issues inherited from the old site

- The old blog listing linked to `paver-sealing-cost-scottsdale` and
  `epoxy-floor-cost-phoenix`, which were never written — those were broken links.
  The CMS listing only shows real posts. Both are strong cost-query topics worth writing.
- Blog pages previously used a different footer markup than the homepage. Everything
  now uses the homepage footer.

## Phase 2 (not started)

Service and city pages → Sanity. The 19 paver + 16 epoxy + 9 industry pages are
near-identical templates, so they collapse into a few Astro templates driven by
city/service documents — adding a new city becomes filling out a form.
