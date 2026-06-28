/* =========================================
   LEON-KNIGHT — app.js
   All interactivity & behavior
   ========================================= */

'use strict';

// ─── UTILITY ────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
const off = (el, ev, fn) => el && el.removeEventListener(ev, fn);

// ─── LOADING SCREEN ─────────────────────────────────────
(function initLoader() {
  const loader = $('#loading-screen');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
  document.body.style.overflow = 'hidden';
})();

// ─── THEME TOGGLE ───────────────────────────────────────
(function initTheme() {
  const html = document.documentElement;
  const toggle = $('#theme-toggle');
  const saved = localStorage.getItem('lk-theme') || 'light';
  html.setAttribute('data-theme', saved);

  on(toggle, 'click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lk-theme', next);
  });
})();

// ─── NAVBAR: SCROLL + ACTIVE LINK ───────────────────────
(function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');

  function updateScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Highlight active nav link on scroll
  const sections = $$('section[id]');
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  on(window, 'scroll', () => { updateScroll(); updateActiveLink(); }, { passive: true });
  updateScroll();
  updateActiveLink();
})();

// ─── HAMBURGER / MOBILE MENU ────────────────────────────
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileLinks = $$('.mobile-nav-link');

  function toggleMenu(force) {
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  on(hamburger, 'click', () => toggleMenu());
  mobileLinks.forEach(link => on(link, 'click', () => toggleMenu(false)));

  on(document, 'keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();

// ─── SEARCH ─────────────────────────────────────────────
(function initSearch() {
  const overlay = $('#search-overlay');
  const input = $('#search-input');
  const closeBtn = $('#close-search');
  const searchBtn = $('#search-btn');
  const resultsBox = $('#search-results');

  const searchData = [
    { title: 'AI Career', sub: 'Personalized career roadmaps & guidance', href: '#products' },
    { title: 'AI Aptitude', sub: 'Mock tests & analytics', href: '#products' },
    { title: 'Resume AI', sub: 'ATS resume builder & analyzer', href: '#products' },
    { title: 'Interview AI', sub: 'Mock interviews with AI feedback', href: '#products' },
    { title: 'LMS', sub: 'Learning management system', href: '#products' },
    { title: 'Recruit', sub: 'AI recruitment platform', href: '#products' },
    { title: 'Analytics', sub: 'Business analytics dashboard', href: '#products' },
    { title: 'Dashboard', sub: 'Your unified AI workspace', href: '#dashboard' },
    { title: 'About LEON-KNIGHT', sub: 'Company information', href: '#about' },
    { title: 'Leadership Team', sub: 'Meet our founders', href: '#leadership' },
    { title: 'Careers', sub: 'Join our team', href: '#careers' },
    { title: 'Blog', sub: 'Insights & updates', href: '#blog' },
    { title: 'Contact', sub: 'Get in touch', href: '#contact' },
    { title: 'FAQ', sub: 'Frequently asked questions', href: '#faq' },
  ];

  function openSearch() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 100);
  }
  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    renderResults('');
  }

  function renderResults(q) {
    if (!q.trim()) {
      resultsBox.innerHTML = '';
      return;
    }
    const filtered = searchData.filter(d =>
      d.title.toLowerCase().includes(q.toLowerCase()) ||
      d.sub.toLowerCase().includes(q.toLowerCase())
    );
    if (!filtered.length) {
      resultsBox.innerHTML = `<div style="padding:16px 20px;color:var(--text-tertiary);font-size:0.85rem;">No results for "<strong>${q}</strong>"</div>`;
      return;
    }
    resultsBox.innerHTML = filtered.map(r => `
      <a href="${r.href}" class="search-result-item" onclick="closeSearchGlobal()">
        <div class="search-result-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
        <div>
          <div class="search-result-title">${r.title}</div>
          <div class="search-result-sub">${r.sub}</div>
        </div>
      </a>
    `).join('');
  }

  window.closeSearchGlobal = closeSearch;

  on(searchBtn, 'click', openSearch);
  on(closeBtn, 'click', closeSearch);
  on(input, 'input', e => renderResults(e.target.value));
  on(overlay, 'click', e => { if (e.target === overlay) closeSearch(); });
  on(document, 'keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });
})();

