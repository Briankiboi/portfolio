/* Brian Kiboi Portfolio — multi-page JS
   No SPA. Each page loads its own HTML.
   Handles: nav active state, sidebar toggle, modals, portfolio filter,
   lightbox, scroll-to-top, custom cursor. */

/* Sidebar toggle — delegated at document level so taps register even if a
   child SVG/path is the actual target, and so it works without waiting for
   DOMContentLoaded. */
(function () {
  function toggle() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar) return;
    const willOpen = !sidebar.classList.contains('active');
    sidebar.classList.toggle('active', willOpen);
    if (overlay) overlay.classList.toggle('active', willOpen);
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }
  function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar || !sidebar.classList.contains('active')) return;
    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    const toggleBtn = e.target.closest('.sidebar-toggle');
    if (toggleBtn) { e.preventDefault(); toggle(); return; }
    const overlay = e.target.closest('.sidebar-overlay');
    if (overlay) { toggle(); return; }
    /* Book-a-call tapped from the open sidebar drawer: close the drawer so
       the Calendly popup gets a clean full-screen overlay. The inline
       onclick on .sidebar-book-cta opens Calendly first; this fires next
       in the bubble phase and slides the drawer shut. */
    if (e.target.closest('.sidebar-book-cta')) {
      closeSidebar();
    }
  });
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Active nav link based on current URL ---------- */
  const navLinks = document.querySelectorAll('.navbar a');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) link.classList.add('active');
    else link.classList.remove('active');
  });

  /* ---------- Prefetch internal pages so navigation feels instant ----------
     Two-stage: eagerly prefetch the main nav routes once the browser is
     idle (works for mobile too, since it doesn't need hover), and also
     prefetch any other same-origin link on first hover / touchstart. */
  const prefetched = new Set();
  function prefetchLink(href) {
    if (!href || prefetched.has(href)) return;
    if (!href.startsWith('/') && !href.startsWith(location.origin)) return;
    prefetched.add(href);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    l.as = 'document';
    document.head.appendChild(l);
  }
  function isInternal(href) {
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    return href.startsWith('/') || href.startsWith(location.origin);
  }
  // Stage 1: eager prefetch of all primary nav routes on idle so mobile
  // (no hover) and quick clicks still get a warm cache.
  const idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 200); };
  idle(() => {
    const seen = new Set();
    document.querySelectorAll('.navbar a, .sidebar-nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (!isInternal(href)) return;
      if (seen.has(href)) return;
      seen.add(href);
      prefetchLink(href);
    });
  });
  // Stage 2: prefetch any other internal link on first hover / touchstart.
  document.querySelectorAll('a[href^="/"], .navbar a, .sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!isInternal(href)) return;
    a.addEventListener('mouseenter', () => prefetchLink(href), { once: true, passive: true });
    a.addEventListener('touchstart',  () => prefetchLink(href), { once: true, passive: true });
  });

  /* ---------- Category toggle: Engineer / Freelance ----------
     Engineer view (hiring path): everything including CV/Resume.
     Freelance view (project path): hides CV/Resume (clients want
     portfolio + services, not a resume). About/Services and Gallery
     stay visible in both because services and credentials matter for
     both audiences. */
  const CATEGORY_PATHS = {
    engineer:  ['/', '/about', '/portfolio', '/resume', '/gallery', '/contact'],
    freelance: ['/', '/about', '/portfolio', '/gallery', '/contact'],
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

    /* Mark splash as done — adds html.intro-skip so the CSS rule that hides
       the navbar + sidebar-toggle during splash flips off, restoring the
       nav UI automatically when the splash finishes. */
    function markIntroDone() {
      document.documentElement.classList.add('intro-skip');
    }

    if (!shouldShow) {
      splash.remove();
      markIntroDone();
    } else {
      sessionStorage.setItem('intro-seen', '1');
      // Do NOT lock body scroll — the user should be able to scroll the
      // content underneath while the splash plays. Any scroll/key/click
      // also dismisses the splash immediately (see listener below).

      /* Two-slide splash: brand intro → typewriter "briankiboi.is-a.dev" + "Welcome." */
      const schedule = [
        { at: 4500, fn: () => splash.classList.add('show-2') },
        { at: 9000, fn: () => splash.classList.add('leaving') },
        { at: 10100, fn: () => { splash.remove(); markIntroDone(); } },
      ];

      function dismissSplashNow() {
        if (!document.body.contains(splash)) return;
        timers.forEach(clearTimeout);
        splash.classList.add('leaving');
        setTimeout(() => {
          if (document.body.contains(splash)) splash.remove();
          markIntroDone();
        }, 350);
      }
      // Any scroll/wheel/touchmove/keydown/click on the page dismisses the
      // splash so the user can interact with the page right away.
      ['scroll', 'wheel', 'touchmove', 'keydown'].forEach(evt => {
        window.addEventListener(evt, dismissSplashNow, { once: true, passive: true });
      });
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
          elapsed = i === 0 ? 0 : 2400;
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

  /* Hide the floating VIEW AS tab when the page footer is in view so it
     doesn't visually compete with the footer's social row. */
  (function () {
    const aside = document.querySelector('.right-sidebar');
    const footer = document.querySelector('.home-footer');
    if (!aside || !footer || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) aside.classList.toggle('hide-at-footer', e.isIntersecting);
      },
      { rootMargin: '0px 0px -20% 0px' }
    );
    io.observe(footer);
  })();

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

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => prefetchLink(link.href), { passive: true });
    link.addEventListener('touchstart', () => prefetchLink(link.href), { passive: true });
    link.addEventListener('focus', () => prefetchLink(link.href));
  });

  /* ---------- Sidebar: close on nav link tap (mobile) ----------
     The open/close toggle itself is wired at document level near the top of
     this file so it works even before DOMContentLoaded fires. */
  const sidebar = document.querySelector('.sidebar');
  document.querySelectorAll('.navbar a, .sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('active')) {
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  /* ---------- Section-container scroll shadow (rAF-throttled) ---------- */
  document.querySelectorAll('.section-container').forEach(container => {
    let ticking = false;
    container.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        container.style.boxShadow = container.scrollTop > 0
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(0,0,0,0.25)';
        ticking = false;
      });
    }, { passive: true });
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

  function applyFilter(filterValue) {
    portfolioItems.forEach(item => {
      if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });
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
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
        }
      });
    });
  });

  /* ---------- Scroll-to-top button (rAF-throttled) ---------- */
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    document.querySelectorAll('.section-container').forEach(container => {
      let ticking = false;
      container.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          if (container.scrollTop > 300) scrollToTopBtn.classList.add('visible');
          else scrollToTopBtn.classList.remove('visible');
          ticking = false;
        });
      }, { passive: true });
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
    /* rAF-throttle: capture latest mouse coords, apply once per frame. */
    let latestX = 0, latestY = 0, cursorTicking = false;
    window.addEventListener('mousemove', function (e) {
      latestX = e.clientX;
      latestY = e.clientY;
      if (cursorTicking) return;
      cursorTicking = true;
      requestAnimationFrame(() => {
        cursorDot.style.left = `${latestX}px`;
        cursorDot.style.top  = `${latestY}px`;
        cursorOutline.animate({
          left: `${latestX}px`,
          top:  `${latestY}px`,
        }, { duration: 500, fill: 'forwards' });
        cursorTicking = false;
      });
    }, { passive: true });

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

  /* ---------- Home / Contact tap: instant domain splash, then navigate ---------- */
  const currentPathTap = window.location.pathname.replace(/\/$/, '') || '/';
  function attachDomainSplash(selector, target) {
    document.querySelectorAll(selector).forEach(link => {
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

        if (target === '/') {
          try { sessionStorage.setItem('home-splash-played', '1'); } catch (_) {}
        }

        document.documentElement.classList.add('show-domain-splash');

        setTimeout(function() {
          window.location.href = target;
        }, 1400);
      });
    });
  }
  if (currentPathTap !== '/')        attachDomainSplash('a[href="/"]', '/');
  if (currentPathTap !== '/contact') attachDomainSplash('a[href="/contact/"], a[href="/contact"]', '/contact/');
});

// ===== PWA: register service worker; let Chrome show its native install banner =====
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
  // NOTE: we intentionally do NOT call e.preventDefault() on beforeinstallprompt.
  // Chrome's native top install banner (matches the SWP Security style) shows on
  // its own once engagement criteria are met. Calling preventDefault() would
  // suppress it.
})();
