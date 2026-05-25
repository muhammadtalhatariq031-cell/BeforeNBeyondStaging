// ===== PORTFOLIO PAGE JAVASCRIPT =====

// ---- Gallery Filter ----
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ---- Lightbox ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');

function openLightbox(imgSrc, title) {
  lightboxImg.src = imgSrc;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-zoom').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(btn.dataset.img, btn.dataset.title);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxOverlay?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`;
document.head.appendChild(style);
