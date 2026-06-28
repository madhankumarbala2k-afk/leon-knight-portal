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
    { title: 'Careers', sub: 'Join our team', href: 'careers.html' },
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
// ─── DASHBOARD INTERACTION SYSTEM ────────────────────────
(function initDashboard() {
  // Career progress animation via intersection observer
  const dashboardSection = $('#dashboard');
  if (!dashboardSection) return;

  const trackBar = $('#track-bar');
  const aptBar = $('#apt-bar');
  if (trackBar && aptBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            trackBar.style.width = '68%';
            aptBar.style.width = '42%';
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(dashboardSection);
  }

  // AI Chat
  const chatForm = $('#chat-form');
  const chatInput = $('#chat-input-text');
  const chatBox = $('#chat-box');
  const typingIndicator = $('#chat-typing');

  const chatbotReplies = {
    hello: "Hi Madhan! How can I assist you with your AI career preparation today?",
    hi: "Hi Madhan! How can I assist you with your AI career preparation today?",
    resume: "Your current resume score is 87/100. I recommend adding details about your latest AI models/projects to raise it above 90.",
    interview: "Your AI mock interview is set for Friday. Would you like to review Python algorithms or system design guidelines?",
    jobs: "I've suggested 3 new positions (ML Engineer, Data Analyst, AI Intern). You can view details and apply in the Job Recommendations widget.",
    sql: "To master SQL, focus on window functions, CTEs, and query optimization indices. We have modules ready on the LMS tab.",
    analytics: "Your progress metrics are looking strong! Career score is up by 12% compared to last cycle.",
  };

  if (chatForm && chatInput && chatBox && typingIndicator) {
    on(chatForm, 'submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = text;
      chatBox.insertBefore(userBubble, typingIndicator);
      chatInput.value = '';
      chatBox.scrollTop = chatBox.scrollHeight;

      typingIndicator.style.display = 'flex';
      chatBox.scrollTop = chatBox.scrollHeight;

      setTimeout(() => {
        typingIndicator.style.display = 'none';
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';

        const lowerText = text.toLowerCase();
        let reply = "That's a great question! I recommend focusing on SQL queries, Python libraries, and stats. Let me know if you'd like a structured study path.";
        
        for (const [key, value] of Object.entries(chatbotReplies)) {
          if (lowerText.includes(key)) {
            reply = value;
            break;
          }
        }

        botBubble.textContent = reply;
        chatBox.insertBefore(botBubble, typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1000 + Math.random() * 800);
    });
  }

  // Analytics Charts Week/Month toggling
  const chartContainer = $('#bar-chart-container');
  const tabWeek = $('#tab-week');
  const tabMonth = $('#tab-month');

  const chartData = {
    week: [
      { label: 'M', val: '30%', score: '30%' },
      { label: 'T', val: '60%', score: '60%' },
      { label: 'W', val: '50%', score: '50%' },
      { label: 'T', val: '85%', score: '85%' },
      { label: 'F', val: '65%', score: '65%' },
      { label: 'S', val: '75%', score: '75%' }
    ],
    month: [
      { label: 'W1', val: '70%', score: '70%' },
      { label: 'W2', val: '45%', score: '45%' },
      { label: 'W3', val: '80%', score: '80%' },
      { label: 'W4', val: '55%', score: '55%' },
      { label: 'W5', val: '90%', score: '90%' },
      { label: 'W6', val: '60%', score: '60%' }
    ]
  };

  function renderChart(type) {
    if (!chartContainer) return;
    chartContainer.innerHTML = '';
    const items = chartData[type];
    items.forEach(item => {
      const wrap = document.createElement('div');
      wrap.className = 'analytics-bar-wrap';

      const bar = document.createElement('div');
      bar.className = 'analytics-bar';
      bar.style.height = '0%';

      const tooltip = document.createElement('span');
      tooltip.className = 'bar-tooltip';
      tooltip.textContent = `${item.label}: ${item.score}`;
      bar.appendChild(tooltip);

      wrap.appendChild(bar);
      chartContainer.appendChild(wrap);

      setTimeout(() => {
        bar.style.height = item.val;
      }, 50);
    });
  }

  if (tabWeek && tabMonth) {
    on(tabWeek, 'click', () => {
      tabWeek.classList.add('active');
      tabMonth.classList.remove('active');
      renderChart('week');
    });
    on(tabMonth, 'click', () => {
      tabMonth.classList.add('active');
      tabWeek.classList.remove('active');
      renderChart('month');
    });
  }
  renderChart('week');

  // Job recommendations application status
  window.applyJob = function(jobTitle, btn) {
    if (btn.classList.contains('applied')) return;
    btn.textContent = 'Applied ✓';
    btn.className = 'job-apply-btn applied';
    btn.disabled = true;
    addNotification(`Application submitted for ${jobTitle.split(' - ')[0]}!`);
  };

  // Notifications Alert Panel dismissal and counts updates
  const notifBox = $('#notif-box');
  const emptyState = $('#notif-empty-state');
  const navBadge = $('#nav-badge-count');

  function updateBadgeCount() {
    if (!notifBox || !emptyState) return;
    const activeNotifs = notifBox.querySelectorAll('.notif-item').length;
    if (activeNotifs > 0) {
      if (navBadge) {
        navBadge.style.display = 'flex';
        navBadge.textContent = activeNotifs;
      }
      emptyState.style.display = 'none';
      notifBox.style.display = 'flex';
    } else {
      if (navBadge) {
        navBadge.style.display = 'none';
      }
      emptyState.style.display = 'flex';
      notifBox.style.display = 'none';
    }
  }

  window.dismissNotif = function(btn) {
    const item = btn.closest('.notif-item');
    if (!item) return;
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
      item.remove();
      updateBadgeCount();
    }, 200);
  };

  function addNotification(text) {
    if (!notifBox) return;
    const item = document.createElement('div');
    item.className = 'notif-item';

    const textSpan = document.createElement('span');
    textSpan.className = 'notif-text';
    textSpan.textContent = text;
    item.appendChild(textSpan);

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'notif-dismiss';
    dismissBtn.setAttribute('aria-label', 'Dismiss notification');
    dismissBtn.onclick = function() { dismissNotif(this); };
    dismissBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    item.appendChild(dismissBtn);

    notifBox.insertBefore(item, notifBox.firstChild);
    updateBadgeCount();

    if (navBadge) {
      navBadge.style.transform = 'scale(1.3)';
      setTimeout(() => { navBadge.style.transform = 'scale(1)'; }, 300);
    }
  }

  updateBadgeCount();

  // Tasks checklist toggle and custom task addition
  window.toggleTask = function(element) {
    element.classList.toggle('completed');
  };

  const taskBox = $('#task-list-box');
  const taskForm = $('#task-form');
  const taskInput = $('#task-input-text');

  if (taskForm && taskInput && taskBox) {
    on(taskForm, 'submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;

      const item = document.createElement('div');
      item.className = 'task-item';
      item.onclick = function() { toggleTask(this); };

      const checkbox = document.createElement('div');
      checkbox.className = 'task-checkbox';
      checkbox.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      item.appendChild(checkbox);

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = text;
      item.appendChild(textSpan);

      taskBox.appendChild(item);
      taskInput.value = '';
      taskBox.scrollTop = taskBox.scrollHeight;
    });
  }

  // Calendar select day scheduler
  const calendarEventText = $('#calendar-event-text');
  const eventDates = {
    3: 'June 3: Resume feedback session with AI Coach',
    9: 'June 9: Mock interview with AI',
    12: 'June 12: ML Engineer Interview Preparation'
  };

  window.selectDate = function(day, element) {
    $$('.cal-day').forEach(dayEl => dayEl.classList.remove('active'));
    element.classList.add('active');

    if (!calendarEventText) return;
    if (eventDates[day]) {
      calendarEventText.textContent = eventDates[day];
      calendarEventText.style.borderColor = 'var(--accent-color)';
      calendarEventText.style.background = 'var(--accent-light)';
      calendarEventText.style.color = 'var(--accent-color)';
    } else {
      calendarEventText.textContent = `June ${day}: No events scheduled`;
      calendarEventText.style.borderColor = 'var(--card-border)';
      calendarEventText.style.background = 'var(--input-bg)';
      calendarEventText.style.color = 'var(--text-muted)';
    }
  };

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
