// Header behaviour. The nav markup itself is stamped into each page by
// tools/apply-chrome.py — this file only handles the menu toggle and the
// active-link highlight.
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1000) setMenu(false); });
  }

  // Active link highlighting
  const path = window.location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  document.querySelectorAll('.header-nav a, .mobile-menu a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href !== '/' && href === path) a.classList.add('active');
  });
  document.querySelectorAll('.header-nav > li').forEach((li) => {
    const top = li.querySelector(':scope > a');
    const section = li.dataset.section || (top && top.getAttribute('href'));
    if (top && section && section !== '/' && path.startsWith(section)) top.classList.add('active');
  });
  document.querySelectorAll('.mobile-menu details').forEach((d) => {
    if (d.querySelector('a.active')) d.open = true;
  });
});
