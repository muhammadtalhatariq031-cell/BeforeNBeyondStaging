// ===== HOME PAGE JAVASCRIPT =====

// ---- Testimonials Carousel ----
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let perView = window.innerWidth < 768 ? 1 : 3;
  const total = cards.length;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.dot');

  function goTo(index) {
    current = (index + total) % total;
    const cardWidth = cards[0].offsetWidth + 32;
    const maxOffset = -(total - perView) * cardWidth;
    let offset = -current * cardWidth;
    if (offset < maxOffset) offset = maxOffset;
    track.style.transform = `translateX(${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoplay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  });

  window.addEventListener('resize', () => {
    perView = window.innerWidth < 768 ? 1 : 3;
    goTo(current);
  });
}

// ---- Hero scroll indicator fade ----
const heroScroll = document.getElementById('heroScroll');
if (heroScroll) {
  window.addEventListener('scroll', () => {
    heroScroll.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
}
