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

// ─── CAREERS INTERACTION SYSTEM ─────────────────────────
(function initCareers() {
  // Data lists
  const defaultInternships = [
    { id: 't1', title: 'AI/ML Intern', dept: 'technology', mode: 'Remote', duration: '6 Months', skills: ['Python', 'TensorFlow', 'NLP', 'Scikit-Learn'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't2', title: 'Full Stack Developer Intern', dept: 'technology', mode: 'Remote', duration: '6 Months', skills: ['React', 'Node.js', 'MongoDB', 'Express'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't3', title: 'Frontend Developer Intern', dept: 'technology', mode: 'Remote', duration: '3 Months', skills: ['HTML', 'CSS', 'JavaScript', 'React'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't4', title: 'Backend Developer Intern', dept: 'technology', mode: 'Hybrid', duration: '6 Months', skills: ['Node.js', 'Python', 'SQL', 'REST APIs'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't5', title: 'Mobile App Developer Intern', dept: 'technology', mode: 'Remote', duration: '6 Months', skills: ['Flutter', 'Dart', 'Firebase', 'React Native'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't6', title: 'DevOps Intern', dept: 'technology', mode: 'Onsite', duration: '6 Months', skills: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't7', title: 'Cloud Computing Intern', dept: 'technology', mode: 'Remote', duration: '3 Months', skills: ['AWS', 'Azure', 'Cloud Architecture'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't8', title: 'Cybersecurity Intern', dept: 'technology', mode: 'Hybrid', duration: '6 Months', skills: ['Penetration Testing', 'Network Security', 'Cryptography'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 't9', title: 'QA Testing Intern', dept: 'technology', mode: 'Remote', duration: '3 Months', skills: ['Selenium', 'Automation', 'Manual Testing', 'Jest'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'd1', title: 'UI/UX Design Intern', dept: 'design', mode: 'Remote', duration: '6 Months', skills: ['Figma', 'Wireframing', 'User Research'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'd2', title: 'Graphic Design Intern', dept: 'design', mode: 'Hybrid', duration: '3 Months', skills: ['Photoshop', 'Illustrator', 'Branding'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'd3', title: 'Motion Graphics Intern', dept: 'design', mode: 'Remote', duration: '3 Months', skills: ['After Effects', 'Premiere Pro', 'Animation'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'd4', title: 'Video Editing Intern', dept: 'design', mode: 'Onsite', duration: '6 Months', skills: ['Premiere Pro', 'Final Cut Pro', 'Storytelling'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'm1', title: 'Digital Marketing Intern', dept: 'marketing', mode: 'Remote', duration: '3 Months', skills: ['SEO', 'AdWords', 'Content Marketing'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'm2', title: 'Social Media Marketing Intern', dept: 'marketing', mode: 'Remote', duration: '3 Months', skills: ['Instagram', 'LinkedIn', 'Content Creation'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'm3', title: 'SEO Intern', dept: 'marketing', mode: 'Hybrid', duration: '3 Months', skills: ['Google Analytics', 'Keyword Research', 'On-page SEO'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'm4', title: 'Content Writer Intern', dept: 'marketing', mode: 'Remote', duration: '3 Months', skills: ['Copywriting', 'SEO Writing', 'Editing'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'b1', title: 'Business Development Intern', dept: 'business', mode: 'Hybrid', duration: '6 Months', skills: ['Lead Generation', 'CRM', 'Market Research'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'b2', title: 'Sales Intern', dept: 'business', mode: 'Onsite', duration: '3 Months', skills: ['Negotiation', 'Client Pitching', 'Communication'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'b3', title: 'Product Management Intern', dept: 'business', mode: 'Remote', duration: '6 Months', skills: ['Product Roadmap', 'User Stories', 'Agile'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'o1', title: 'HR Intern', dept: 'operations', mode: 'Hybrid', duration: '3 Months', skills: ['Recruitment', 'Onboarding', 'Employee Engagement'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'o2', title: 'Operations Intern', dept: 'operations', mode: 'Onsite', duration: '3 Months', skills: ['Process Optimization', 'Logistics', 'Excel'], exp: '0–1 Years / Students', status: 'Open' },
    { id: 'o3', title: 'Finance & Accounts Intern', dept: 'operations', mode: 'Remote', duration: '6 Months', skills: ['Bookkeeping', 'Tally', 'Financial Analysis'], exp: '0–1 Years / Students', status: 'Open' }
  ];

  const defaultApplicants = [
    { id: 'ap1', name: 'Madhan Kumar', email: 'madhan@example.com', phone: '9876543210', college: 'IIT Madras', degree: 'B.Tech CS', year: '4th Year', roleId: 't1', roleTitle: 'AI/ML Intern', location: 'Chennai', linkedin: 'https://linkedin.com/in/madhan', github: 'https://github.com/madhan', portfolio: '', resumeName: 'madhan_resume.pdf', motivation: 'Highly passionate about building scale AI products.', startdate: '2026-07-01', status: 'Shortlisted', date: '2026-06-25' },
    { id: 'ap2', name: 'Sanjay Krish', email: 'sanjay@example.com', phone: '9123456789', college: 'VIT Vellore', degree: 'B.Tech IT', year: '3rd Year', roleId: 't2', roleTitle: 'Full Stack Developer Intern', location: 'Vellore', linkedin: 'https://linkedin.com/in/sanjay', github: 'https://github.com/sanjay', portfolio: 'https://sanjay.dev', resumeName: 'sanjay_resume.pdf', motivation: 'I want to build full stack web portals with dynamic JS interactions.', startdate: '2026-07-05', status: 'Interview Scheduled', date: '2026-06-26', interviewDate: '2026-07-02T14:00' },
    { id: 'ap3', name: 'Rajaneethi S', email: 'raja@example.com', phone: '9988776655', college: 'SRM University', degree: 'BBA', year: '3rd Year', roleId: 'o3', roleTitle: 'Finance & Accounts Intern', location: 'Chennai', linkedin: '', github: '', portfolio: '', resumeName: 'raja_resume.pdf', motivation: 'Interested in startup accounts, taxing guidelines, and accounting software.', startdate: '2026-07-01', status: 'Under Review', date: '2026-06-27' }
  ];

  let internships = JSON.parse(localStorage.getItem('lk-internships')) || defaultInternships;
  let applicants = JSON.parse(localStorage.getItem('lk-applicants')) || defaultApplicants;

  function saveStore() {
    localStorage.setItem('lk-internships', JSON.stringify(internships));
    localStorage.setItem('lk-applicants', JSON.stringify(applicants));
  }

  // DOM Elements
  const grid = $('#internships-grid');
  const searchInput = $('#search-role');
  const deptFilter = $('#filter-dept');
  const modeFilter = $('#filter-mode');
  const durationFilter = $('#filter-duration');
  const statusFilter = $('#filter-status');

  function renderInternshipGrid() {
    if (!grid) return;
    grid.innerHTML = '';

    const query = searchInput.value.toLowerCase().trim();
    const dept = deptFilter.value;
    const mode = modeFilter.value;
    const duration = durationFilter.value;
    const status = statusFilter.value;

    const filtered = internships.filter(job => {
      const matchKeyword = job.title.toLowerCase().includes(query) || 
                           job.skills.some(s => s.toLowerCase().includes(query)) ||
                           job.dept.toLowerCase().includes(query);
      const matchDept = dept === 'all' || job.dept === dept;
      const matchMode = mode === 'all' || job.mode === mode;
      const matchDuration = duration === 'all' || job.duration === duration;
      const matchStatus = status === 'all' || job.status === status;
      return matchKeyword && matchDept && matchMode && matchDuration && matchStatus;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1; padding:40px; text-align:center;">
          <p style="font-weight:600; font-size: 0.95rem; color:var(--text-muted);">No internship roles match your criteria.</p>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Try modifying your filters or search keywords.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(job => {
      const appliedRoles = JSON.parse(localStorage.getItem('lk-applied-roles')) || [];
      const isApplied = appliedRoles.includes(job.id);

      const card = document.createElement('div');
      card.className = 'job-card-c';
      card.innerHTML = `
        <div class="job-card-top">
          <div class="job-card-header">
            <span class="job-dept">${job.dept}</span>
            <span class="job-badge ${job.status.toLowerCase()}">${job.status}</span>
          </div>
          <h3 class="job-title-c">${job.title}</h3>
          <div class="job-meta-row">
            <div class="job-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${job.duration}</span>
            </div>
            <div class="job-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${job.mode}</span>
            </div>
          </div>
          <div class="job-skills-wrap">
            ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="job-apply-row">
          <span class="job-exp">${job.exp}</span>
          ${job.status === 'Closed' 
            ? `<button class="apply-btn-c disabled" disabled>Closed</button>`
            : isApplied 
              ? `<button class="apply-btn-c disabled" disabled>Applied ✓</button>`
              : `<button class="apply-btn-c" onclick="openApplyModal('${job.id}')">Apply</button>`
          }
        </div>
      `;
      grid.appendChild(card);
    });
  }

  [searchInput, deptFilter, modeFilter, durationFilter, statusFilter].forEach(el => {
    if (el) on(el, 'input', renderInternshipGrid);
  });

  // Init grid
  setTimeout(renderInternshipGrid, 300);

  // Tabs navigation
  const tabBtnInterns = $('#tab-btn-interns');
  const tabBtnJobs = $('#tab-btn-jobs');
  const tabContentInterns = $('#tab-content-interns');
  const tabContentJobs = $('#tab-content-jobs');
  const tabContentAdmin = $('#tab-content-admin');

  function deactivateAllTabs() {
    [tabBtnInterns, tabBtnJobs].forEach(btn => btn && btn.classList.remove('active'));
    [tabContentInterns, tabContentJobs, tabContentAdmin].forEach(c => c && c.classList.remove('active'));
  }

  if (tabBtnInterns) {
    on(tabBtnInterns, 'click', () => {
      deactivateAllTabs();
      tabBtnInterns.classList.add('active');
      tabContentInterns.classList.add('active');
      renderInternshipGrid();
    });
  }

  if (tabBtnJobs) {
    on(tabBtnJobs, 'click', () => {
      deactivateAllTabs();
      tabBtnJobs.classList.add('active');
      tabContentJobs.classList.add('active');
    });
  }

  // Modals operations
  const applyModal = $('#apply-modal');
  const applyForm = $('#apply-form');
  const modalCloseBtn = $('#modal-close-btn');
  const toast = $('#toast-message');
  const toastText = $('#toast-text');

  window.openApplyModal = function(roleId) {
    const job = internships.find(j => j.id === roleId);
    if (!job) return;
    $('#su-role-id').value = job.id;
    $('#su-role-display').value = job.title;
    $('#modal-role-title').textContent = `Apply for ${job.title}`;
    applyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeApplyModal() {
    applyModal.classList.remove('open');
    applyForm.reset();
    clearFormErrors();
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) on(modalCloseBtn, 'click', closeApplyModal);
  on(applyModal, 'click', (e) => {
    if (e.target === applyModal) closeApplyModal();
  });

  function showToast(message, type = 'success') {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.className = `toast-notif show ${type}`;
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
  }

  function clearFormErrors() {
    $$('.form-error').forEach(el => { el.textContent = ''; });
    $$('.form-input').forEach(el => el.classList.remove('invalid'));
  }

  const isEmailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isUrlValid = (url) => {
    if (!url) return true;
    try { new URL(url); return true; } catch(_) { return false; }
  };

  applyForm && on(applyForm, 'submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    const name = $('#su-name').value.trim();
    const email = $('#su-email').value.trim();
    const phone = $('#su-phone').value.trim();
    const college = $('#su-college').value.trim();
    const degree = $('#su-degree').value.trim();
    const year = $('#su-year').value;
    const location = $('#su-location').value.trim();
    const linkedin = $('#su-linkedin').value.trim();
    const github = $('#su-github').value.trim();
    const portfolio = $('#su-portfolio').value.trim();
    const resume = $('#su-resume');
    const motivation = $('#su-motivation').value.trim();
    const startdate = $('#su-startdate').value;
    const agree = $('#su-agree').checked;

    let valid = true;

    if (!name) { $('#su-name-err').textContent = 'Name is required.'; $('#su-name').classList.add('invalid'); valid = false; }
    if (!email || !isEmailValid(email)) { $('#su-email-err').textContent = 'Valid email is required.'; $('#su-email').classList.add('invalid'); valid = false; }
    if (!phone || phone.length < 10) { $('#su-phone-err').textContent = 'Valid phone is required.'; $('#su-phone').classList.add('invalid'); valid = false; }
    if (!college) { $('#su-college-err').textContent = 'College is required.'; $('#su-college').classList.add('invalid'); valid = false; }
    if (!degree) { $('#su-degree-err').textContent = 'Degree is required.'; $('#su-degree').classList.add('invalid'); valid = false; }
    if (!year) { $('#su-year-err').textContent = 'Year is required.'; $('#su-year').classList.add('invalid'); valid = false; }
    if (!location) { $('#su-location-err').textContent = 'Location is required.'; $('#su-location').classList.add('invalid'); valid = false; }
    if (!motivation || motivation.length < 10) { $('#su-motivation-err').textContent = 'Please write cover letter.'; $('#su-motivation').classList.add('invalid'); valid = false; }
    if (!startdate) { $('#su-startdate-err').textContent = 'Select start date.'; $('#su-startdate').classList.add('invalid'); valid = false; }
    if (!agree) { $('#su-agree-err').textContent = 'Check declaration.'; valid = false; }
    
    if (resume.files.length === 0) {
      $('#su-resume-err').textContent = 'Resume PDF is required.';
      resume.classList.add('invalid');
      valid = false;
    } else {
      const file = resume.files[0];
      if (file.type !== 'application/pdf') {
        $('#su-resume-err').textContent = 'Only PDF supported.';
        resume.classList.add('invalid');
        valid = false;
      }
    }

    if (!isUrlValid(linkedin)) { $('#su-linkedin-err').textContent = 'Invalid URL.'; $('#su-linkedin').classList.add('invalid'); valid = false; }
    if (!isUrlValid(github)) { $('#su-github-err').textContent = 'Invalid URL.'; $('#su-github').classList.add('invalid'); valid = false; }
    if (!isUrlValid(portfolio)) { $('#su-portfolio-err').textContent = 'Invalid URL.'; $('#su-portfolio').classList.add('invalid'); valid = false; }

    if (!valid) return;

    const submitBtn = $('#apply-submit-btn');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.disabled = false;
      const roleId = $('#su-role-id').value;
      const job = internships.find(j => j.id === roleId);

      const newApplicant = {
        id: 'ap_' + Date.now(),
        name,
        email,
        phone,
        college,
        degree,
        year,
        roleId,
        roleTitle: job ? job.title : 'Intern',
        location,
        linkedin,
        github,
        portfolio,
        resumeName: resume.files[0].name,
        motivation,
        startdate,
        status: 'Applied',
        date: new Date().toISOString().split('T')[0]
      };

      applicants.push(newApplicant);
      const appliedRoles = JSON.parse(localStorage.getItem('lk-applied-roles')) || [];
      appliedRoles.push(roleId);
      localStorage.setItem('lk-applied-roles', JSON.stringify(appliedRoles));

      saveStore();
      closeApplyModal();
      showToast('🎉 Your application was submitted successfully!');
      renderInternshipGrid();
      refreshAdminDashboard();
    }, 1200);
  });

  // Admin Console Screen
  const adminPortalLink = $('#admin-portal-link');
  const adminAuthBox = $('#admin-auth-box');
  const adminDashboardBox = $('#admin-dashboard-box');
  const adminLoginForm = $('#admin-login-form');
  const adminPassInput = $('#admin-password');
  const adminAuthError = $('#admin-auth-error');

  if (adminPortalLink) {
    on(adminPortalLink, 'click', () => {
      deactivateAllTabs();
      tabContentAdmin.classList.add('active');
      
      const loggedIn = sessionStorage.getItem('lk-admin-logged');
      if (loggedIn === 'true') {
        adminAuthBox.style.display = 'none';
        adminDashboardBox.style.display = 'block';
        refreshAdminDashboard();
      } else {
        adminAuthBox.style.display = 'block';
        adminDashboardBox.style.display = 'none';
      }
    });
  }

  adminLoginForm && on(adminLoginForm, 'submit', (e) => {
    e.preventDefault();
    adminAuthError.textContent = '';
    if (adminPassInput.value === 'admin123') {
      sessionStorage.setItem('lk-admin-logged', 'true');
      adminAuthBox.style.display = 'none';
      adminDashboardBox.style.display = 'block';
      refreshAdminDashboard();
    } else {
      adminAuthError.textContent = 'Invalid access code.';
    }
  });

  const adminTabListings = $('#admin-tab-listings');
  const adminTabApplicants = $('#admin-tab-applicants');
  const adminViewListings = $('#admin-view-listings');
  const adminViewApplicants = $('#admin-view-applicants');

  if (adminTabListings && adminTabApplicants) {
    on(adminTabListings, 'click', () => {
      adminTabListings.classList.add('active');
      adminTabApplicants.classList.remove('active');
      adminViewListings.style.display = 'block';
      adminViewApplicants.style.display = 'none';
    });
    on(adminTabApplicants, 'click', () => {
      adminTabApplicants.classList.add('active');
      adminTabListings.classList.remove('active');
      adminViewListings.style.display = 'none';
      adminViewApplicants.style.display = 'block';
    });
  }

  function refreshAdminDashboard() {
    if (!adminDashboardBox || adminDashboardBox.style.display === 'none') return;
    
    $('#admin-stat-total').textContent = internships.length;
    $('#admin-stat-open').textContent = internships.filter(j => j.status === 'Open').length;
    $('#admin-stat-applied').textContent = applicants.length;
    $('#admin-stat-selected').textContent = applicants.filter(a => a.status === 'Selected').length;

    const listingsBody = $('#admin-listings-table-body');
    if (listingsBody) {
      listingsBody.innerHTML = '';
      const listSearch = $('#admin-listings-search').value.toLowerCase().trim();
      const filteredListings = internships.filter(j => j.title.toLowerCase().includes(listSearch) || j.dept.toLowerCase().includes(listSearch));

      filteredListings.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td style="font-weight:700;">${job.title}</td>
          <td style="text-transform: capitalize;">${job.dept}</td>
          <td>${job.mode}</td>
          <td>${job.duration}</td>
          <td><span class="job-badge ${job.status.toLowerCase()}">${job.status}</span></td>
          <td style="text-align: center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="admin-btn ghost" onclick="openEditRoleModal('${job.id}')">Edit</button>
              <button class="admin-btn ghost" onclick="toggleHiringStatus('${job.id}')">${job.status === 'Open' ? 'Close' : 'Open'}</button>
              <button class="admin-btn danger" onclick="deleteRole('${job.id}')">Delete</button>
            </div>
          </td>
        `;
        listingsBody.appendChild(row);
      });
    }

    const applicantsBody = $('#admin-applicants-table-body');
    if (applicantsBody) {
      applicantsBody.innerHTML = '';
      const appSearch = $('#admin-applicants-search').value.toLowerCase().trim();
      const appRoleFilter = $('#admin-applicants-filter-role').value;
      const appStatusFilter = $('#admin-applicants-filter-status').value;

      const filterRoleDropdown = $('#admin-applicants-filter-role');
      const uniqueRoles = [...new Set(applicants.map(a => a.roleTitle))];
      filterRoleDropdown.innerHTML = '<option value="all">All Roles</option>' + 
        uniqueRoles.map(r => `<option value="${r}">${r}</option>`).join('');
      filterRoleDropdown.value = appRoleFilter;

      const filteredApplicants = applicants.filter(a => {
        const matchKeyword = a.name.toLowerCase().includes(appSearch) || a.college.toLowerCase().includes(appSearch) || a.email.toLowerCase().includes(appSearch);
        const matchRole = appRoleFilter === 'all' || a.roleTitle === appRoleFilter;
        const matchStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
        return matchKeyword && matchRole && matchStatus;
      });

      filteredApplicants.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div style="font-weight:700;">${app.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${app.email}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${app.college}</div>
          </td>
          <td>${app.roleTitle}</td>
          <td>
            <select class="status-select" onchange="changeApplicantStatus('${app.id}', this.value)">
              <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="Interview Scheduled" ${app.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
              <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
              <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </td>
          <td>${app.location}</td>
          <td>${app.date}</td>
          <td style="text-align: center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="admin-btn ghost" onclick="downloadResume('${app.resumeName}')">PDF</button>
              <button class="admin-btn ghost" onclick="openScheduleModal('${app.id}')">Call</button>
              <button class="admin-btn primary" onclick="shortlistCandidate('${app.id}')">Shortlist</button>
              <button class="admin-btn danger" onclick="rejectCandidate('${app.id}')">Reject</button>
            </div>
          </td>
        `;
        applicantsBody.appendChild(row);
      });
    }
  }

  on($('#admin-listings-search'), 'input', refreshAdminDashboard);
  on($('#admin-applicants-search'), 'input', refreshAdminDashboard);
  on($('#admin-applicants-filter-role'), 'change', refreshAdminDashboard);
  on($('#admin-applicants-filter-status'), 'change', refreshAdminDashboard);

  window.toggleHiringStatus = function(roleId) {
    const job = internships.find(j => j.id === roleId);
    if (!job) return;
    job.status = job.status === 'Open' ? 'Closed' : 'Open';
    saveStore();
    refreshAdminDashboard();
    renderInternshipGrid();
  };

  window.deleteRole = function(roleId) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    internships = internships.filter(j => j.id !== roleId);
    saveStore();
    refreshAdminDashboard();
    renderInternshipGrid();
    showToast('🗑️ Internship listing removed.');
  };

  const roleModal = $('#role-modal');
  const roleForm = $('#role-form');

  window.openAddInternshipModal = function() {
    roleForm.reset();
    $('#role-form-id').value = '';
    $('#role-modal-title').textContent = 'Add Internship Role';
    roleModal.classList.add('open');
  };

  window.openEditRoleModal = function(roleId) {
    const job = internships.find(j => j.id === roleId);
    if (!job) return;
    $('#role-form-id').value = job.id;
    $('#rf-title').value = job.title;
    $('#rf-dept').value = job.dept;
    $('#rf-mode').value = job.mode;
    $('#rf-duration').value = job.duration;
    $('#rf-skills').value = job.skills.join(', ');
    $('#rf-exp').value = job.exp;
    $('#rf-status').value = job.status;
    $('#role-modal-title').textContent = 'Edit Internship Role';
    roleModal.classList.add('open');
  };

  window.closeRoleModal = function() { roleModal.classList.remove('open'); };

  roleForm && on(roleForm, 'submit', (e) => {
    e.preventDefault();
    const id = $('#role-form-id').value;
    const title = $('#rf-title').value.trim();
    const dept = $('#rf-dept').value;
    const mode = $('#rf-mode').value;
    const duration = $('#rf-duration').value;
    const skillsStr = $('#rf-skills').value.trim();
    const exp = $('#rf-exp').value.trim();
    const status = $('#rf-status').value;
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (id) {
      const job = internships.find(j => j.id === id);
      if (job) {
        job.title = title; job.dept = dept; job.mode = mode; job.duration = duration;
        job.skills = skills; job.exp = exp; job.status = status;
      }
    } else {
      internships.push({
        id: 'role_' + Date.now(), title, dept, mode, duration, skills, exp, status
      });
    }
    saveStore();
    closeRoleModal();
    refreshAdminDashboard();
    renderInternshipGrid();
    showToast('💾 Internship role saved.');
  });

  window.changeApplicantStatus = function(appId, newStatus) {
    const app = applicants.find(a => a.id === appId);
    if (!app) return;
    app.status = newStatus;
    saveStore();
    refreshAdminDashboard();
    showToast(`Status updated: ${newStatus}`);
  };

  window.shortlistCandidate = function(appId) { changeApplicantStatus(appId, 'Shortlisted'); };
  window.rejectCandidate = function(appId) { changeApplicantStatus(appId, 'Rejected'); };

  const scheduleModal = $('#schedule-modal');
  window.openScheduleModal = function(appId) {
    const app = applicants.find(a => a.id === appId);
    if (!app) return;
    $('#schedule-applicant-id').value = appId;
    scheduleModal.classList.add('open');
  };

  window.closeScheduleModal = function() { scheduleModal.classList.remove('open'); };

  $('#schedule-form') && on($('#schedule-form'), 'submit', (e) => {
    e.preventDefault();
    const appId = $('#schedule-applicant-id').value;
    const date = $('#int-date').value;
    const app = applicants.find(a => a.id === appId);
    if (app) {
      app.status = 'Interview Scheduled';
      app.interviewDate = date;
      saveStore();
      closeScheduleModal();
      refreshAdminDashboard();
      showToast(`📅 Interview scheduled at ${new Date(date).toLocaleString()}`);
    }
  });

  window.downloadResume = function(resumeName) {
    showToast(`📥 Mock download started: ${resumeName}`);
  };

  window.exportApplicantsData = function() {
    if (applicants.length === 0) return;
    showToast('📥 Exporting applicant data...');
    const headers = ['Name', 'Email', 'Role', 'Status', 'Date'];
    const rows = applicants.map(a => [`"${a.name}"`, `"${a.email}"`, `"${a.roleTitle}"`, `"${a.status}"`, `"${a.date}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'applicants_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
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