// ─── SMOOTH SCROLL ──────────────────────────────────────
on(document, 'click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = $(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ─── BACK TO TOP ────────────────────────────────────────
(function initBackToTop() {
  const btn = $('#back-to-top');
  on(window, 'scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ─── SCROLL ANIMATIONS ──────────────────────────────────
(function initAnimations() {
  const elements = $$('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || 0, 10);
      setTimeout(() => el.classList.add('animated'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ─── COUNTER ANIMATION ──────────────────────────────────
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let start = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      function tick() {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start);
        if (start < target) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ─── FAQ ACCORDION ──────────────────────────────────────
(function initFAQ() {
  const items = $$('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    on(btn, 'click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ─── CONTACT FORM ───────────────────────────────────────
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const fields = {
    name: { el: $('#contact-name'), err: $('#name-error'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email: { el: $('#contact-email'), err: $('#email-error'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    subject: { el: $('#contact-subject'), err: $('#subject-error'), validate: v => v.trim().length >= 3 ? '' : 'Please enter a subject.' },
    message: { el: $('#contact-message'), err: $('#message-error'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  };

  function validateField(key) {
    const f = fields[key];
    const msg = f.validate(f.el.value);
    f.err.textContent = msg;
    f.el.classList.toggle('invalid', !!msg);
    return !msg;
  }

  Object.keys(fields).forEach(key => {
    on(fields[key].el, 'blur', () => validateField(key));
    on(fields[key].el, 'input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  on(form, 'submit', e => {
    e.preventDefault();
    const valid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
    if (!valid) return;

    const btn = $('#contact-submit');
    const success = $('#contact-success');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulate submission
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      success.textContent = '✓ Message sent successfully! We\'ll get back to you within 24 hours.';
      form.reset();
      setTimeout(() => { success.textContent = ''; }, 6000);
    }, 1500);
  });
})();

// ─── NEWSLETTER FORM ────────────────────────────────────
(function initNewsletter() {
  const form = $('#newsletter-form');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    const email = $('#newsletter-email').value;
    const consent = $('#nl-consent').checked;
    const success = $('#newsletter-success');
    const btn = $('#newsletter-submit');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      success.style.color = '#EF4444';
      success.textContent = 'Please enter a valid email address.';
      return;
    }
    if (!consent) {
      success.style.color = '#EF4444';
      success.textContent = 'Please agree to receive emails.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Subscribing…';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Subscribe';
      success.style.color = '#059669';
      success.textContent = '✓ You\'re subscribed! Welcome to the LEON-KNIGHT community.';
      form.reset();
      setTimeout(() => { success.textContent = ''; }, 6000);
    }, 1200);
  });
})();

// ─── CHART TAB INTERACTION ──────────────────────────────
(function initChartTabs() {
  const tabs = $$('.chart-tab');
  tabs.forEach(tab => {
    on(tab, 'click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
})();

// ─── HERO CHART BAR HOVER INTERACTIONS ──────────────────
(function initChartBars() {
  const bars = $$('.bcb');
  bars.forEach(bar => {
    on(bar, 'mouseenter', () => bars.forEach(b => b.classList.remove('active')));
    on(bar, 'mouseleave', () => {
      // re-highlight highest
      bars.forEach(b => b.classList.remove('active'));
      const highest = [...bars].sort((a, b) => parseFloat(b.style.height) - parseFloat(a.style.height))[0];
      if (highest) highest.classList.add('active');
    });
    on(bar, 'click', () => {
      bars.forEach(b => b.classList.remove('active'));
      bar.classList.add('active');
    });
  });
})();

// ─── KEYBOARD ACCESSIBILITY ─────────────────────────────
(function initKeyboardNav() {
  on(document, 'keydown', e => {
    // Tab focus visible outline
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  on(document, 'mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();

// ─── CURSOR HOVER EFFECT ON PRODUCT CARDS ───────────────
(function initCardHover() {
  const cards = $$('.product-card, .why-card, .blog-card, .testimonial-card');
  cards.forEach(card => {
    on(card, 'mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    on(card, 'mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── PERFORMANCE: PASSIVE LISTENERS ─────────────────────
// Already using { passive: true } on scroll events above.

// ─── LOG ────────────────────────────────────────────────
console.log(
  '%c LEON-KNIGHT %c v1.0.0 %c Building the Future with AI ',
  'background:#2563EB;color:#fff;font-weight:800;padding:4px 8px;border-radius:4px 0 0 4px;',
  'background:#1D4ED8;color:#fff;font-weight:600;padding:4px 8px;',
  'background:#111;color:#fff;font-weight:400;padding:4px 8px;border-radius:0 4px 4px 0;'
);
