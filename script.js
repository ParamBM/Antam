/* ===================================================
   ANTAM Premium Website — script.js
   =================================================== */

'use strict';

/* ─────────────────────────────────────────
   NAVBAR: transparent → solid on scroll
   ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.remove('nav-transparent');
    navbar.classList.add('nav-scrolled');
  } else {
    navbar.classList.add('nav-transparent');
    navbar.classList.remove('nav-scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ─────────────────────────────────────────
   MOBILE MENU TOGGLE
   ───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────
   SMOOTH SCROLL for nav links
   ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   SCROLL REVEAL ANIMATION
   ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   FAQ ACCORDION
   ───────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
      el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it wasn't open)
    if (!isOpen) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ─────────────────────────────────────────
   CONTACT FORM SUBMISSION
   ───────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const originalContent = btn.innerHTML;

  // Loading state
  btn.innerHTML = '<span>Sending…</span>';
  btn.disabled = true;
  btn.style.opacity = '0.75';

  // Simulate API call
  setTimeout(() => {
    btn.innerHTML = '<span>✓ Quote Request Sent!</span>';
    btn.style.background = 'linear-gradient(135deg, #3aaa6e, #4dc88a)';
    btn.style.opacity = '1';

    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.opacity = '';
      form.reset();
    }, 3500);
  }, 1400);
}

/* ─────────────────────────────────────────
   ACTIVE NAV LINK HIGHLIGHTING
   ───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links .nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '-80px 0px -20% 0px'
});

sections.forEach(sec => sectionObserver.observe(sec));

/* ─────────────────────────────────────────
   PARALLAX on HERO image (subtle)
   ───────────────────────────────────────── */
const heroImage = document.querySelector('.hero-image-wrap img');
if (heroImage) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────
   COUNTER ANIMATION for stats
   ───────────────────────────────────────── */
function animateCounter(el, target, suffix, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.querySelector('.num').textContent = current;
    if (progress < 1) requestAnimationFrame(step);
    else el.querySelector('.num').textContent = target;
  };
  requestAnimationFrame(step);
}

// Prepare stat numbers for animation
document.querySelectorAll('.stat-number').forEach(el => {
  const text = el.textContent.trim();
  const match = text.match(/(\d+)([+%]*)/);
  if (!match) return;
  const target = parseInt(match[1]);
  const suffix = match[2] || '';
  const suffixEl = el.querySelector('span');
  if (suffixEl) {
    const numSpan = document.createElement('span');
    numSpan.className = 'num';
    numSpan.textContent = '0';
    el.innerHTML = '';
    el.appendChild(numSpan);
    el.appendChild(suffixEl);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  }, { threshold: 0.5 });

  counterObserver.observe(el);
});
