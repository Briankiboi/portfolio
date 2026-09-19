/* ════════════════════════════════════════════════════════════════════
   Shared Tool Search — animated suggestions powered by TOOL_CATALOG.
   - renderSiteSearch(): injects the search widget into
     <div id="hub-tool-search"> (tool pages).
   - attachHeroSearch(): wires the same suggestion dropdown onto an existing
     input (landing-page hero search) without replacing its markup.
   Requires: catalog.js (window.TOOL_CATALOG), site-search.css.
   ════════════════════════════════════════════════════════════════════ */
window.SiteSearch = (function () {
    'use strict';

    var CAT = (window.TOOL_CATALOG || []).slice().sort(function (a, b) {
        return (b.usage_count || 0) - (a.usage_count || 0);
    });
    var MAX = 8;

    function $(id) { return document.getElementById(id); }
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    /* search filter — name match first, then usage popularity */
    function filter(q) {
        var lq = (q || '').trim().toLowerCase();
        var list = lq ? CAT.filter(function (t) {
            return (t.name || '').toLowerCase().indexOf(lq) !== -1
                || (t.desc || '').toLowerCase().indexOf(lq) !== -1
                || (t.category_label || '').toLowerCase().indexOf(lq) !== -1
                || (t.key || '').toLowerCase().indexOf(lq) !== -1;
        }) : CAT.slice();
        if (lq) {
            list.sort(function (a, b) {
                var aN = a.name.toLowerCase().indexOf(lq); if (aN === -1) aN = 999;
                var bN = b.name.toLowerCase().indexOf(lq); if (bN === -1) bN = 999;
                if (aN !== bN) return aN - bN;
                return (b.usage_count || 0) - (a.usage_count || 0);
            });
        }
        return list.slice(0, MAX);
    }

    function itemHtml(t, q, idx) {
        var nm = t.name;
        var lq = (q || '').trim();
        if (lq) nm = nm.replace(new RegExp('(' + escRe(lq) + ')', 'gi'), '<mark>$1</mark>');
        return '<button class="tss-item tool-search-item" data-url="' + esc(t.url) + '" data-idx="' + idx + '" role="option">'
            + '<span class="tss-ico"><i class="' + esc(t.icon || 'fa-solid fa-wrench') + '" aria-hidden="true"></i></span>'
            + '<span class="tss-meta">'
            +   '<span class="tss-name">' + nm + '</span>'
            +   '<span class="tss-desc">' + esc(t.desc || '') + '</span>'
            + '</span>'
            + '<span class="tss-cat">' + esc(t.category_label || '') + '</span>'
            + '<span class="tss-open-ic"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>'
            + '</button>';
    }
    function emptyHtml(q) {
        return '<div class="tool-search-empty"><i class="fa-solid fa-magnifying-glass" style="font-size:.75rem;color:#98a29d"></i>No tools match "<b>' + esc(q) + '</b>". Try QR, receipt, DNS…</div>';
    }

    /* Core wiring: cfg { input, clear, drop, items, openShortcut } */
    function wire(cfg) {
        var input = cfg.input, clear = cfg.clear, drop = cfg.drop, items = cfg.items;
        var cur = -1, timer = null;

        function open(q) {
            var list = filter(q);
            items.innerHTML = list.length ? list.map(function (t, i) { return itemHtml(t, q, i); }).join('') : emptyHtml(q);
            cur = list.length ? 0 : -1;
            renderCur();
            drop.classList.add('open');
        }
        function close() { drop.classList.remove('open'); cur = -1; }
        function renderCur() {
            items.querySelectorAll('.tss-item').forEach(function (b, i) { b.classList.toggle('cur', i === cur); });
        }
        function navigate() {
            var b = items.querySelectorAll('.tss-item')[Math.max(cur, 0)];
            if (b) window.location.href = b.getAttribute('data-url');
        }

        input.addEventListener('input', function () {
            if (clear) clear.classList.toggle('show', input.value.length > 0);
            clearTimeout(timer);
            timer = setTimeout(function () { open(input.value.trim()); }, 80);
        });
        input.addEventListener('focus', function () { open(input.value.trim()); });
        input.addEventListener('keydown', function (e) {
            var n = items.querySelectorAll('.tss-item').length;
            if (e.key === 'ArrowDown') { e.preventDefault(); cur = n ? (cur + 1) % n : -1; renderCur(); }
            else if (e.key === 'ArrowUp')   { e.preventDefault(); cur = n ? (cur - 1 + n) % n : -1; renderCur(); }
            else if (e.key === 'Enter')     { e.preventDefault(); navigate(); }
            else if (e.key === 'Escape')    { input.blur(); close(); }
        });
        items.addEventListener('click', function (e) {
            var b = e.target.closest('.tss-item');
            if (b) window.location.href = b.getAttribute('data-url');
        });
        if (clear) {
            clear.addEventListener('click', function () {
                input.value = '';
                clear.classList.remove('show');
                open('');
                input.focus();
            });
        }
        document.addEventListener('click', function (e) {
            if (!drop.contains(e.target)
                && !input.contains(e.target)
                && (!clear || !clear.contains(e.target))) close();
        });
        if (cfg.openShortcut) {
            document.addEventListener('keydown', function (e) {
                var tag = (e.target.tagName || '').toLowerCase();
                if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.metaKey && !e.ctrlKey && !e.altKey) {
                    e.preventDefault(); input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
        return { close: close };
    }

    return {
        filter: filter,
        esc: esc,
        itemHtml: itemHtml,
        wire: wire
    };
})();

/* Widget injection (tool pages) */
window.renderSiteSearch = (function () {
    'use strict';
    function $(id) { return document.getElementById(id); }
    return function () {
        var slot = $('hub-tool-search');
        if (!slot) return;
        var CAT = (window.TOOL_CATALOG || []);
        slot.outerHTML =
            '<div class="tool-search" id="tss">'
            + '<div class="tool-search-box" id="tss-box">'
            +   '<svg class="tool-search-ico" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
            +   '<input type="text" id="tss-input" class="tool-search-input" placeholder="Search ' + CAT.length + ' tools — QR, DNS, invoice, WebP…" aria-label="Search tools" autocomplete="off" spellcheck="false">'
            +   '<button type="button" id="tss-clear" class="tool-search-clear" aria-label="Clear search"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
            +   '<span class="tool-search-kbd" id="tss-kbd">/</span>'
            + '</div>'
            + '<div class="tool-search-drop" id="tss-drop" role="listbox"><div id="tss-items"></div></div>'
            + '</div>';
        window.SiteSearch.wire({
            input: $('tss-input'),
            clear: $('tss-clear'),
            drop:  $('tss-drop'),
            items: $('tss-items'),
            openShortcut: true
        });
    };
})();

/* Landing page hero: attach dropdown to existing #tool-search-input */
window.attachHeroSearch = (function () {
    'use strict';
    function $(id) { return document.getElementById(id); }
    return function () {
        var input = $('tool-search-input');
        if (!input) return;
        var shell = input.closest('.hub-search') || input.parentElement;
        var drop = document.createElement('div');
        drop.className = 'tool-search-drop';
        drop.setAttribute('role', 'listbox');
        drop.innerHTML = '<div id="hero-tss-items"></div>';
        shell.appendChild(drop);
        window.SiteSearch.wire({
            input: input,
            clear: $('search-clear'),
            drop:  drop,
            items: $('hero-tss-items'),
            openShortcut: false
        });
    };
})();