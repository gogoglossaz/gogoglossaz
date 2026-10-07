#!/usr/bin/env python3
"""Stamp the shared header, mobile menu, footer and asset links into every page.

The site is plain static HTML, so the header/footer live in each file. Edit the
templates below, then run from the repo root:

    python3 tools/apply-chrome.py

It is safe to re-run; it replaces the existing blocks in place.
"""
import glob
import re

ASSET_VERSION = "20261006"
PHONE_DISPLAY = "(602) 364-9304"
PHONE_RAW = "6023649304"
EMAIL = "info@gogoglossaz.com"
ROC = "268402"

EPOXY_SUBS = [
    ("Garage Floor Coatings", "garage-flooring"),
    ("Residential Coatings", "residential"),
    ("Commercial Epoxy", "commercial"),
]
PAVER_SUBS = [
    ("Pool Deck & Patio", "pool-deck"),
    ("Driveway Sealing", "driveway"),
    ("Brick Pavers", "brick"),
    ("Travertine Sealing", "travertine"),
    ("Sealer Stripping", "stripping"),
    ("Commercial Sealing", "commercial"),
]
CITIES = [
    ("Scottsdale", "scottsdale"), ("Phoenix", "phoenix"), ("Chandler", "chandler"),
    ("Gilbert", "gilbert"), ("Mesa", "mesa"), ("Tempe", "tempe"),
    ("Glendale", "glendale"), ("Peoria", "peoria"), ("Surprise", "surprise"),
    ("Paradise Valley", "paradise-valley"), ("Fountain Hills", "fountain-hills"),
    ("Queen Creek", "queen-creek"),
]
INDUSTRIES = [
    ("Residential Homes", "residential"), ("HOA & Communities", "hoa"),
    ("Commercial Properties", "commercial"), ("Restaurants & Hospitality", "restaurants"),
    ("Auto & Garage", "auto"), ("Medical & Healthcare", "medical"),
    ("Retail & Shopping", "retail"), ("New Construction", "new-construction"),
]

PHONE_SVG = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 '
             '11.5 11.5 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 '
             '2.45.58 3.6a1 1 0 01-.25 1z"/></svg>')


def esc(s):
    return s.replace("&", "&amp;")


def links(base, items, indent="            "):
    return "\n".join(f'{indent}<a href="/{base}/{slug}/">{esc(name)}</a>' for name, slug in items)


def mega(base, label, subs):
    return f"""        <li class="nav-dropdown" data-section="/{base}/">
          <a href="/{base}/">{label}</a>
          <div class="dropdown-menu">
            <div class="mega-menu-inner">
              <div class="mega-col">
                <div class="mega-col-header">{label}</div>
                <a href="/{base}/" class="mega-all">All {label}</a>
{links(base, subs, "                ")}
              </div>
              <div class="mega-col">
                <div class="mega-col-header">By City</div>
{links(base, CITIES, "                ")}
              </div>
            </div>
          </div>
        </li>"""


def mobile_group(base, label, subs):
    return f"""  <details>
    <summary>{label}</summary>
    <div>
      <a href="/{base}/">All {label}</a>
{links(base, subs, "      ")}
      <div class="mobile-sub-label">{label} by city</div>
{links(base, CITIES, "      ")}
    </div>
  </details>"""


HEADER = f"""<header class="site-header">
  <div class="header-inner">
    <a href="/" class="header-logo">
      <img src="/assets/logo-gogo-gloss.png" alt="Go Go Gloss — Paver Sealing and Epoxy" width="640" height="284">
    </a>
    <div class="header-main">
      <div class="header-actions">
        <a href="tel:{PHONE_RAW}" class="header-phone">{PHONE_SVG}{PHONE_DISPLAY}</a>
        <button type="button" class="header-cta open-quote-modal">Schedule Online</button>
      </div>
      <nav aria-label="Main">
        <ul class="header-nav">
{mega("epoxy-coatings", "Epoxy Coatings", EPOXY_SUBS)}
{mega("paver-sealing", "Paver Sealing", PAVER_SUBS)}
        <li class="nav-dropdown" data-section="/industries/">
          <a href="/industries/">Industries</a>
          <div class="dropdown-menu dropdown-menu--sm">
{links("industries", INDUSTRIES)}
          </div>
        </li>
        <li><a href="/gallery/">Gallery</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/contact/">Contact</a></li>
        </ul>
      </nav>
    </div>
    <a href="tel:{PHONE_RAW}" class="header-call-mobile">{PHONE_SVG}Call</a>
    <button type="button" class="hamburger" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>"""

MOBILE_MENU = f"""<div class="mobile-menu">
  <a href="/">Home</a>
{mobile_group("epoxy-coatings", "Epoxy Coatings", EPOXY_SUBS)}
{mobile_group("paver-sealing", "Paver Sealing", PAVER_SUBS)}
  <details>
    <summary>Industries</summary>
    <div>
      <a href="/industries/">All Industries</a>
{links("industries", INDUSTRIES, "      ")}
    </div>
  </details>
  <a href="/gallery/">Gallery</a>
  <a href="/about/">About Us</a>
  <a href="/blog/">Blog</a>
  <a href="/contact/">Contact</a>
</div>"""

