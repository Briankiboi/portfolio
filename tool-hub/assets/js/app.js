/* ════════════════════════════════════════════════════════════════════
   DM Solution Technologies Toolkits · Shared App Library (app.js)
   Loaded by every tool page + the hub. Fully offline, no dependencies
   except Alpine.js (CDN, degrades gracefully without it).
   ════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const FAV_STORAGE_KEY = 'dm_solution_tools_favorites';
    const USAGE_STORAGE_KEY = 'dm_tool_usage';

    /* ── DOM helpers ─────────────────────────────────────────────────── */
    const $  = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    /* ── Escape HTML ─────────────────────────────────────────────────── */
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* ── Toast ───────────────────────────────────────────────────────── */
    let toastEl, toastTimer;
    function toast(msg, type = 'ok') {
        if (!toastEl) {
            toastEl = $('#app-toast');
            if (toastEl) {
                toastEl.innerHTML = '<span></span>';
            } else {
                toastEl = document.createElement('div');
                toastEl.id = 'app-toast';
                toastEl.innerHTML = '<span></span>';
                document.body.appendChild(toastEl);
            }
        }
        toastEl.className = 'toast show ' + type;
        toastEl.querySelector('span').textContent = msg;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
    }

    /* ── Download helper ─────────────────────────────────────────────── */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 900);
        toast('Downloading ' + filename);
    }
    function downloadDataUrl(dataUrl, filename) {
        const a = document.createElement('a');
        a.href = dataUrl; a.download = filename;
        document.body.appendChild(a); a.click();
        setTimeout(() => a.remove(), 900);
        toast('Downloading ' + filename);
    }

    /* ── File reader helpers ─────────────────────────────────────────── */
    function readFileAsDataURL(file) {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = () => rej(r.error || new Error('read failed'));
            r.readAsDataURL(file);
        });
    }
    function readFileAsText(file) {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = () => rej(r.error || new Error('read failed'));
            r.readAsText(file);
        });
    }

    /* ── Copy to clipboard with fallback ─────────────────────────────── */
    async function copyText(text, btn = null) {
        const old = btn ? btn.innerHTML : null;
        try { await navigator.clipboard.writeText(text); }
        catch (e) {
            const ta = document.createElement('textarea');
            ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); } catch (_) {}
            ta.remove();
        }
        if (btn) {
            btn.innerHTML = '✓ Copied!';
            setTimeout(() => { if (old) btn.innerHTML = old; }, 1500);
        }
        toast('Copied to clipboard');
    }

    /* ── Formatting helpers ──────────────────────────────────────────── */
    const fmt = {
        num(n, d = 0) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); },
        bytes(b, d = 2) {
            if (b == null || isNaN(b)) return '—';
            if (b === 0) return '0 B';
            const u = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), u.length - 1);
            return (b / Math.pow(1024, i)).toFixed(i === 0 ? 0 : d) + ' ' + u[i];
        },
        date(ts, m = {}) {
            return new Date(ts).toLocaleDateString('en-GB', Object.assign({ day: '2-digit', month: 'short', year: 'numeric' }, m));
        },
        time(ts) { return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); },
        rel(ts) {
            const s = (Date.now() - new Date(ts)) / 1000;
            if (s < 45) return 'just now';
            if (s < 3600) return Math.floor(s / 60) + 'm ago';
            if (s < 86400) return Math.floor(s / 3600) + 'h ago';
            return Math.floor(s / 86400) + 'd ago';
        }
    };

    /* ── URL utils ───────────────────────────────────────────────────── */
    function isHttpUrl(s) {
        try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; }
        catch (e) { return false; }
    }

    /* ── Favorites (Saved) — localStorage ────────────────────────────── */
    function getFavorites() {
        try { return JSON.parse(localStorage.getItem(FAV_STORAGE_KEY)) || []; }
        catch (e) { return []; }
    }
    function isFavorite(key) { return getFavorites().includes(key); }
    function toggleFavorite(key) {
        let favs = getFavorites();
        const on = favs.includes(key);
        favs = on ? favs.filter(k => k !== key) : favs.concat(key);
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favs));
        if (window.refreshFavoriteButtons) window.refreshFavoriteButtons();
        toast(on ? 'Removed from Saved' : 'Saved ⭐');
    }

    /* ── Personal usage (your most-used tools) — localStorage ────────── */
    function getUsage() {
        try { return JSON.parse(localStorage.getItem(USAGE_STORAGE_KEY)) || {}; }
        catch (e) { return {}; }
    }
    function saveUsage(map) { try { localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(map)); } catch (e) {} }
    function bumpUsage(key) {
        if (!key) return;
        const m = getUsage();
        m[key] = (m[key] || 0) + 1;
        saveUsage(m);
    }

    /* ── Tool page scaffolding ───────────────────────────────────────── */
    function toolPageInit(rawKey) {
        const toolKey = String(rawKey || '').replace(/_/g, '-');
        bumpUsage(toolKey);
        $$('[data-fav]').forEach(btn => {
            btn.addEventListener('click', () => toggleFavorite(toolKey));
            btn.classList.toggle('is-fav', isFavorite(toolKey));
        });
        /* Set page title / description meta if overridden */
        const cm = $('#page-meta-title');
        if (cm && cm.dataset.title) document.title = cm.dataset.title;
        /* Dark-mode toggle */
        const dbtn = $('#dark-toggle');
        if (dbtn) dbtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            toast(document.documentElement.classList.contains('dark') ? 'Dark mode on' : 'Light mode on');
        });
        /* footer year */
        $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
        window.toolKey = toolKey;
    }

    /* ── Hub grid helpers (used on index.html) ───────────────────────── */
    const CATEGORY_META = {
        dev:      { icon: 'fa-solid fa-laptop-code', label: 'Dev & Code',     grad: 'from-blue-600 to-indigo-600' },
        seo:      { icon: 'fa-solid fa-magnifying-glass-chart', label: 'SEO & Search',   grad: 'from-emerald-600 to-teal-600' },
        business: { icon: 'fa-solid fa-briefcase',  label: 'Business',       grad: 'from-amber-500 to-orange-600' },
        image:    { icon: 'fa-solid fa-palette',    label: 'Images',         grad: 'from-purple-600 to-fuchsia-600' },
        pdf:      { icon: 'fa-solid fa-file-pdf',   label: 'PDF',            grad: 'from-rose-600 to-pink-600' },
        security: { icon: 'fa-solid fa-shield-halved', label: 'Security & SSL', grad: 'from-red-600 to-rose-600' },
        domain:   { icon: 'fa-solid fa-globe',      label: 'Domains & DNS',  grad: 'from-cyan-600 to-sky-600' },
        network:  { icon: 'fa-solid fa-network-wired', label: 'Network',     grad: 'from-slate-700 to-gray-800' },
        media:    { icon: 'fa-solid fa-clapperboard', label: 'Video & Audio', grad: 'from-violet-600 to-purple-700' },
        general:  { icon: 'fa-solid fa-wand-magic-sparkles', label: 'General', grad: 'from-gray-500 to-slate-600' }
    };

    const CAT_GLOW = {
        dev:      'rgba(100,116,139,.35)',
        seo:      'rgba(16,185,129,.35)',
        business: 'rgba(245,158,11,.35)',
        image:    'rgba(236,72,153,.35)',
        pdf:      'rgba(239,68,68,.35)',
        security: 'rgba(34,197,94,.35)',
        domain:   'rgba(14,165,233,.35)',
        network:  'rgba(15,118,110,.35)',
        media:    'rgba(148,163,184,.35)',
        general:  'rgba(249,115,22,.35)'
    };

    function categoryLabel(cat) { return (CATEGORY_META[cat] && CATEGORY_META[cat].label) || cat; }

    /* ── Hub (landing page) ─────────────────────────────────────────── */
    const hubState = { q: '', cat: 'all', saved: false, data: [], usage: {} };

    function cardHtml(t, featured) {
        const icon = t.icon || '🛠️';
        const iconHtml = icon.indexOf('fa-') === 0 ? '<i class="' + esc(icon) + '" aria-hidden="true"></i>' : icon;
        const cat = t.category_label || categoryLabel(t.category);
        const mine = hubState.usage[t.key] || 0;
        const uses = mine > 0 ? mine : (t.usage_count == null ? 0 : t.usage_count);
        const cls = 'cat-' + esc(t.category);
        const fav = isFavorite(t.key);
        return '<a class="card' + (featured ? ' is-featured' : '') + '" href="' + esc(t.url) + '" data-key="' + esc(t.key) + '" data-category="' + esc(t.category) + '">'
            + (featured ? '<span class="ribbon">Popular</span>' : '')
            + '<button type="button" class="card-fav' + (fav ? ' is-fav' : '') + '" data-fav="' + esc(t.key) + '" title="' + (fav ? 'Remove from favorites' : 'Save to favorites') + '" aria-label="' + (fav ? 'Remove from favorites' : 'Save to favorites') + '" aria-pressed="' + (fav ? 'true' : 'false') + '">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="' + (fav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
            + '</button>'
            + '<span class="card-top">'
            + '<span class="icon-tile ' + cls + '" aria-hidden="true">' + iconHtml + '</span>'
            + '<span class="card-cat ' + cls + '">' + esc(cat) + '</span>'
            + '</span>'
            + '<h3>' + esc(t.name) + '</h3>'
            + '<p>' + esc(t.desc) + '</p>'
            + '<span class="card-foot">'
            +   '<span class="uses"><b>' + fmt.num(uses) + '</b> uses</span>'
            +   '<span class="card-go">Open tool <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>'
            + '</span>'
            + '</a>';
    }

    function wireCards(scope, animate) {
        (scope || document).querySelectorAll('.card').forEach((card, i) => {
            if (animate !== false) {
                card.classList.add('reveal');
                setTimeout(() => card.classList.add('shown'), i * 45);
            } else {
                card.classList.add('shown');
            }
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
            });
            var favBtn = card.querySelector('.card-fav');
            if (favBtn) {
                favBtn.addEventListener('mousedown', function (e) { e.stopPropagation(); });
                favBtn.addEventListener('keydown', function (e) { e.stopPropagation(); });
                favBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var key = favBtn.getAttribute('data-fav');
                    toggleFavorite(key);
                    renderHub(true);
                });
            }
        });
    }

    function buildFeatured() {
        const row = $('#featured-tools');
        if (!row) return;
        const top = hubState.data.slice().sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0)).slice(0, 4);
        if (!top.length) { row.style.display = 'none'; return; }
        row.innerHTML = top.map(t => cardHtml(t, true)).join('');
        wireCards(row);
    }

    function buildCategoryCards() {
        const grid = $('#category-cards');
        if (!grid) return;
        const cats = [];
        const order = Object.keys(CATEGORY_META);
        for (const t of hubState.data) {
            if (!cats.includes(t.category)) cats.push(t.category);
        }
        cats.sort((a, b) => order.indexOf(a) - order.indexOf(b));
        grid.innerHTML = cats.map(c => {
            const meta = CATEGORY_META[c] || { icon: '🧰', label: c };
            const count = hubState.data.filter(t => t.category === c).length;
            return '<a href="#tools" class="cat-tile cat-' + esc(c) + '" data-cat="' + esc(c) + '">'
                + '<span class="cat-tile-glow" style="background:radial-gradient(circle,' + (CAT_GLOW[c] || 'rgba(255,194,0,.4)') + ',transparent 70%)"></span>'
                + '<span class="cat-tile-ico cat-' + esc(c) + '">' + (meta.icon.indexOf('fa-') === 0 ? '<i class="' + esc(meta.icon) + '" aria-hidden="true"></i>' : meta.icon) + '</span>'
                + '<span class="cat-tile-name">' + esc(meta.label) + '</span>'
                + '<span class="cat-tile-meta"><b>' + count + '</b> tool' + (count === 1 ? '' : 's') + ' &middot; Explore <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>'
                + '</a>';
        }).join('');
        $$('.cat-tile', grid).forEach(tile => tile.addEventListener('click', e => {
            e.preventDefault();
            setCategory(tile.dataset.cat);
            const anchor = $('#tools');
            if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
        }));
    }

    function setCategory(cat) {
        hubState.saved = false;
        hubState.cat = cat || 'all';
        renderHub();
    }

    function buildChips() {
        const holder = $('#category-chips');
        if (!holder) return;
        const cats = [];
        for (const t of hubState.data) {
            if (!cats.includes(t.category)) cats.push(t.category);
        }
        cats.sort((a, b) => {
            const ia = CATEGORY_META[a] ? Object.keys(CATEGORY_META).indexOf(a) : 99;
            const ib = CATEGORY_META[b] ? Object.keys(CATEGORY_META).indexOf(b) : 99;
            return ia - ib;
        });
        const chips = ['all'].concat(cats).concat(['saved']);
        holder.innerHTML = chips.map(c => {
            if (c === 'saved') {
                const count = getFavorites().filter(k => hubState.data.some(t => t.key === k)).length;
                return '<button type="button" class="chip saved-chip' + (hubState.saved ? ' active' : '') + '" data-cat="saved" title="Show your saved tools" aria-pressed="' + (hubState.saved ? 'true' : 'false') + '">'
                    + '<i class="fa-solid fa-star" aria-hidden="true"></i>'
                    + '<span class="chip-label">Saved</span>'
                    + '<span class="chip-count">' + count + '</span></button>';
            }
            const count = c === 'all' ? hubState.data.length : hubState.data.filter(t => t.category === c).length;
            const label = c === 'all' ? 'All tools' : categoryLabel(c);
            const icon = c === 'all' ? 'fa-solid fa-layer-group' : (CATEGORY_META[c] && CATEGORY_META[c].icon);
            return '<button type="button" class="chip' + (hubState.cat === c && !hubState.saved ? ' active' : '') + '" data-cat="' + esc(c) + '" title="Show ' + esc(label) + '">'
                + (icon ? '<i class="' + esc(icon) + '" aria-hidden="true"></i>' : '')
                + '<span class="chip-label">' + esc(label) + '</span>'
                + '<span class="chip-count">' + count + '</span></button>';
        }).join('');
        $$('.chip', holder).forEach(ch => ch.addEventListener('click', () => {
            if (ch.dataset.cat === 'saved') {
                hubState.saved = !hubState.saved;
            } else {
                hubState.cat = ch.dataset.cat;
                hubState.saved = false;
            }
            renderHub();
        }));
    }

    function filteredTools() {
        const q = hubState.q.trim().toLowerCase();
        let list = hubState.data;
        if (hubState.cat !== 'all') list = list.filter(t => t.category === hubState.cat);
        if (hubState.saved) {
            const favs = getFavorites();
            list = list.filter(t => favs.includes(t.key));
        }
        if (q) {
            list = list.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.desc.toLowerCase().includes(q) ||
                (t.category_label || '').toLowerCase().includes(q) ||
                (t.key || '').toLowerCase().includes(q)
            );
        }
        const favs = getFavorites();
        list = list.slice().sort((a, b) => {
            const fa = favs.includes(a.key) ? 1 : 0;
            const fb = favs.includes(b.key) ? 1 : 0;
            if (fa !== fb) return fb - fa;
            const ua = hubState.usage[a.key] || a.usage_count || 0;
            const ub = hubState.usage[b.key] || b.usage_count || 0;
            return ub - ua;
        });
        return list;
    }

    function renderHub(silent) {
        const grid = $('#tools-grid');
        const heroCounter = $('#tool-count-hero');
        const list = filteredTools();
        if (grid) {
            const emptyMsg = hubState.saved
                ? 'No Saved tools yet — open any tool page and hit the ⭐ to add it here.'
                : 'No tools match your search.';
            grid.innerHTML = list.map(t => cardHtml(t)).join('') || '<p class="tool-empty">' + emptyMsg + '</p>';
            if (list.length) wireCards(grid, silent ? false : true);
        }
        if (heroCounter) heroCounter.textContent = hubState.data.length;
        buildChips();
    }

    function toggleSavedView() {
        hubState.saved = !hubState.saved;
        renderHub();
    }

    function hubEnhance() {
        const input = $('#tool-search-input');
        const clear = $('#search-clear');
        const backToTop = $('#back-to-top');

        if (backToTop) {
            const onScroll = () => backToTop.classList.toggle('show', (window.pageYOffset || document.documentElement.scrollTop) > 460);
            window.addEventListener('scroll', onScroll, { passive: true });
            backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }

        if (clear && input) {
            clear.addEventListener('click', () => {
                input.value = '';
                hubState.q = '';
                renderHub();
                input.focus();
            });
            input.addEventListener('input', () => clear.classList.toggle('show', input.value.length > 0));
        }

        if (input) {
            document.addEventListener('keydown', e => {
                const tag = (e.target.tagName || '').toLowerCase();
                if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.metaKey && !e.ctrlKey && !e.altKey) {
                    e.preventDefault();
                    input.focus();
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        $$('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count || '0', 10) || 0;
            const suffix = el.dataset.suffix || '';
            const run = () => {
                const dur = 1100;
                const t0 = performance.now();
                const step = now => {
                    const p = Math.min((now - t0) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = fmt.num(Math.round(target * eased)) + suffix;
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            };
            if ('IntersectionObserver' in window) {
                const io = new IntersectionObserver(entries => {
                    entries.forEach(en => { if (en.isIntersecting) { run(); io.disconnect(); } });
                }, { threshold: .4 });
                io.observe(el);
            } else {
                run();
            }
        });

        $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    }

    function hubInit(data) {
        hubState.data = (data || []).slice();
        hubState.usage = getUsage();
        /* Sort so the user's most-used tools come first; static popularity
           is the tie-break (and the fallback for tools never opened). */
        hubState.data.sort((a, b) => {
            const pa = hubState.usage[a.key] || 0;
            const pb = hubState.usage[b.key] || 0;
            if (pb !== pa) return pb - pa;
            return (b.usage_count || 0) - (a.usage_count || 0);
        });
        buildFeatured();
        buildCategoryCards();
        const input = $('#tool-search-input');
        if (input) {
            input.addEventListener('input', () => { hubState.q = input.value; renderHub(); });
            input.addEventListener('keyup', e => { if (e.key === 'Enter') renderHub(); });
        }
        renderHub();
        hubEnhance();
    }

    window.refreshFavoriteButtons = function () { renderHub(); };
    window.toggleSavedView = toggleSavedView;
    window.setCategory = setCategory;
    window.hubInit = hubInit;

    /* Expose */
    window.ToolsApp = {
        $, $$, esc, toast, downloadBlob, downloadDataUrl, readFileAsDataURL, readFileAsText,
        copyText, fmt, isHttpUrl, getFavorites, isFavorite, toggleFavorite,
        getUsage, bumpUsage,
        toolPageInit, categoryLabel, CATEGORY_META, hubInit
    };

    /* Auto-init */
    document.addEventListener('DOMContentLoaded', () => {
        if (window.renderSiteHeader) window.renderSiteHeader();
        if (window.renderSiteSearch) window.renderSiteSearch();
        if (window.attachHeroSearch) window.attachHeroSearch();
        if (window.TOOL_CATALOG && $('#tools-grid')) {
            if (window.hubInit) window.hubInit(window.TOOL_CATALOG);
        }
    });
})();
