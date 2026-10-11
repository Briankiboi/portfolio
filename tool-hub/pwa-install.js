(function () {
  'use strict';

  var installEvent;
  var dismissedUntil = Number(localStorage.getItem('dm-tools-install-dismissed-until') || 0);
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone || dismissedUntil > Date.now()) return;

  var isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;

  var style = document.createElement('style');
  style.textContent = 
    '#dm-tools-install-prompt {' +
      'position: fixed;' +
      'left: 16px;' +
      'bottom: 18px;' +
      'right: auto;' +
      'z-index: 950;' +
      'display: flex;' +
      'align-items: center;' +
      'gap: 9px;' +
      'background: #ffffff;' +
      'color: #0f172a;' +
      'padding: 6px 10px 6px 8px;' +
      'border-radius: 999px;' +
      'border: 1px solid #e2e8f0;' +
      'box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);' +
      'font: 13px/1.3 Inter, system-ui, -apple-system, sans-serif;' +
      'max-width: calc(100vw - 94px);' +
      'box-sizing: border-box;' +
      'animation: dmPromptFadeIn 0.3s ease-out;' +
    '}' +
    '@keyframes dmPromptFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }' +
    '#dm-tools-install-prompt .dm-tools-install-mark {' +
      'width: 32px;' +
      'height: 32px;' +
      'border-radius: 50%;' +
      'background: #0f172a;' +
      'display: flex;' +
      'align-items: center;' +
      'justify-content: center;' +
      'overflow: hidden;' +
      'flex-shrink: 0;' +
    '}' +
    '#dm-tools-install-prompt .dm-tools-install-mark img { width: 100%; height: 100%; object-fit: cover; }' +
    '#dm-tools-install-prompt .dm-tools-install-copy {' +
      'display: flex;' +
      'flex-direction: column;' +
      'min-width: 0;' +
      'line-height: 1.2;' +
    '}' +
    '#dm-tools-install-prompt .dm-tools-install-copy strong {' +
      'font-size: 12px;' +
      'color: #0f172a;' +
      'white-space: nowrap;' +
      'overflow: hidden;' +
      'text-overflow: ellipsis;' +
    '}' +
    '#dm-tools-install-prompt .dm-tools-install-copy span {' +
      'font-size: 10.5px;' +
      'color: #64748b;' +
      'white-space: nowrap;' +
      'overflow: hidden;' +
      'text-overflow: ellipsis;' +
    '}' +
    '#dm-tools-install-prompt .dm-tools-install-action {' +
      'border: 0;' +
      'background: #2563eb;' +
      'color: #ffffff;' +
      'border-radius: 999px;' +
      'padding: 6px 12px;' +
      'font-size: 11.5px;' +
      'font-weight: 600;' +
      'cursor: pointer;' +
      'white-space: nowrap;' +
      'flex-shrink: 0;' +
      'margin-left: 2px;' +
    '}' +
    '#dm-tools-install-prompt .dm-tools-install-action:hover { background: #1d4ed8; }' +
    '#dm-tools-install-prompt .dm-tools-install-close {' +
      'border: 0;' +
      'background: transparent;' +
      'color: #94a3b8;' +
      'font-size: 18px;' +
      'line-height: 1;' +
      'padding: 2px 4px;' +
      'cursor: pointer;' +
      'flex-shrink: 0;' +
    '}' +
    '#dm-tools-install-prompt .dm-tools-install-close:hover { color: #475569; }' +
    '#dm-tools-install-prompt .dm-ios-tip {' +
      'position: absolute;' +
      'bottom: calc(100% + 10px);' +
      'left: 0;' +
      'width: 250px;' +
      'background: #0f172a;' +
      'color: #f8fafc;' +
      'padding: 10px 12px;' +
      'border-radius: 10px;' +
      'font-size: 11.5px;' +
      'line-height: 1.4;' +
      'box-shadow: 0 10px 25px rgba(0,0,0,0.3);' +
      'z-index: 960;' +
    '}' +
    '#dm-tools-install-prompt .dm-ios-tip::after {' +
      'content: "";' +
      'position: absolute;' +
      'bottom: -6px;' +
      'left: 22px;' +
      'border-width: 6px 6px 0;' +
      'border-style: solid;' +
      'border-color: #0f172a transparent;' +
    '}';
  document.head.appendChild(style);

  function showPrompt() {
    if (document.getElementById('dm-tools-install-prompt')) return;
    var prompt = document.createElement('aside');
    prompt.id = 'dm-tools-install-prompt';
    prompt.setAttribute('role', 'dialog');
    prompt.setAttribute('aria-label', 'Install App');
    prompt.innerHTML = 
      '<div class="dm-tools-install-mark"><img src="assets/icon-install.svg?v=3" alt=""></div>' +
      '<div class="dm-tools-install-copy"><strong>Install DM Tools</strong><span>Free Offline Web App</span></div>' +
      '<button type="button" class="dm-tools-install-action">Install</button>' +
      '<button type="button" class="dm-tools-install-close" aria-label="Dismiss">&times;</button>' +
      '<div class="dm-ios-tip" style="display:none;">Tap Safari\'s <strong>Share</strong> button <svg style="display:inline-block;vertical-align:middle;margin:0 2px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> below, then select <strong>Add to Home Screen</strong> ⊞</div>';
    document.body.appendChild(prompt);

    var close = prompt.querySelector('.dm-tools-install-close');
    var action = prompt.querySelector('.dm-tools-install-action');
    var iosTip = prompt.querySelector('.dm-ios-tip');

    close.addEventListener('click', function () {
      localStorage.setItem('dm-tools-install-dismissed-until', String(Date.now() + 86400000));
      prompt.remove();
    });

    action.addEventListener('click', function () {
      if (installEvent) {
        installEvent.prompt();
        installEvent.userChoice.finally(function () {
          prompt.remove();
          installEvent = null;
        });
      } else if (isIos) {
        iosTip.style.display = iosTip.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // 1. Android & Desktop Chrome/Edge event
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installEvent = event;
    setTimeout(showPrompt, 2000);
  });

  // 2. iOS Safari (Apple does not support beforeinstallprompt; show clean instructions)
  if (isIos) {
    setTimeout(showPrompt, 2500);
  }

  window.addEventListener('appinstalled', function () {
    installEvent = null;
    var prompt = document.getElementById('dm-tools-install-prompt');
    if (prompt) prompt.remove();
  });
})();
