// Brian Kiboi Portfolio — Install App (PWA) prompt
// MOBILE ONLY. A small, non-intrusive bottom bar shown once, after a delay.
// Captures beforeinstallprompt; falls back to "Add to Home Screen" help on iOS.
(function () {
  if (!('serviceWorker' in navigator)) return;

  // --- mobile-only gate ---------------------------------------------------
  var ua = navigator.userAgent;
  var isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(ua);
  var isSmall = window.matchMedia('(max-width: 820px)').matches;
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!((isMobileUA && isSmall) || (isTouch && isSmall))) return; // never show on desktop

  // already installed / standalone → do nothing
  var standalone = window.matchMedia('(display-mode: standalone)').matches ||
                   window.navigator.standalone === true;
  if (standalone) return;

  // don't nag: honour a 7-day dismissal
  var DISMISS_KEY = 'bk-install-dismissed-at';
  try {
    var d = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
    if (d && Date.now() - d < 7 * 24 * 60 * 60 * 1000) return;
  } catch (e) {}

  var deferredPrompt = null;
  var installed = false;

  var STYLE = document.createElement('style');
  STYLE.textContent = [
    '#bk-install-app{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:1200;max-width:360px;margin:0 auto;background:rgba(11,15,36,.96);border:1px solid rgba(145,94,255,.28);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.45);padding:8px 8px 8px 10px;display:flex;align-items:center;gap:9px;transform:translateY(140%);opacity:0;transition:transform .4s cubic-bezier(.2,.9,.25,1),opacity .3s ease;font-family:Poppins,"Segoe UI",Arial,sans-serif;color:#fff;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
    '#bk-install-app.open{transform:translateY(0);opacity:1}',
    '#bk-install-app .bk-icon{width:38px;height:38px;flex:0 0 38px;border-radius:10px;overflow:hidden;background:#915EFF}',
    '#bk-install-app .bk-icon img{width:100%;height:100%;object-fit:cover;display:block}',
    '#bk-install-app .bk-text{flex:1;min-width:0;line-height:1.25}',
    '#bk-install-app .bk-title{font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#bk-install-app .bk-sub{font-size:10.5px;color:#AAA6C3;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#bk-install-app .bk-install{flex:0 0 auto;border:0;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;background:linear-gradient(90deg,#00CEA8,#BF61FF);color:#050816}',
    '#bk-install-app .bk-close{flex:0 0 auto;background:none;border:0;color:#AAA6C3;font-size:17px;line-height:1;padding:4px 6px;cursor:pointer}'
  ].join('\n');
  document.head.appendChild(STYLE);

  var el = null;
  function build() {
    if (el) return el;
    el = document.createElement('div');
    el.id = 'bk-install-app';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Install Brian Kiboi Portfolio app');
    el.innerHTML =
      '<div class="bk-icon"><img src="/icon-512.png" alt="" width="38" height="38"></div>' +
      '<div class="bk-text">' +
      '  <div class="bk-title" id="bk-title">Install the app</div>' +
      '  <div class="bk-sub" id="bk-sub">Quick access from your home screen</div>' +
      '</div>' +
      '<button class="bk-install" type="button" id="bk-install-cta">Install</button>' +
      '<button class="bk-close" type="button" id="bk-close" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(el);
    document.getElementById('bk-close').addEventListener('click', dismiss);
    document.getElementById('bk-install-cta').addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
      } else {
        // iOS Safari has no native prompt — switch to instructions
        document.getElementById('bk-title').textContent = 'Add to Home Screen';
        document.getElementById('bk-sub').textContent = 'Share ↑  →  “Add to Home Screen”';
        document.getElementById('bk-install-cta').textContent = 'Got it';
        document.getElementById('bk-install-cta').onclick = dismiss;
      }
    });
    return el;
  }
  function show() { if (el && !installed) el.classList.add('open'); }
  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
    if (el) el.classList.remove('open');
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    build();
    setTimeout(show, 6000);   // subtle: wait before appearing
  });

  window.addEventListener('appinstalled', function () {
    installed = true;
    deferredPrompt = null;
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
    if (el) el.classList.remove('open');
  });

  // iOS Safari: no beforeinstallprompt — offer Add-to-Home-Screen help, once
  if (/iphone|ipad|ipod/i.test(ua)) {
    window.addEventListener('load', function () {
      setTimeout(function () { build(); show(); }, 8000);
    });
  }
})();