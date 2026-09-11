document.addEventListener('DOMContentLoaded', () => {

  const PAVER_SUBS = [
    { name: 'Pool Deck & Patio',   slug: 'pool-deck' },
    { name: 'Driveway Sealing',    slug: 'driveway' },
    { name: 'Brick Pavers',        slug: 'brick' },
    { name: 'Travertine Sealing',  slug: 'travertine' },
    { name: 'Sealer Stripping',    slug: 'stripping' },
    { name: 'Commercial Sealing',  slug: 'commercial' },
  ];

  const EPOXY_SUBS = [
    { name: 'Garage Floor Coatings', slug: 'garage-flooring' },
    { name: 'Residential Coatings',  slug: 'residential' },
    { name: 'Commercial Epoxy',      slug: 'commercial' },
  ];

  const CITIES = [
    { name: 'Scottsdale',      slug: 'scottsdale' },
    { name: 'Phoenix',         slug: 'phoenix' },
    { name: 'Chandler',        slug: 'chandler' },
    { name: 'Gilbert',         slug: 'gilbert' },
    { name: 'Mesa',            slug: 'mesa' },
    { name: 'Tempe',           slug: 'tempe' },
    { name: 'Glendale',        slug: 'glendale' },
    { name: 'Peoria',          slug: 'peoria' },
    { name: 'Surprise',        slug: 'surprise' },
    { name: 'Paradise Valley', slug: 'paradise-valley' },
    { name: 'Fountain Hills',  slug: 'fountain-hills' },
    { name: 'Queen Creek',     slug: 'queen-creek' },
  ];

  const INDUSTRIES = [
    { name: 'Residential Homes',        slug: 'residential' },
    { name: 'HOA & Communities',        slug: 'hoa' },
    { name: 'Commercial Properties',    slug: 'commercial' },
    { name: 'Restaurants & Hospitality',slug: 'restaurants' },
    { name: 'Auto & Garage',            slug: 'auto' },
    { name: 'Medical & Healthcare',     slug: 'medical' },
    { name: 'Retail & Shopping',        slug: 'retail' },
    { name: 'New Construction',         slug: 'new-construction' },
  ];

  // Resolve root path relative to current page depth
  function root() {
    const depth = window.location.pathname.replace(/^\//, '').split('/').length - 1;
    return depth === 0 ? '/' : '../'.repeat(depth);
  }

  const r = root();

  // ── Rebuild full desktop nav ─────────────────────────────────────────────
  const headerNav = document.querySelector('.header-nav');
  if (headerNav) {
    headerNav.innerHTML = `
      <li><a href="${r}">Home</a></li>

      <li class="nav-dropdown">
        <a href="#">Services</a>
        <div class="dropdown-menu">
          <div class="mega-menu-inner">
            <div class="mega-col">
              <div class="mega-col-header"><a href="${r}paver-sealing/">🧱 Paver Sealing</a></div>
              ${PAVER_SUBS.map(s => `<a href="${r}paver-sealing/${s.slug}/">${s.name}</a>`).join('')}
            </div>
            <div class="mega-col">
              <div class="mega-col-header"><a href="${r}epoxy-coatings/">✨ Epoxy Coatings</a></div>
              ${EPOXY_SUBS.map(s => `<a href="${r}epoxy-coatings/${s.slug}/">${s.name}</a>`).join('')}
            </div>
          </div>
        </div>
      </li>

      <li class="nav-dropdown">
        <a href="#">Service Areas</a>
        <div class="dropdown-menu">
          <div class="mega-menu-inner">
            <div class="mega-col">
              <div class="mega-col-header"><a href="${r}paver-sealing/">🧱 Paver Sealing</a></div>
              ${CITIES.map(c => `<a href="${r}paver-sealing/${c.slug}/">${c.name}</a>`).join('')}
            </div>
            <div class="mega-col">
              <div class="mega-col-header"><a href="${r}epoxy-coatings/">✨ Epoxy Coatings</a></div>
              ${CITIES.map(c => `<a href="${r}epoxy-coatings/${c.slug}/">${c.name}</a>`).join('')}
            </div>
          </div>
        </div>
      </li>

      <li class="nav-dropdown">
        <a href="#">Industries</a>
        <div class="dropdown-menu dropdown-menu--sm">
          ${INDUSTRIES.map(i => `<a href="${r}industries/${i.slug}/">${i.name}</a>`).join('')}
        </div>
      </li>

      <li><a href="${r}gallery/">Gallery</a></li>
      <li><a href="${r}about/">About</a></li>
      <li><a href="${r}contact/">Contact</a></li>
      <li><a href="${r}blog/">Blog</a></li>
    `;
  }

  // ── Rebuild mobile menu ──────────────────────────────────────────────────
  const mobileMenuEl = document.querySelector('.mobile-menu');
  if (mobileMenuEl) {
    const phoneLink = mobileMenuEl.querySelector('.mobile-phone');
    const quoteBtn  = mobileMenuEl.querySelector('.mobile-quote');
    mobileMenuEl.innerHTML = `
      <a href="${r}">Home</a>
      <a href="${r}paver-sealing/">Paver Sealing</a>
      ${PAVER_SUBS.map(s => `<a href="${r}paver-sealing/${s.slug}/" style="padding-left:24px;font-size:0.82rem;">${s.name}</a>`).join('')}
      <a href="${r}epoxy-coatings/">Epoxy Coatings</a>
      ${EPOXY_SUBS.map(s => `<a href="${r}epoxy-coatings/${s.slug}/" style="padding-left:24px;font-size:0.82rem;">${s.name}</a>`).join('')}
      <div class="mobile-city-label">Service Areas</div>
      ${CITIES.map(c => `<a href="${r}paver-sealing/${c.slug}/" style="padding-left:16px;font-size:0.82rem;">${c.name} — Paver</a>`).join('')}
      ${CITIES.map(c => `<a href="${r}epoxy-coatings/${c.slug}/" style="padding-left:16px;font-size:0.82rem;">${c.name} — Epoxy</a>`).join('')}
      <div class="mobile-city-label">Industries</div>
      ${INDUSTRIES.map(i => `<a href="${r}industries/${i.slug}/" style="padding-left:16px;font-size:0.82rem;">${i.name}</a>`).join('')}
      <a href="${r}gallery/">Gallery</a>
      <a href="${r}about/">About</a>
      <a href="${r}contact/">Contact</a>
      <a href="${r}blog/">Blog</a>
      <a href="tel:6023649304" class="mobile-phone">📞 Call (602) 364-9304</a>
      <button class="mobile-quote open-quote-modal">Get a Free Quote →</button>
    `;
  }

  // ── Hamburger toggle ─────────────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Active nav highlighting ──────────────────────────────────────────────
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.header-nav a, .mobile-menu a, .mega-menu-inner a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && href !== '' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
});
