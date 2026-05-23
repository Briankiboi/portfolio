/* Brian Kiboi Portfolio — multi-page JS
   No SPA. Each page loads its own HTML.
   Handles: nav active state, sidebar toggle, modals, portfolio filter,
   lightbox, scroll-to-top, custom cursor. */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Active nav link based on current URL ---------- */
  const navLinks = document.querySelectorAll('.navbar a');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) link.classList.add('active');
    else link.classList.remove('active');
  });

  /* ---------- Category toggle: Engineer / Freelance ---------- */
  const CATEGORY_PATHS = {
    engineer:  ['/', '/about', '/portfolio', '/resume', '/what-i-do', '/gallery', '/contact'],
    freelance: ['/', '/services', '/what-i-do', '/contact'],
  };
  const MODE_KEY = 'nav-mode';
  const navbar = document.querySelector('.navbar');
  const navList = navbar ? navbar.querySelector('ul') : null;

  function getStoredMode() {
    const m = localStorage.getItem(MODE_KEY);
    return (m === 'engineer' || m === 'freelance') ? m : 'all';
  }
  function setStoredMode(m) {
    if (m === 'all') localStorage.removeItem(MODE_KEY);
    else localStorage.setItem(MODE_KEY, m);
  }

  /* Tag each nav <li> with the categories it belongs to */
  function tagNavItems() {
    if (!navList) return;
    navList.querySelectorAll('li').forEach(li => {
      const a = li.querySelector('a');
      if (!a) return;
      const href = a.getAttribute('href').replace(/\/$/, '') || '/';
      const cats = [];
      if (CATEGORY_PATHS.engineer.includes(href))  cats.push('engineer');
      if (CATEGORY_PATHS.freelance.includes(href)) cats.push('freelance');
      li.dataset.cat = cats.join(' ');
    });
  }

  function applyMode(mode) {
    document.querySelectorAll('[data-cat]').forEach(li => {
      const cats = (li.dataset.cat || '').split(' ');
      const visible = mode === 'all' || cats.includes(mode);
      li.style.display = visible ? '' : 'none';
    });
    document.querySelectorAll('.nav-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    updateTabText(mode);
  }

  /* Inject the toggle as a slim right-edge tab that expands on hover */
  function buildCategoryToggle() {
    if (document.querySelector('.right-sidebar')) return;
    const aside = document.createElement('aside');
    aside.className = 'right-sidebar';
    aside.innerHTML = `
      <div class="right-sidebar-panel">
        <div class="right-sidebar-label">How can I help?</div>
        <button type="button" class="nav-cat-btn" data-mode="engineer">
          <strong>Hire as Engineer</strong>
          <small>Full-time role</small>
        </button>
        <button type="button" class="nav-cat-btn" data-mode="freelance">
          <strong>Get a Freelancer</strong>
          <small>For a project</small>
        </button>
        <button type="button" class="nav-cat-btn nav-cat-clear" data-mode="all" aria-label="Show all">
          <strong>Show all</strong>
        </button>
      </div>
      <button class="right-sidebar-tab" type="button" aria-label="View options">
        <span class="right-sidebar-tab-text">VIEW AS</span>
      </button>
    `;
    document.body.appendChild(aside);
    aside.addEventListener('click', e => {
      const btn = e.target.closest('.nav-cat-btn');
      if (btn) {
        const mode = btn.dataset.mode;
        const label = btn.querySelector('strong')?.textContent || 'Switching';
        showModeLoader(label);
        setTimeout(() => {
          setStoredMode(mode);
          applyMode(mode);
          aside.classList.remove('open');
        }, 250);
        setTimeout(hideModeLoader, 900);
        return;
      }
      if (e.target.closest('.right-sidebar-tab')) {
        aside.classList.toggle('open');
      }
    });
    document.addEventListener('click', e => {
      if (!aside.classList.contains('open')) return;
      if (!e.target.closest('.right-sidebar')) aside.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') aside.classList.remove('open');
    });
  }

  /* First-visit intro splash (home only, once per session, two slides).
     Markup is in index.html so it paints in the first frame.
     Click a dot → pause on that slide. Tap elsewhere → toggle pause/resume. */
  /* Set this flag from any "Home" link so the next /home load shows the splash again */
  document.querySelectorAll('a[href="/"], a[href="/#home"]').forEach(a => {
    a.addEventListener('click', () => {
      try { sessionStorage.setItem('force-intro', '1'); } catch (_) {}
    });
  });

  const splash = document.getElementById('intro-splash');
  if (splash) {
    const forceIntro = sessionStorage.getItem('force-intro') === '1';
    if (forceIntro) sessionStorage.removeItem('force-intro');  // consume the one-shot flag

    const firstVisit = !sessionStorage.getItem('intro-seen');
    const shouldShow = (path === '/') && (firstVisit || forceIntro);

    if (!shouldShow) {
      splash.remove();
    } else {
      sessionStorage.setItem('intro-seen', '1');
      document.body.style.overflow = 'hidden';

      /* Single-slide splash — show slide 1 only, no Welcome second slide. */
      const schedule = [
        { at: 2400, fn: () => splash.classList.add('leaving') },
        { at: 2750, fn: () => { splash.remove(); document.body.style.overflow = ''; } },
      ];
      let timers = [];
      let startedAt = performance.now();
      let elapsed = 0;
      let paused = false;
      let autoResumeTimer = null;
      let countdownTimer = null;
      const AUTO_RESUME_MS = 5000;

      function runFrom(offset) {
        timers = schedule
          .filter(s => s.at > offset)
          .map(s => setTimeout(s.fn, s.at - offset));
      }
      function clearAutoResume() {
        clearTimeout(autoResumeTimer);
        clearInterval(countdownTimer);
        splash.removeAttribute('data-countdown');
      }
      function startAutoResume() {
        clearAutoResume();
        let secondsLeft = Math.ceil(AUTO_RESUME_MS / 1000);
        splash.dataset.countdown = secondsLeft;
        countdownTimer = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft <= 0) clearInterval(countdownTimer);
          else splash.dataset.countdown = secondsLeft;
        }, 1000);
        autoResumeTimer = setTimeout(resume, AUTO_RESUME_MS);
      }
      function pause() {
        if (!paused) {
          paused = true;
          elapsed += performance.now() - startedAt;
          timers.forEach(clearTimeout);
          splash.classList.add('paused');
        }
        // (Re)start the 3s auto-resume countdown
        startAutoResume();
      }
      function resume() {
        clearAutoResume();
        if (!paused) return;
        paused = false;
        splash.classList.remove('paused');
        startedAt = performance.now();
        runFrom(elapsed);
      }

      runFrom(0);

      /* Dot click → jump to that slide AND pause */
      splash.querySelectorAll('.intro-dot').forEach((dot, i) => {
        dot.addEventListener('click', e => {
          e.stopPropagation();
          // Cancel timers and jump to this slide
          timers.forEach(clearTimeout);
          if (i === 0) splash.classList.remove('show-2');
          else splash.classList.add('show-2');
          paused = false;
          // Treat current time as start of this slide so resume continues from here
          startedAt = performance.now();
          elapsed = i === 0 ? 0 : 2800;
          pause();
        });
      });

      /* Tap anywhere else → toggle pause/resume */
      splash.addEventListener('click', () => {
        if (!document.body.contains(splash)) return;
        paused ? resume() : pause();
      });
    }
  }

  /* Mode-switch loader overlay (DM logo spinner) */
  function ensureModeLoader() {
    let el = document.querySelector('.mode-loader');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'mode-loader';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="mode-loader-card">
        <div class="mode-loader-ring"></div>
        <img class="mode-loader-logo" src="/image copy 3.png" alt="" />
        <div class="mode-loader-text">Switching view…</div>
      </div>
    `;
    document.body.appendChild(el);
    return el;
  }
  function showModeLoader(label) {
    const el = ensureModeLoader();
    const txt = el.querySelector('.mode-loader-text');
    if (txt && label) txt.textContent = label;
    requestAnimationFrame(() => el.classList.add('active'));
  }
  function hideModeLoader() {
    const el = document.querySelector('.mode-loader');
    if (el) el.classList.remove('active');
  }

  function updateTabText(mode) {
    const tab = document.querySelector('.right-sidebar-tab-text');
    if (!tab) return;
    tab.textContent = mode === 'engineer' ? 'ENGINEER'
                    : mode === 'freelance' ? 'FREELANCER'
                    : 'VIEW AS';
  }

  /* Clone nav into the left sidebar so mobile drawer shows the menu */
  function buildSidebarNav() {
    const sidebarEl = document.querySelector('.sidebar');
    if (!sidebarEl || sidebarEl.querySelector('.sidebar-nav') || !navList) return;
    const nav = document.createElement('nav');
    nav.className = 'sidebar-nav';
    nav.innerHTML = navList.outerHTML;
    const divider = sidebarEl.querySelector('.sidebar-divider');
    if (divider) divider.parentNode.insertBefore(nav, divider);
    else sidebarEl.insertBefore(nav, sidebarEl.firstChild);
  }

  tagNavItems();
  buildCategoryToggle();
  buildSidebarNav();
  applyMode(getStoredMode());

  /* CTA tiles on home set the mode before navigating */
  document.querySelectorAll('[data-set-mode]').forEach(el => {
    el.addEventListener('click', () => {
      setStoredMode(el.dataset.setMode);
    });
  });

  /* ---------- Instant nav: lightweight prefetch on hover/focus only.
     Removed the EAGER speculation prefetch + idle batch prefetch because they
     were flooding the network with 8 background page requests on every load,
     hurting the actual current page's load time.
     Moderate-eagerness prerender stays — it only fires on real user intent. */
  try {
    if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
      const sr = document.createElement('script');
      sr.type = 'speculationrules';
      sr.textContent = JSON.stringify({
        prerender: [{
          source: 'document',
          where: { and: [
            { href_matches: '/*' },
            { not: { href_matches: '/*\\?*' } }
          ]},
          eagerness: 'moderate'
        }]
      });
      document.head.appendChild(sr);
    }
  } catch (_) {}

  const prefetched = new Set();
  function prefetch(href) {
    if (!href || prefetched.has(href) || href.startsWith('#')) return;
    prefetched.add(href);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  }
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => prefetch(link.href), { passive: true });
    link.addEventListener('touchstart', () => prefetch(link.href), { passive: true });
    link.addEventListener('focus', () => prefetch(link.href));
  });

  /* ---------- Sidebar toggle (mobile) ---------- */
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  function toggleSidebar() {
    if (!sidebar) return;
    sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  }
  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  /* Close sidebar when clicking any nav link (mobile) */
  document.querySelectorAll('.navbar a, .sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('active')) toggleSidebar();
    });
  });

  /* ---------- Section-container scroll shadow ---------- */
  document.querySelectorAll('.section-container').forEach(container => {
    container.addEventListener('scroll', () => {
      container.style.boxShadow = container.scrollTop > 0
        ? '0 8px 32px rgba(0,0,0,0.3)'
        : '0 8px 32px rgba(0,0,0,0.25)';
    });
  });

  /* ---------- Contact form (placeholder) ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for your message! (This is a placeholder alert.)');
      contactForm.reset();
    });
  }

  /* ---------- Lightbox / portfolio modal ---------- */
  const portfolioModal = document.getElementById('portfolio-modal');
  const portfolioModalImg = document.getElementById('portfolio-modal-img');
  const portfolioModalTitle = document.getElementById('portfolio-modal-title');
  const portfolioModalDesc = document.getElementById('portfolio-modal-desc');
  const portfolioModalClose = document.querySelector('.portfolio-modal-close');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');
  const modalDownloadBtn = document.getElementById('modal-download');

  let currentZoom = 1;
  const zoomStep = 0.5;
  const maxZoom = 4;
  const minZoom = 1;
  let previouslyFocused = null;

  function openPortfolioModal(src, alt, title, desc, downloadName) {
    if (!portfolioModal || !portfolioModalImg) return;
    portfolioModalImg.src = src;
    portfolioModalImg.alt = alt || '';
    if (portfolioModalTitle) portfolioModalTitle.textContent = title || '';
    if (portfolioModalDesc) portfolioModalDesc.textContent = desc || '';
    if (modalDownloadBtn) {
      modalDownloadBtn.href = src;
      modalDownloadBtn.download = downloadName || (title || 'image').replace(/[^a-zA-Z0-9]/g, '_') + '.png';
    }
    currentZoom = 1;
    portfolioModalImg.style.transform = 'scale(1)';
    portfolioModalImg.classList.remove('zoomed');
    portfolioModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (portfolioModalClose) portfolioModalClose.focus();
  }
  function closePortfolioModal() {
    if (!portfolioModal) return;
    portfolioModal.classList.remove('active');
    document.body.style.overflow = '';
    currentZoom = 1;
    if (portfolioModalImg) {
      portfolioModalImg.style.transform = 'scale(1)';
      portfolioModalImg.classList.remove('zoomed');
    }
    if (previouslyFocused) previouslyFocused.focus();
  }

  /* Click portfolio items / rate card / featured tile to open lightbox */
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function (e) {
      // Don't intercept if the item itself is an <a> wanting a normal nav
      const tag = this.tagName.toLowerCase();
      if (tag === 'a') e.preventDefault();
      previouslyFocused = document.activeElement;
      const img = this.querySelector('img');
      const title = this.querySelector('.portfolio-item-overlay h3')?.textContent
                 || this.dataset.title
                 || 'Portfolio Item';
      const desc  = this.querySelector('.portfolio-item-overlay p')?.textContent
                 || this.dataset.desc
                 || '';
      if (img) openPortfolioModal(img.src, img.alt, title, desc);
    });
  });

  if (portfolioModalClose) portfolioModalClose.addEventListener('click', closePortfolioModal);
  if (portfolioModal) {
    portfolioModal.addEventListener('click', function (e) {
      if (e.target === portfolioModal) closePortfolioModal();
    });
    portfolioModal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = portfolioModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && portfolioModal && portfolioModal.classList.contains('active')) {
      closePortfolioModal();
    }
  });

  /* Zoom controls */
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => {
    if (currentZoom < maxZoom) {
      currentZoom += zoomStep;
      portfolioModalImg.style.transform = `scale(${currentZoom})`;
      portfolioModalImg.classList.add('zoomed');
    }
  });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > minZoom) {
      currentZoom -= zoomStep;
      if (currentZoom <= minZoom) {
        currentZoom = minZoom;
        portfolioModalImg.classList.remove('zoomed');
      }
      portfolioModalImg.style.transform = `scale(${currentZoom})`;
    }
  });
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => {
    currentZoom = 1;
    if (portfolioModalImg) {
      portfolioModalImg.style.transform = 'scale(1)';
      portfolioModalImg.classList.remove('zoomed');
    }
  });
  if (portfolioModalImg) {
    portfolioModalImg.addEventListener('dblclick', () => {
      if (currentZoom === 1) {
        currentZoom = 2;
        portfolioModalImg.style.transform = 'scale(2)';
        portfolioModalImg.classList.add('zoomed');
      } else {
        currentZoom = 1;
        portfolioModalImg.style.transform = 'scale(1)';
        portfolioModalImg.classList.remove('zoomed');
      }
    });
    portfolioModalImg.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (e.deltaY < 0 && currentZoom < maxZoom) {
        currentZoom += 0.1;
        portfolioModalImg.style.transform = `scale(${currentZoom})`;
        portfolioModalImg.classList.add('zoomed');
      } else if (e.deltaY > 0 && currentZoom > minZoom) {
        currentZoom -= 0.1;
        if (currentZoom <= minZoom) {
          currentZoom = minZoom;
          portfolioModalImg.classList.remove('zoomed');
        }
        portfolioModalImg.style.transform = `scale(${currentZoom})`;
      }
    }, { passive: false });
  }

  /* ---------- Legacy rate card (services page, old markup) ---------- */
  const rateCardImage = document.querySelector('.rate-card-image');
  if (rateCardImage) {
    rateCardImage.addEventListener('click', function () {
      openPortfolioModal(this.src, this.alt, 'Rate Card', 'Web Design & Development Rate Card', 'Brian_Kiboi_Rate_Card.png');
    });
    const rateOverlay = document.querySelector('.rate-card-overlay');
    if (rateOverlay) rateOverlay.addEventListener('click', () => rateCardImage.click());
    const rateContainer = document.querySelector('.rate-card-container');
    if (rateContainer) rateContainer.addEventListener('click', () => rateCardImage.click());
  }

  /* ---------- Payment modals (M-Pesa / PayPal) ---------- */
  const paymentTriggers = document.querySelectorAll('[data-modal-target]');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-button');

  paymentTriggers.forEach(option => {
    option.addEventListener('click', () => {
      const modalId = option.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'block';
    });
  });
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  window.addEventListener('click', (event) => {
    modals.forEach(modal => {
      if (event.target === modal) modal.style.display = 'none';
    });
  });

  /* ---------- Portfolio filter chips ---------- */
  const filterButtons = document.querySelectorAll('.portfolio-categories button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  /* Inject filler tiles to round out the current row so no empty cells remain.
     Runs after every filter change and on window resize. */
  const FILLER_SUBS = [
    'Mobile · Full-Stack Engineer',
    'Nairobi · Remote-first',
    'DM Solution Tech',
    'A short visual journey',
    'briankiboi.is-a.dev',
    'Built by DM Solution Tech',
  ];
  function fillEmptyCells() {
    document.querySelectorAll('.portfolio-grid').forEach(grid => {
      // wipe previous auto-fillers
      grid.querySelectorAll('.portfolio-filler-auto').forEach(n => n.remove());

      // read column count from computed grid template
      const cols = getComputedStyle(grid)
        .gridTemplateColumns.split(' ').filter(Boolean).length || 1;

      const visibleCount = [...grid.children].filter(c => {
        if (c.style.display === 'none') return false;
        if (c.classList.contains('portfolio-filler-auto')) return false;
        return true;
      }).length;

      if (visibleCount === 0) return;
      const remainder = visibleCount % cols;
      const needed = remainder === 0 ? 0 : cols - remainder;
      for (let i = 0; i < needed; i++) {
        const el = document.createElement('div');
        el.className = 'portfolio-item portfolio-filler portfolio-filler-auto'
          + (i % 2 ? ' portfolio-filler-alt' : '');
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML =
          '<span class="portfolio-filler-dot"></span>' +
          '<span class="portfolio-filler-text">briankiboi.is-a.dev</span>' +
          '<span class="portfolio-filler-sub">' + FILLER_SUBS[i % FILLER_SUBS.length] + '</span>';
        grid.appendChild(el);
      }
    });
  }

  function applyFilter(filterValue) {
    portfolioItems.forEach(item => {
      // Brand-filler tiles are decorative — always show them regardless of filter
      const isFiller = item.classList.contains('portfolio-filler');
      if (isFiller || filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });
    fillEmptyCells();
  }

  /* Auto-apply default filter on page load (uses the .active button) */
  document.querySelectorAll('.portfolio-categories').forEach(group => {
    const activeBtn = group.querySelector('button.active') || group.querySelector('button');
    if (activeBtn) applyFilter(activeBtn.getAttribute('data-filter'));
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const group = button.closest('.portfolio-categories');
      if (group) group.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filterValue = button.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const isFiller = item.classList.contains('portfolio-filler');
        if (isFiller || filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 0);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
      /* Allow the fade-out 300ms to finish before recalculating fillers */
      setTimeout(fillEmptyCells, 320);
    });
  });

  /* Re-balance fillers on resize (debounced) */
  let __fillResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(__fillResizeTimer);
    __fillResizeTimer = setTimeout(fillEmptyCells, 150);
  });

  /* ---------- Scroll-to-top button ---------- */
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    document.querySelectorAll('.section-container').forEach(container => {
      container.addEventListener('scroll', () => {
        if (container.scrollTop > 300) scrollToTopBtn.classList.add('visible');
        else scrollToTopBtn.classList.remove('visible');
      });
    });
    scrollToTopBtn.addEventListener('click', () => {
      const container = document.querySelector('.section-container');
      if (container) {
        container.style.scrollBehavior = 'smooth';
        container.scrollTop = 0;
        setTimeout(() => { container.style.scrollBehavior = 'auto'; }, 500);
      }
    });
  }

  /* ---------- Custom cursor (desktop only — touch devices skip) ---------- */
  const cursorDot = document.querySelector('[data-cursor-dot]');
  const cursorOutline = document.querySelector('[data-cursor-outline]');
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (cursorDot && cursorOutline && hasFinePointer) {
    window.addEventListener('mousemove', function (e) {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top  = `${posY}px`;
      cursorOutline.animate({
        left: `${posX}px`,
        top:  `${posY}px`,
      }, { duration: 500, fill: 'forwards' });
    });

    const interactives = document.querySelectorAll('a, button, .portfolio-item, .service-card, .skill-card, .payment-option');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-hover');
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.borderColor = 'var(--accent-color)';
        cursorOutline.style.backgroundColor = 'rgba(255, 214, 0, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-hover');
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--accent-color)';
        cursorOutline.style.backgroundColor = 'transparent';
      });
    });
  }

  /* ---------- Home tap: instant domain splash, then navigate ---------- */
  const currentPathHome = window.location.pathname.replace(/\/$/, '') || '/';
  if (currentPathHome !== '/') {
    document.querySelectorAll('a[href="/"]').forEach(link => {
      link.addEventListener('click', function(e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();

        const splash = document.createElement('div');
        splash.className = 'domain-splash domain-splash-instant';
        splash.innerHTML =
          '<div class="domain-splash-content">' +
            '<span class="domain-splash-text">briankiboi.is-a.dev</span>' +
          '</div>';
        document.body.appendChild(splash);

        try { sessionStorage.setItem('home-splash-played', '1'); } catch (_) {}

        document.documentElement.classList.add('show-domain-splash');

        setTimeout(function() {
          window.location.href = '/';
        }, 1400);
      });
    });
  }
});