FOOTER = f"""<footer class="site-footer">
  <div class="footer-cta">
    <span class="footer-cta-title">Free Estimates, Call Today</span>
    <div class="footer-cta-actions">
      <a href="tel:{PHONE_RAW}" class="btn btn-outline">{PHONE_DISPLAY}</a>
      <button type="button" class="btn btn-primary open-quote-modal">Schedule Online</button>
    </div>
  </div>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/"><img src="/assets/logo-gogo-gloss.png" alt="Go Go Gloss" width="640" height="284" loading="lazy"></a>
      <p>Epoxy floor coatings and paver sealing in Scottsdale and Metro Phoenix, Arizona.</p>
      <p class="footer-license">Licensed &amp; Insured · AZ ROC #{ROC}</p>
    </div>
    <div class="footer-col">
      <h4>Epoxy Coatings</h4>
      <ul>
        <li><a href="/epoxy-coatings/">All Epoxy Coatings</a></li>
{chr(10).join(f'        <li><a href="/epoxy-coatings/{s}/">{esc(n)}</a></li>' for n, s in EPOXY_SUBS)}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Paver Sealing</h4>
      <ul>
        <li><a href="/paver-sealing/">All Paver Sealing</a></li>
{chr(10).join(f'        <li><a href="/paver-sealing/{s}/">{esc(n)}</a></li>' for n, s in PAVER_SUBS)}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/gallery/">Gallery</a></li>
        <li><a href="/industries/">Industries</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact Us</h4>
      <div class="footer-contact">
        <a href="tel:{PHONE_RAW}" class="footer-phone">{PHONE_DISPLAY}</a>
        <a href="mailto:{EMAIL}">{EMAIL}</a>
        <span>Scottsdale, AZ</span>
      </div>
    </div>
  </div>
  <p class="footer-areas"><strong>Service areas:</strong> {" · ".join(n for n, _ in CITIES)}</p>
  <div class="footer-bottom">
    <span>© 2026 Go Go Gloss LLC. All rights reserved.</span>
    <span>AZ ROC #{ROC}</span>
  </div>
</footer>

<!-- MOBILE CALL / SCHEDULE BAR -->
<div class="mobile-cta-bar">
  <a href="tel:{PHONE_RAW}">{PHONE_SVG}Call Now</a>
  <button type="button" class="open-quote-modal">Schedule Online</button>
</div>"""

FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700'
         '&family=Exo+2:ital,wght@1,800;1,900&display=swap" rel="stylesheet">')


def process(path):
    src = open(path, encoding="utf-8").read()
    s = src
    if 'class="site-header"' not in s:
        return False

    s = re.sub(r'<header class="site-header".*?</header>', lambda m: HEADER, s, count=1, flags=re.S)
    # mobile menu: drop any existing one, then place a fresh copy after the header
    s = re.sub(r'\s*(<!-- MOBILE MENU -->\s*)?<div class="mobile-menu">.*?</div>(?=\s*(<!--|<nav|<section|<main|<div|<article))',
               '', s, count=1, flags=re.S)
    s = s.replace(HEADER, HEADER + "\n\n<!-- MOBILE MENU -->\n" + MOBILE_MENU, 1)

    s = re.sub(r'\s*<!-- MOBILE CALL / SCHEDULE BAR -->\s*<div class="mobile-cta-bar">.*?</div>', '', s, count=1, flags=re.S)
    s = re.sub(r'<footer class="site-footer".*?</footer>', lambda m: FOOTER, s, count=1, flags=re.S)

    # fonts
    s = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*" rel="stylesheet">', lambda m: FONTS, s)

    # make sure the quote modal assets are on every page
    if 'modal.css' not in s:
        s = re.sub(r'(<link rel="stylesheet" href="[^"]*css/footer\.css[^"]*">)',
                   lambda m: m.group(1) + '\n  <link rel="stylesheet" href="/css/modal.css">', s, count=1)
    if 'js/modal.js' not in s:
        s = re.sub(r'(<script src="[^"]*js/nav\.js[^"]*"></script>)',
                   lambda m: m.group(1) + '\n<script src="/js/modal.js"></script>', s, count=1)

    # cache-bust shared css/js
    s = re.sub(r'((?:css|js)/[\w-]+\.(?:css|js))(?:\?v=[\w.]+)?"', lambda m: f'{m.group(1)}?v={ASSET_VERSION}"', s)

    if s != src:
        open(path, "w", encoding="utf-8").write(s)
        return True
    return False


if __name__ == "__main__":
    changed = 0
    pages = [p for p in glob.glob("**/*.html", recursive=True) if not p.startswith(("admin/", "node_modules/"))]
    for p in sorted(pages):
        changed += process(p)
    print(f"{changed} of {len(pages)} pages updated")
