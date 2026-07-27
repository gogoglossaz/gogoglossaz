# Go Go Gloss Website Design Spec
Date: 2026-07-20

## Overview
A multi-page, professional brochure website for Go Go Gloss — a paver sealing and epoxy coatings company serving Scottsdale and Metro Phoenix, AZ. Goal is lead generation via phone calls and a multi-step animated quote form.

**Phone:** (623) 212-0341
**Website:** gogoglossaz.com
**Email:** info@veloaz.com
**Service Area:** Scottsdale and all Metro Phoenix areas

---

## Visual System

### Colors
- **Primary Blue:** `#6BBDE3` (light blue from logo)
- **Dark Navy:** `#1A2744`
- **White:** `#FFFFFF`
- **Light Gray:** `#F5F7FA` (section backgrounds)
- **Text Dark:** `#1A1A2E`
- **Accent/CTA:** `#2563EB` (blue, strong contrast for buttons)

### Typography
- **Headings:** Inter Bold / 700 weight
- **Subheadings:** Inter SemiBold / 600
- **Body:** Inter Regular / 400
- **CTA Buttons:** Inter SemiBold, uppercase tracking

### Assets
- Logo: `/assets/logo.png` (square logo with GOGO GLOSS, sparkle motif)
- Van photo: `/assets/van.png` (branded company van)

---

## Site Structure (6 pages)

```
/                  → Home
/paver-sealing     → Paver Sealing Service Page
/epoxy-coatings    → Epoxy Coatings Service Page
/gallery           → Photo Gallery (before/after)
/about             → About Us
/contact           → Contact + Quote Form
```

---

## Global Components

### Header (sticky)
- Left: Logo
- Center: Navigation links — Home, Services (dropdown: Paver Sealing, Epoxy Coatings), Gallery, About, Contact
- Right: Phone number `(623) 212-0341` (click-to-call) + "Get a Free Quote" button (links to /contact)
- Collapses to hamburger menu on mobile

### Footer
- Logo + tagline: "Professional Paver Sealing & Epoxy Coatings in Metro Phoenix"
- Quick links: Services, Gallery, About, Contact
- Service areas: Scottsdale, Phoenix, Glendale, Peoria, Surprise, Tempe, Chandler, Gilbert, Mesa
- Phone, email
- Social links (Facebook, Instagram, Google)
- Copyright line
- **No ROC license number** (to be added later when obtained)

### Trust Bar (global, appears below hero on home + top of service pages)
- "500+ Jobs Completed"
- "5-Star Google Rated"
- "Licensed & Insured"
- "Scottsdale & Metro Phoenix"

---

## Pages

### 1. Home (`/`)

**Hero Section**
- Full-width background: company van photo or high-quality paver/epoxy job photo
- Headline: "Arizona's Trusted Paver Sealing & Epoxy Coating Experts"
- Subheadline: "Protecting and beautifying homes across Scottsdale & Metro Phoenix"
- Two CTAs: `Call Now (623) 212-0341` | `Get a Free Quote`

**Trust Bar**
- 4-item stats strip (see Global Components)

**Services Overview**
- Two cards side by side: Paver Sealing / Epoxy Coatings
- Each card: icon, short description, "Learn More" link + "Get a Quote" button

**Why Choose Go Go Gloss**
- 4-6 differentiator points with icons:
  - Local family-owned business
  - High-quality materials
  - Fast turnaround
  - Licensed & Insured
  - Free estimates
  - 100% satisfaction focus

**Testimonials**
- 3 rotating review cards with star ratings, customer name, city, review text
- Google review badge/logo for credibility

**Review Badges**
- Google 5-star badge, BBB logo cluster

**Gallery Preview**
- 6 before/after thumbnail grid
- "See More" button → /gallery

**Final CTA Banner**
- Dark navy background
- "Ready to Transform Your Outdoor Space?"
- Two buttons: Call + Get a Quote

---

### 2. Paver Sealing (`/paver-sealing`)

**Hero**
- Page headline + hero image of sealed pavers
- CTA: Get a Free Quote

**Trust Bar**

**What Is Paver Sealing**
- Benefits: enhances color, prevents weeds, repels stains, extends life

**Our Process (Step-by-Step)**
- Steps with icons: 1. Inspection → 2. Cleaning → 3. Re-sanding → 4. Sealing → 5. Final Walkthrough

**Before/After Gallery (inline)**
- 4 paver-specific before/after images

**FAQs**
- How long does sealing last?
- How often should I reseal?
- What types of pavers do you seal?
- How long until I can walk on it?

**CTA Section**
- Call or Quote form link

---

### 3. Epoxy Coatings (`/epoxy-coatings`)

Same structure as Paver Sealing page, scoped to epoxy:

**Process Steps:** 1. Surface prep → 2. Diamond grinding → 3. Base coat → 4. Flake/color broadcast → 5. Top coat → 6. Final inspection

**FAQs** scoped to epoxy: durability, slip resistance, garage vs. patio, cure time

---

### 4. Gallery (`/gallery`)

- Filter tabs: All | Paver Sealing | Epoxy Coatings
- Masonry or grid layout of before/after photo pairs
- Lightbox on click
- CTA strip at bottom: "Love what you see? Get a Free Quote"

---

### 5. About (`/about`)

- Company story / mission
- Owner/team photo (placeholder)
- Stats: Jobs completed, years serving AZ, Google rating
- Values: Quality, Integrity, Reliability
- Licensed & Insured badge (no ROC number yet)
- Service area map or city list

---

### 6. Contact (`/contact`)

**Page intro:** "Get Your Free Quote — No Obligation"
**Multi-step animated form (3 steps):**

#### Step 1 — Service Selection
- Three large icon cards (full-width selectable):
  - Paver Sealing
  - Epoxy Coatings
  - Both Services ← "BEST VALUE — Save 10% when you bundle!"
- Bundle upsell: When user selects Paver Sealing OR Epoxy only, a banner animates in below:
  *"Add [the other service] and save 10%! Click 'Both Services' to bundle."*
- "Next" button activates after selection

#### Step 2 — Your Information
- First Name, Last Name
- Phone Number (required)
- Email Address (required)
- Service Address (street, city, zip)
- Property Type: Residential / Commercial (toggle)

#### Step 3 — Schedule
- Preferred Date (date picker, no past dates)
- Preferred Time: Morning (8am–12pm) / Afternoon (12pm–5pm) / Flexible
- Additional Notes (textarea, optional)

**Confirmation Screen**
- Animated checkmark
- "Thank you, [First Name]! We'll be in touch within 24 hours."
- Summary of selections
- "Call us now if you need immediate help: (623) 212-0341"

**Form Animations**
- Slide-left/right transitions between steps
- Progress bar at top (Step 1 of 3 → 2 of 3 → 3 of 3)
- Smooth color fill on progress bar
- Cards pop/scale on hover and selection
- Bundle upsell banner slides down with fade-in
- Confirmation checkmark draws in with stroke animation

---

## Tech Stack

- **HTML/CSS/JS** — vanilla, no framework
- **CSS custom properties** for theming
- **CSS animations + transitions** for form interactions
- **No external dependencies** except optionally Google Fonts (Inter)
- **Hosting:** GitHub Pages, Netlify, or similar static host

---

## SEO Basics

- Each page has unique `<title>` and `<meta description>`
- H1 on every page includes service + location keywords
- Schema markup: LocalBusiness on homepage
- Service area cities mentioned on homepage footer and About page
- Alt text on all images

---

## Mobile

- Fully responsive, mobile-first
- Hamburger nav on mobile
- Click-to-call phone number on all pages
- Form is thumb-friendly (large tap targets)
