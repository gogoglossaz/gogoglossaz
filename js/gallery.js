document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.photo-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  if (lightbox) {
    items.forEach(item => {
      item.addEventListener('click', () => lightbox.classList.add('open'));
    });
    lightboxClose?.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }
});
