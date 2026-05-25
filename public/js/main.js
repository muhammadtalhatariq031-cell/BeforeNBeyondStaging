/* ===== MAIN JAVASCRIPT ===== */

// ---- Navbar scroll behavior ----
const navbar = document.getElementById('navbar');
if (navbar) {
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.remove('transparent');
      navbar.classList.remove('dark');
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('transparent');
      navbar.classList.remove('scrolled');
    }
  };

  // Only apply transparent behavior on home page
  if (navbar.classList.contains('transparent')) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// ---- Mobile Navigation ----
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });
}

function closeMobileNav() {
  if (navMobile) {
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ---- Counter Animation ----
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => {
  counterObserver.observe(el);
});

// ---- Before/After Slider ----
function initBASlider() {
  const slider = document.getElementById('baSlider');
  const handle = document.getElementById('baHandle');
  const afterEl = slider?.querySelector('.ba-after');

  if (!slider || !handle || !afterEl) return;

  let isDragging = false;
  let position = 50;

  const setPosition = (x) => {
    const rect = slider.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
    position = pct;
    afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `${pct}%`;
  };

  slider.addEventListener('mousedown', (e) => { isDragging = true; setPosition(e.clientX); });
  slider.addEventListener('touchstart', (e) => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });

  window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });
  window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });
}

initBASlider();

// ---- Smooth anchor scrolling ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Custom Elegant Follow Cursor ----
function initCustomCursor() {
  // Only execute on devices that support a mouse/fine pointer
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const ring = document.createElement('div');
  const dot = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  dot.className = 'custom-cursor-dot';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0; // Actual mouse position
  let ringX = 0, ringY = 0;   // Ring follow position
  let dotX = 0, dotY = 0;     // Dot follow position

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Custom lagging animation for extremely smooth fluid follow effect
  const tick = () => {
    // Smooth interpolation (lerp)
    // Ring lags more for rich drag effect, Dot is almost instant
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    dotX += (mouseX - dotX) * 0.45;
    dotY += (mouseY - dotY) * 0.45;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Hover States
  const hoverSelectors = 'a, button, .btn, .filter-btn, .gallery-zoom, .faq-question, .carousel-btn, .social-icon, .ba-slider-wrapper';
  const handleMouseOver = () => document.body.classList.add('cursor-hover');
  const handleMouseOut = () => document.body.classList.remove('cursor-hover');

  document.querySelectorAll(hoverSelectors).forEach(el => {
    el.addEventListener('mouseenter', handleMouseOver, { passive: true });
    el.addEventListener('mouseleave', handleMouseOut, { passive: true });
  });

  // Observe dynamically loaded elements (like testimonials, portfolio changes, etc.)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches && node.matches(hoverSelectors)) {
            node.addEventListener('mouseenter', handleMouseOver, { passive: true });
            node.addEventListener('mouseleave', handleMouseOut, { passive: true });
          }
          node.querySelectorAll?.(hoverSelectors).forEach(el => {
            el.addEventListener('mouseenter', handleMouseOver, { passive: true });
            el.addEventListener('mouseleave', handleMouseOut, { passive: true });
          });
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Check DOM ready and run custom cursor
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
  initCustomCursor();
}
