// Homepage review carousel
(function () {
  const slides = Array.from(document.querySelectorAll('.hp-review'));
  if (slides.length < 2) return;
  let i = 0;
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
  }
  document.querySelectorAll('[data-review]').forEach((btn) => {
    btn.addEventListener('click', () => show(i + (btn.dataset.review === 'next' ? 1 : -1)));
  });
})();
