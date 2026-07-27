# Quote Form Modal — Design Spec
Date: 2026-07-25

## Overview
Replace the inline hero form and /contact multi-step form with a global modal popup triggered by all "Get a Free Quote" buttons across the site. 5 steps with icon step-bar at top (A1 Garage style).

## Trigger
- Hero CTA button (simplified hero: eyebrow + headline + subtext + single button)
- Header "Get a Free Quote" nav button
- Any `.open-quote-modal` element site-wide

## Modal Structure
- Dark overlay (`rgba(0,0,0,0.6)`) behind white card
- Card: 600px max-width, centered, border-radius 16px
- **Header**: logo left + "Get Your Free Quote" title + ✕ close right (brand blue bar)
- **Step bar**: 5 icon steps connected by lines, active step fills blue
- **Body**: illustration icon + heading + input fields per step
- **Footer**: Back button left (hidden step 1) + Continue/Submit right

## 5 Steps
1. 📍 **Address** — Street, City, ZIP
2. 👤 **Contact** — First Name, Last Name, Phone, Email
3. 🔧 **Service** — Card select: Paver Sealing / Epoxy Coatings / Both Services
4. 📅 **Schedule** — Date picker (no past dates), Morning/Afternoon/Flexible
5. 📝 **Additional** — Open textarea "Anything else we should know?"

## Confirmation Screen
- Animated SVG checkmark (stroke-dashoffset draw-on)
- "Thanks [First Name]! We'll be in touch within 24 hours."
- Summary card of their selections
- Phone number CTA

## Animations (per ui-ux-pro-max)
- Modal open/close: opacity + scale(0.95→1), 250ms cubic-bezier(0.4,0,0.2,1)
- Step forward: current panel slides out left (-100%), next slides in from right (+100%), 350ms power2.inOut
- Step back: current slides out right, prev slides in from left, 350ms
- Step icon: background-color fill transition 200ms
- Validation: on blur per field (not submit-only)
- Submit: loading spinner → success checkmark SVG stroke animation 600ms

## Files
- `css/modal.css` — all modal + step + animation styles
- `js/modal.js` — open/close, step nav, validation, submit handling
- `index.html` — simplified hero, modal HTML injected, links to modal.css/js
- All pages — add modal HTML + links for global trigger support
