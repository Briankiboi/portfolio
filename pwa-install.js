(function () {
  'use strict';

  var installEvent;
  var dismissedUntil = Number(localStorage.getItem('portfolio-install-dismissed-until-v2') || 0);
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone || dismissedUntil > Date.now()) return;

  var style = document.createElement('style');
  style.textContent = '#portfolio-install-prompt{position:fixed;right:16px;bottom:16px;z-index:200;display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:12px;width:min(380px,56vw);padding:16px 14px 16px 16px;border:1px solid #dbe2ee;border-radius:12px;background:#fff;color:#172033;box-shadow:0 14px 34px rgba(15,23,42,.24);font:14px/1.35 system-ui,sans-serif}#portfolio-install-prompt .portfolio-install-mark{display:grid;place-items:center;width:48px;height:48px;border-radius:10px;background:#eef2ff;overflow:hidden}#portfolio-install-prompt .portfolio-install-mark img{width:100%;height:100%;object-fit:cover}#portfolio-install-prompt .portfolio-install-copy{display:grid;gap:3px;min-width:0}#portfolio-install-prompt .portfolio-install-copy strong{font-size:14px;color:#111827}#portfolio-install-prompt .portfolio-install-copy span{color:#64748b;font-size:12px}#portfolio-install-prompt button{font:inherit;cursor:pointer}#portfolio-install-prompt .portfolio-install-actions{display:flex;gap:8px;grid-column:2 / 4}#portfolio-install-prompt .portfolio-install-action,#portfolio-install-prompt .portfolio-install-later{border:0;border-radius:7px;padding:7px 13px;font-weight:700}#portfolio-install-prompt .portfolio-install-action{background:#2447c6;color:#fff}#portfolio-install-prompt .portfolio-install-later{background:#f1f5f9;color:#475569}#portfolio-install-prompt .portfolio-install-close{position:absolute;right:10px;top:8px;border:0;background:transparent;color:#94a3b8;font-size:20px;line-height:1;padding:0 2px}@media(max-width:560px){#portfolio-install-prompt{right:10px;bottom:10px;width:56vw}}';
  document.head.appendChild(style);
  var compactStyle = document.createElement('style');
  compactStyle.textContent = '#portfolio-install-prompt{width:min(300px,56vw);padding:10px 10px 10px 12px;gap:8px;font-size:12px}#portfolio-install-prompt .portfolio-install-mark{width:38px;height:38px;border-radius:8px}#portfolio-install-prompt .portfolio-install-copy{gap:2px}#portfolio-install-prompt .portfolio-install-copy strong{font-size:12px}#portfolio-install-prompt .portfolio-install-copy span{font-size:10px}#portfolio-install-prompt .portfolio-install-actions{gap:6px}#portfolio-install-prompt .portfolio-install-action,#portfolio-install-prompt .portfolio-install-later{padding:6px 9px;font-size:11px}';
  document.head.appendChild(compactStyle);

  function showPrompt() {
    if (!installEvent || document.getElementById('portfolio-install-prompt')) return;
    var prompt = document.createElement('aside');
    prompt.id = 'portfolio-install-prompt';
    prompt.innerHTML = '<button type="button" class="portfolio-install-close" aria-label="Dismiss install prompt">&times;</button>' +
      '<div class="portfolio-install-mark"><img src="/icon-192.png" alt=""></div>' +
      '<div class="portfolio-install-copy"><strong>Install Brian Kiboi Portfolio</strong><span>Install the portfolio for quick access and contact links.</span></div>' +
      '<div class="portfolio-install-actions"><button type="button" class="portfolio-install-action">Install App</button><button type="button" class="portfolio-install-later">Not Now</button></div>';
    document.body.appendChild(prompt);
    prompt.querySelector('.portfolio-install-close').addEventListener('click', function () {
      localStorage.setItem('portfolio-install-dismissed-until-v2', String(Date.now() + 86400000));
      prompt.remove();
    });
    prompt.querySelector('.portfolio-install-later').addEventListener('click', function () {
      localStorage.setItem('portfolio-install-dismissed-until-v2', String(Date.now() + 86400000));
      prompt.remove();
    });
    prompt.querySelector('.portfolio-install-action').addEventListener('click', function () {
      installEvent.prompt();
      installEvent.userChoice.finally(function () { prompt.remove(); installEvent = null; });
    });
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installEvent = event;
    setTimeout(showPrompt, 2200);
  });
  window.addEventListener('appinstalled', function () {
    installEvent = null;
    var prompt = document.getElementById('portfolio-install-prompt');
    if (prompt) prompt.remove();
  });
})();