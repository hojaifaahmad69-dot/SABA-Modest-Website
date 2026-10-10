/* =========================================================
   SABA MODEST — main.js
   Handles:
     1. Social icon links (header, contact, footer, product page)
     2. "Follow us on Facebook" button
     3. Hot deals slider (auto-rotates, pauseable)
     4. Scroll-in animations
   Reads settings from js/settings.js (siteSettings)
   and offers from js/offers.js (HOT_DEALS).
   ========================================================= */
(function () {
  'use strict';

  // Turn on the hide-then-reveal animation only once this script is running.
  // If this file fails to load, all content stays visible.
  document.documentElement.classList.add('js');

  // Runs one feature; an error in it is logged but does not stop the others.
  function safely(name, fn) {
    try { fn(); } catch (err) { console.error('SABA Modest: ' + name + ' failed', err); }
  }

  // siteSettings is defined in js/settings.js. If that file is missing, use an empty object.
  var settings = (typeof siteSettings !== 'undefined') ? siteSettings : {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Only real web addresses are used. Empty values are skipped, so no placeholder links appear.
  function isUrl(value) {
    return typeof value === 'string' && /^https?:\/\//i.test(value);
  }

  /* ---------- 1. Social icons ----------
     Each network reads its URL from js/settings.js.
     To add Pinterest and TikTok, add these two lines to siteSettings:
        pinterest: 'https://www.pinterest.com/YOUR-PAGE',
        tiktok: 'https://www.tiktok.com/@YOUR-HANDLE',
     Leave a value empty ('') to hide that icon. */
  var ICONS = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M14 8.5V6.8c0-.8.4-1.3 1.3-1.3H17V2.2h-2.6C11.6 2.2 10.4 3.8 10.4 6v2.5H8V12h2.4v10h3.6V12H17l.4-3.5H14z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9.5"/><path d="M10 17V7.5h2.8a2.9 2.9 0 0 1 0 5.8H10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M16.5 3c.3 2.6 1.9 4.3 4.5 4.5v3.2c-1.6 0-3.1-.5-4.5-1.3v6.4c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.1-.9-.1-1.5 0-2.8 1.2-2.8 2.7s1.2 2.8 2.8 2.8 2.8-1.2 2.8-2.8V3h3.4z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.5 20.5l1.2-4A8.5 8.5 0 1 1 8 19.3z"/></svg>',
    messenger: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12 3C6.9 3 3 6.8 3 11.6c0 2.6 1.2 4.9 3.1 6.5V22l2.8-1.6c.9.2 1.8.4 3.1.4 5.1 0 9-3.8 9-8.6S17.1 3 12 3zm1 11.6-2.4-2.5-4.6 2.5 5-5.3 2.4 2.5 4.6-2.5z"/></svg>'
  };

  var SOCIAL = [
    { key: 'facebook',  label: 'Facebook',  icon: 'facebook' },
    { key: 'instagram', label: 'Instagram', icon: 'instagram' },
    { key: 'pinterest', label: 'Pinterest', icon: 'pinterest' },
    { key: 'tiktok',    label: 'TikTok',    icon: 'tiktok' }
  ];
  // Header-only order requested for the home and product page headers.
  var HEADER_SOCIAL = [
    { key: 'facebook',  label: 'Facebook',  icon: 'facebook' },
    { key: 'instagram', label: 'Instagram', icon: 'instagram' },
    { key: 'whatsapp',  label: 'WhatsApp',  icon: 'whatsapp' }
  ];
  var CHAT = [
    { key: 'whatsapp',  label: 'WhatsApp',  icon: 'whatsapp' },
    { key: 'messenger', label: 'Messenger', icon: 'messenger' }
  ];

  function socialLink(item, withText) {
    var url = settings[item.key];
    var placeholder = item.key === 'instagram' && typeof url === 'string' && url.indexOf('YOUR_') !== -1;
    if (!isUrl(url) && !placeholder) return '';
    return '<a class="social-link ' + item.key + (placeholder ? ' is-placeholder' : '') + '" href="' + url + '" target="_blank" rel="noopener" aria-label="' + item.label + (placeholder ? ' — replace placeholder URL in js/settings.js' : '') + '"' + (placeholder ? ' title="Replace placeholder URL in js/settings.js"' : '') + '>' +
      ICONS[item.icon] +
      (withText ? '<span>' + item.label + '</span>' : '') +
      '</a>';
  }

  function renderSocial(id, items, withText) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(function (item) { return socialLink(item, withText); }).join('');
  }

  safely('social icons', function () {
  renderSocial('headerSocial', HEADER_SOCIAL, false);           // home header: Facebook, Instagram, WhatsApp
  renderSocial('productHeaderSocial', HEADER_SOCIAL, false);    // product page header: Facebook, Instagram, WhatsApp
  renderSocial('socialLinks', SOCIAL.slice(1).concat(CHAT), true); // contact: text pills (Facebook has its own button)
  renderSocial('footerSocial', SOCIAL.concat(CHAT), false);     // footer: icons
  });

  /* ---------- 2. Facebook button ----------
     Uses siteSettings.facebook. If it is empty, the button stays hidden.
     Replace the value in js/settings.js with your real page URL. */
  // Footer "MESSAGE US" button -> Messenger link from settings
  safely('footer messenger', function () {
    var msg = document.getElementById('footerMessenger');
    if (msg && isUrl(settings.messenger)) {
      msg.href = settings.messenger;
      msg.target = '_blank';
      msg.rel = 'noopener';
      msg.hidden = false;
    }
  });

  safely('facebook button', function () {
    var fb = document.getElementById('facebookFollow');
    if (fb && isUrl(settings.facebook)) {
      fb.href = settings.facebook;
      fb.target = '_blank';
      fb.rel = 'noopener';
      fb.hidden = false;
    }
  });

  /* ---------- 3. Hot deals slider ---------- */
  function initHotDeals() {
    var slider = document.getElementById('dealsSlider');
    var track = document.getElementById('dealsTrack');
    var dotsEl = document.getElementById('dealsDots');
    var controls = document.getElementById('dealsControls');
    var prevBtn = document.getElementById('dealsPrev');
    var nextBtn = document.getElementById('dealsNext');
    var toggle = document.getElementById('dealsToggle');
    if (!slider || !track) return;

    var deals = Array.isArray(window.HOT_DEALS) ? window.HOT_DEALS : [];
    var section = document.getElementById('deals');
    if (!deals.length) {
      if (section) section.hidden = true;
      return;
    }

    // Build slides from js/offers.js
    track.innerHTML = deals.map(function (d, i) {
      return '<article class="deal-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + deals.length + '">' +
        '<img class="deal-img" src="' + d.image + '" alt="' + d.alt + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '" decoding="async">' +
        '<div class="deal-copy">' +
          (d.kicker ? '<p class="deal-kicker">' + d.kicker + '</p>' : '') +
          '<h3>' + d.heading + '</h3>' +
          (d.discount ? '<p class="deal-off">' + d.discount + '</p>' : '') +
          '<a class="shop-btn deal-btn" href="' + d.link + '">' + (d.buttonText || 'SHOP NOW') + ' →</a>' +
        '</div>' +
        '</article>';
    }).join('');

    var slides = track.querySelectorAll('.deal-slide');
    var total = slides.length;
    var current = 0;
    var INTERVAL = 5000;          // time per slide in milliseconds
    var timer = null;
    var playing = !reduceMotion;  // reduced-motion visitors start paused
    var hovering = false;
    var focusInside = false;

    // Dots (only needed with 2+ slides)
    dotsEl.innerHTML = deals.map(function (d, i) {
      return '<button type="button" class="deals-dot" aria-label="Show offer ' + (i + 1) + '"></button>';
    }).join('');
    var dots = dotsEl.querySelectorAll('.deals-dot');

    function show(index) {
      current = (index + total) % total;
      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', String(i === current));
      });
    }

    function syncTimer() {
      clearInterval(timer);
      timer = null;
      // Only rotate when the visitor has not paused it, and is not hovering or using the keyboard inside it
      if (playing && !hovering && !focusInside && total > 1) {
        timer = setInterval(function () { show(current + 1); }, INTERVAL);
      }
    }

    if (total < 2) {
      if (controls) controls.hidden = true;
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
    }

    function setToggleLabel() {
      if (!toggle) return;
      toggle.textContent = playing ? 'Pause' : 'Play';
      toggle.setAttribute('aria-label', playing ? 'Pause offers slideshow' : 'Play offers slideshow');
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); syncTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); syncTimer(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); syncTimer(); });
    });
    if (toggle) {
      toggle.addEventListener('click', function () {
        playing = !playing;
        setToggleLabel();
        syncTimer();
      });
    }

    slider.addEventListener('mouseenter', function () { hovering = true; syncTimer(); });
    slider.addEventListener('mouseleave', function () { hovering = false; syncTimer(); });
    slider.addEventListener('focusin', function () { focusInside = true; syncTimer(); });
    slider.addEventListener('focusout', function (e) {
      // Only resume when focus leaves the whole slider
      if (!slider.contains(e.relatedTarget)) { focusInside = false; syncTimer(); }
    });

    setToggleLabel();
    show(0);
    syncTimer();
  }
  safely('hot deals', initHotDeals);

  /* ---------- 4. Scroll-in animation ----------
     Elements with class "reveal" fade and rise when they enter the screen. */
  safely('scroll animation', function () {
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  });
})();
