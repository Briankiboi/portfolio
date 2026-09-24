/* ════════════════════════════════════════════════════════════════════
   Shared Site Header (portfolio navbar) — single source of truth.
   Mirrors the landing-page sticky header exactly (dark glass bar,
   gold highlight, portfolio tabs, contact icons, mobile drawer + scroll
   hide-on-scroll). Any page with:
       <div id="hub-header-slot" data-root="../"></div>
   gets the full header injected by app.js's DOMContentLoaded hook.
   Works offline (no fetch) and without Alpine.
   ════════════════════════════════════════════════════════════════════ */
window.renderSiteHeader = (function () {
    'use strict';

    /* icons extracted verbatim from the landing page */
    var ICON = ["<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"44\" height=\"44\" viewBox=\"0 0 24 24\"><rect width=\"24\" height=\"24\" rx=\"4\" fill=\"#1E88E5\"/><path d=\"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z\" fill=\"#fff\"/></svg>", "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"44\" height=\"44\" viewBox=\"0 0 32 32\" fill=\"none\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z\" fill=\"#BFC8D0\"/><path d=\"M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z\" fill=\"url(#paint0_linear_87_7264)\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z\" fill=\"white\"/><path d=\"M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z\" fill=\"white\"/><defs><linearGradient id=\"paint0_linear_87_7264\" x1=\"26.5\" y1=\"7\" x2=\"4\" y2=\"28\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#5BD066\"/><stop offset=\"1\" stop-color=\"#27B43E\"/></linearGradient></defs></svg>", "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"44\" height=\"44\" aria-label=\"Gmail\" role=\"img\" viewBox=\"0 0 512 512\" fill=\"#000000\"><rect width=\"512\" height=\"512\" rx=\"15%\" fill=\"#ffffff\"/><path d=\"M158 391v-142l-82-63V361q0 30 30 30\" fill=\"#4285f4\"/><path d=\"M 154 248l102 77l102-77v-98l-102 77l-102-77\" fill=\"#ea4335\"/><path d=\"M354 391v-142l82-63V361q0 30-30 30\" fill=\"#34a853\"/><path d=\"M76 188l82 63v-98l-30-23c-27-21-52 0-52 26\" fill=\"#c5221f\"/><path d=\"M436 188l-82 63v-98l30-23c27-21 52 0 52 26\" fill=\"#fbbc04\"/></svg>"];

    var TABS = [
        ['/',                    'Portfolio'],
        ['/#svc-rate-section',   'Rate Card'],
        ['/#projects',           'Projects'],
        ['/#services',           'My Services'],
        ['/#contact',            'Contact']
    ];

    var DRAWER_LINKS = [
        ['/#about',       'About Me'],
        ['/#tech-stack',  'Tech Stack'],
        ['/#work',        'Experience'],
        ['/#projects',    'Projects'],
        ['/#services',    'Services'],
        ['/#contact',     'Contact']
    ];

    function icon(i, size) {
        return ICON[i].replace(/width=["']\d+["']/, 'width="' + size + '"')
                      .replace(/height=["']\d+["']/, 'height="' + size + '"');
    }

    function iconAnchors(size) {
        return '<a href="tel:+254112401838" aria-label="Call" class="nav-soc-link">' + icon(0, size) + '</a>'
             + '<a href="https://wa.me/254112401838" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp" class="nav-soc-link">' + icon(1, size) + '</a>'
             + '<a href="mailto:briankiboi83@gmail.com" aria-label="Email" class="nav-soc-link">' + icon(2, size) + '</a>';
    }

    function renderHeader(root) {
        var tabs = TABS.map(function (t) {
            return '<li class="hub-pt-tab-item"><a href="' + t[0] + '" class="nav-tab">' + t[1] + '</a></li>';
        }).join('');
        var drawer = DRAWER_LINKS.map(function (t) {
            return '<a href="' + t[0] + '" class="hub-drawer-link">' + t[1] + '</a>';
        }).join('');
        var menuSvg = '<svg class="hub-burger-open" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
        var closeSvg = '<svg class="hub-burger-close" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';

        return '<nav class="site-nav hub-pt-nav" id="hub-pt-nav" aria-label="Main navigation">'
            + '<div class="hub-container hub-nav-inner hub-pt-nav-inner">'
            +   '<a href="' + root + 'index.html" class="hub-pt-title" title="Back to all tools">'
            +     '<img src="' + root + 'assets/icon-512.png" alt="DM Solutions Tech logo" class="hub-pt-logo" width="38" height="38">'
            +     '<span class="hub-pt-name">DM <span class="hub-pt-hl">Solutions</span> Tech</span>'
            +   '</a>'
            +   '<div class="nav-tab-soc hub-pt-tab-soc">'
            +     '<ul class="hub-pt-tabs">' + tabs + '</ul>'
            +     '<div class="hub-pt-socs">' + iconAnchors(44) + '</div>'
            +     '<div class="hub-pt-mob">'
            +       '<div class="nav-mob-socs">' + iconAnchors(34) + '</div>'
            +       '<button type="button" class="nav-burger" id="hub-burger" aria-label="Toggle navigation menu" aria-expanded="false">' + menuSvg + closeSvg + '</button>'
            +     '</div>'
            +   '</div>'
            + '</div>'
            + '</nav>'
            + '<div class="mob-overlay" id="hub-overlay" aria-hidden="true"></div>'
            + '<aside class="mob-sidebar" id="hub-sidebar" aria-label="Menu" aria-hidden="true"><div class="mob-sidebar-head">'
            +   '<span class="mob-sidebar-title">Menu</span>'
            +   '<button type="button" class="mob-sidebar-close" id="hub-close" aria-label="Close">✕</button>'
            + '</div>'
            + '<nav class="sidebar-nav">' + drawer + '</nav>'
            + '<div class="sidebar-divider" role="separator" aria-hidden="true"></div>'
            + '<div class="sidebar-socials">' + iconAnchors(30) + '</div>'
            + '<div class="mob-sidebar-foot">DM Solutions Tech &middot; Free Tools Hub</div>'
            + '</aside>';
    }

    function wire() {
        var nav    = document.getElementById('hub-pt-nav');
        var burger = document.getElementById('hub-burger');
        var overlay= document.getElementById('hub-overlay');
        var sidebar= document.getElementById('hub-sidebar');
        var close  = document.getElementById('hub-close');

        function setOpen(open) {
            if (!sidebar) return;
            sidebar.classList.toggle('active', open);
            overlay && overlay.classList.toggle('active', open);
            sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
            overlay && overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (burger) {
                burger.setAttribute('aria-expanded', open ? 'true' : 'false');
                var o = burger.querySelector('.hub-burger-open');
                var c = burger.querySelector('.hub-burger-close');
                if (o) o.style.display = open ? 'none' : 'block';
                if (c) c.style.display = open ? 'block' : 'none';
            }
        }

        if (burger)  burger.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(sidebar && !sidebar.classList.contains('active'));
        });
        if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
        if (close)   close.addEventListener('click', function () { setOpen(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

        if (nav) {
            var lastY = window.pageYOffset || document.documentElement.scrollTop;
            var timer = null;
            var setHidden = function (h) { nav.classList.toggle('is-nav-hidden', h); };
            window.addEventListener('scroll', function () {
                var y = window.pageYOffset || document.documentElement.scrollTop;
                nav.classList.toggle('is-scrolled', y > 100);
                var dy = y - lastY;
                lastY = y;
                clearTimeout(timer);
                var doc = document.documentElement;
                var nearBottom = y + window.innerHeight >= doc.scrollHeight - 12;
                if (nearBottom) { setHidden(true); return; }
                if (y <= 120) { setHidden(false); }
                else if (dy > 3) {
                    setHidden(true);
                } else if (dy < 0) {
                    setHidden(false);
                    timer = setTimeout(function () { setHidden(false); }, 350);
                } else {
                    /* user is idle after scrolling: leave the header hidden so the
                       fixed bar cannot cover page content the user is clicking */
                }
            });
        }
    }

    return function () {
        var slot = document.getElementById('hub-header-slot');
        if (!slot) return;
        var root = slot.getAttribute('data-root') || '../';
        slot.insertAdjacentHTML('afterend', renderHeader(root));
        slot.parentNode && slot.parentNode.removeChild(slot);
        wire();
    };
})();
