(function () {
  'use strict';

  var installEvent;
  var dismissedUntil = Number(localStorage.getItem('dm-tools-install-dismissed-until') || 0);
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone || dismissedUntil > Date.now()) return;

  var style = document.createElement('style');
  style.textContent = '#dm-tools-install-prompt{position:fixed;right:16px;bottom:16px;z-index:200;display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:12px;width:min(380px,56vw);padding:16px 14px 16px 16px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#17201f;box-shadow:0 14px 34px rgba(15,23,42,.2);font:14px/1.35 Inter,system-ui,sans-serif}#dm-tools-install-prompt .dm-tools-install-mark{display:grid;place-items:center;width:48px;height:48px;border-radius:10px;background:#eef2ff;overflow:hidden}#dm-tools-install-prompt .dm-tools-install-mark img{width:100%;height:100%;object-fit:cover}#dm-tools-install-prompt .dm-tools-install-copy{display:grid;gap:3px;min-width:0}#dm-tools-install-prompt .dm-tools-install-copy strong{font-size:14px;color:#111827}#dm-tools-install-prompt .dm-tools-install-copy span{color:#64748b;font-size:12px}#dm-tools-install-prompt button{font:inherit;cursor:pointer}#dm-tools-install-prompt .dm-tools-install-actions{display:flex;gap:8px;grid-column:2 / 4}#dm-tools-install-prompt .dm-tools-install-action,#dm-tools-install-prompt .dm-tools-install-later{border:0;border-radius:7px;padding:7px 13px;font-weight:700}#dm-tools-install-prompt .dm-tools-install-action{background:#2447c6;color:#fff}#dm-tools-install-prompt .dm-tools-install-later{background:#f1f5f9;color:#475569}#dm-tools-install-prompt .dm-tools-install-close{position:absolute;right:10px;top:8px;border:0;background:transparent;color:#94a3b8;font-size:20px;line-height:1;padding:0 2px}@media(max-width:560px){#dm-tools-install-prompt{right:10px;bottom:10px;width:56vw}}';
  document.head.appendChild(style);
  var compactStyle = document.createElement('style');
  compactStyle.textContent = '#dm-tools-install-prompt{width:min(300px,56vw);padding:10px 10px 10px 12px;gap:8px;font-size:12px}#dm-tools-install-prompt .dm-tools-install-mark{width:38px;height:38px;border-radius:8px}#dm-tools-install-prompt .dm-tools-install-copy{gap:2px}#dm-tools-install-prompt .dm-tools-install-copy strong{font-size:12px}#dm-tools-install-prompt .dm-tools-install-copy span{font-size:10px}#dm-tools-install-prompt .dm-tools-install-actions{gap:6px}#dm-tools-install-prompt .dm-tools-install-action,#dm-tools-install-prompt .dm-tools-install-later{padding:6px 9px;font-size:11px}';
  document.head.appendChild(compactStyle);

  function showPrompt() {
    if (!installEvent || document.getElementById('dm-tools-install-prompt')) return;
    var prompt = document.createElement('aside');
    prompt.id = 'dm-tools-install-prompt';
    prompt.innerHTML = '<button type="button" class="dm-tools-install-close" aria-label="Dismiss install prompt">&times;</button>' +
      '<div class="dm-tools-install-mark"><img src="assets/icon-install.svg?v=3" alt=""></div>' +
      '<div class="dm-tools-install-copy"><strong>Install DM Solutions Free Tools</strong><span>Install our app for quick access, offline tools, and a faster experience.</span></div>' +
      '<div class="dm-tools-install-actions"><button type="button" class="dm-tools-install-action">Install App</button><button type="button" class="dm-tools-install-later">Not Now</button></div>';
    document.body.appendChild(prompt);

    var close = prompt.querySelector('.dm-tools-install-close');
    var action = prompt.querySelector('.dm-tools-install-action');
    close.addEventListener('click', function () {
      localStorage.setItem('dm-tools-install-dismissed-until', String(Date.now() + 86400000));
      prompt.remove();
    });
    prompt.querySelector('.dm-tools-install-later').addEventListener('click', function () {
      localStorage.setItem('dm-tools-install-dismissed-until', String(Date.now() + 86400000));
      prompt.remove();
    });
    action.addEventListener('click', function () {
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
    var prompt = document.getElementById('dm-tools-install-prompt');
    if (prompt) prompt.remove();
  });
})();
