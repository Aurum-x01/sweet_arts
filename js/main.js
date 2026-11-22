(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page;
  const IMG_RE = /\.(jpe?g|png|webp|gif|avif|svg|bmp)$/i;
  const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true });

  /* ---------- language ---------- */
  let lang = 'en';
  try { lang = localStorage.getItem('lang') || 'en'; } catch (e) {}
  if (!I18N[lang]) lang = 'en';

  window.t = (key, vars) => {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  };

  function applyLang(l, silent) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.documentElement.lang = l;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
    $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    document.title = t('title.' + page);
    if (!silent) document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (b) applyLang(b.dataset.lang);
  });
  applyLang(lang, true);

  /* ---------- nav ---------- */
  const nav = $('#nav');
  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === page));
  const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger');
  if (burger) burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- page transitions ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname) return; // same page / anchors
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = a.href; }, 380);
  });
  addEventListener('pageshow', () => document.body.classList.remove('leaving'));

  /* ---------- animated particle background ---------- */
  (function bg() {
    const c = $('#bg');
    if (!c || reduce) return;
    const x = c.getContext('2d');
    let w, h, dpr, pts = [];
    const mouse = { x: -9999, y: -9999 };
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
      const n = Math.min(Math.round(innerWidth * innerHeight / 15000), 100);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
        r: (Math.random() * 1.6 + .6) * dpr
      }));
    }
    addEventListener('resize', resize); resize();
    addEventListener('pointermove', e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    const LINK = 140;
    (function loop() {
      x.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 150 * dpr && d > 0) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283);
        x.fillStyle = 'rgba(190,170,255,.65)'; x.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < LINK * dpr) {
            x.strokeStyle = `rgba(139,92,246,${(1 - d / (LINK * dpr)) * .28})`;
            x.lineWidth = dpr; x.beginPath(); x.moveTo(pts[i].x, pts[i].y); x.lineTo(pts[j].x, pts[j].y); x.stroke();
          }
        }
        const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
        if (dm < 190 * dpr) {
          x.strokeStyle = `rgba(236,72,153,${(1 - dm / (190 * dpr)) * .5})`;
          x.lineWidth = dpr; x.beginPath(); x.moveTo(pts[i].x, pts[i].y); x.lineTo(mouse.x, mouse.y); x.stroke();
        }
      }
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------- custom cursor ring ---------- */
  (function cursor() {
    const cur = $('.cursor');
    if (!cur || !matchMedia('(pointer: fine)').matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); });
    document.addEventListener('mouseleave', () => cur.classList.remove('on'));
    (function f() {
      cx += (tx - cx) * .2; cy += (ty - cy) * .2;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      requestAnimationFrame(f);
    })();
    document.addEventListener('pointerover', e => {
      cur.classList.toggle('big', !!e.target.closest('a,button,[data-tilt],.thumb'));
    });
  })();

  /* ---------- 3D tilt + spotlight ---------- */
  window.initTilt = function (root) {
    $$('[data-tilt]', root || document).forEach(el => {
      if (el._tilt || matchMedia('(hover: none)').matches) return; el._tilt = true;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
        if (!reduce) el.style.transform = `perspective(800px) rotateX(${(.5 - py) * 9}deg) rotateY(${(px - .5) * 11}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  };
  initTilt();

  /* ---------- reveal on scroll + counters ---------- */
  function countUp(el) {
    const target = +el.dataset.count, dur = 1400, t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in'); io.unobserve(en.target);
      $$('[data-count]', en.target).forEach(countUp);
    });
  }, { threshold: .15 });
  window.observeReveal = function (root) {
    $$('.reveal,.stagger', root || document).forEach(el => {
      if (el.classList.contains('stagger')) [...el.children].forEach((c, i) => c.style.setProperty('--i', i));
      io.observe(el);
    });
  };
  observeReveal();

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- photo loading (works on GitHub Pages, no server needed) ---------- */
  window.sortPhotos = function (list, order) {
    const a = [...list];
    a.sort((x, y) => {
      const d = (y.mtime || 0) - (x.mtime || 0);
      if (d) return order === 'old' ? -d : d;
      return order === 'old' ? byName(x, y) : byName(y, x);
    });
    return a;
  };

  function githubRepoInfo() {
    const cfg = window.SITE_CONFIG || {};
    if (cfg.githubRepo) {
      const [owner, repo] = cfg.githubRepo.split('/');
      return { owner, repo, branch: cfg.githubBranch };
    }
    const host = location.hostname;
    if (!host.endsWith('.github.io')) return null;
    const owner = host.split('.')[0];
    const seg = location.pathname.split('/').filter(Boolean)[0];
    const repo = seg && !/\.html?$/i.test(seg) ? seg : host;
    return { owner, repo, branch: cfg.githubBranch };
  }

  // Returns an array (maybe empty) or null if nothing could be read.
  // Order: live sources first (they reflect deletions immediately), photos.json as a fallback.
  window.loadPhotos = async function () {
    // 1) GitHub API - always the real current content of the photos folder
    const gh = githubRepoInfo();
    if (gh) {
      try {
        const url = `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/photos` + (gh.branch ? `?ref=${gh.branch}` : '');
        const r = await fetch(url);
        if (r.ok) {
          const j = await r.json();
          if (Array.isArray(j)) {
            const man = await fetchManifest();
            const times = {};
            (man || []).forEach(m => { times[m.name] = m.mtime || 0; });
            return j.filter(f => f.type === 'file' && IMG_RE.test(f.name))
              .map(f => ({ name: f.name, src: 'photos/' + encodeURIComponent(f.name), mtime: times[f.name] || 0 }));
          }
        }
      } catch (e) {}
    }

    // 2) plain directory listing (local `python -m http.server`)
    try {
      const r = await fetch('photos/', { cache: 'no-store' });
      if (r.ok && /html/.test(r.headers.get('content-type') || '')) {
        const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
        const out = [];
        $$('a[href]', doc).forEach(a => {
          const name = decodeURIComponent(a.getAttribute('href').split('?')[0]).split('/').pop();
          if (IMG_RE.test(name)) out.push({ name, src: 'photos/' + encodeURIComponent(name), mtime: 0 });
        });
        return out;
      }
    } catch (e) {}

    // 3) photos.json - built by the GitHub Action (used if the API is rate-limited / custom domain)
    return await fetchManifest();
  };

  async function fetchManifest() {
    try {
      const r = await fetch('photos.json?' + Date.now(), { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); if (Array.isArray(j)) return j; }
    } catch (e) {}
    return null;
  }

  /* ---------- home page: hero frames + latest works ---------- */
  if (page === 'home') {
    const hf = $('#heroFloat');
    if (hf && !reduce) {
      addEventListener('pointermove', e => {
        const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        $$('.fr', hf).forEach(f => {
          const d = +f.dataset.d;
          f.style.setProperty('--px', (-x * d).toFixed(1) + 'px');
          f.style.setProperty('--py', (-y * d).toFixed(1) + 'px');
        });
      });
    }
    loadPhotos().then(list => {
      const grid = $('#latest');
      if (!list || !list.length) { if (grid) grid.innerHTML = `<p class="muted" data-i18n="gal.empty">${t('gal.empty')}</p>`; return; }
      const s = sortPhotos(list, 'new');
      $$('.fr-in', hf || document).slice(0, 3).forEach((fr, i) => {
        if (!s[i]) return;
        const im = new Image(); im.alt = ''; im.src = s[i].src;
        im.onload = () => { fr.appendChild(im); im.classList.add('show'); };
      });
      if (grid) {
        grid.innerHTML = '';
        s.slice(0, 6).forEach(p => {
          const a = document.createElement('a');
          a.href = 'gallery.html'; a.className = 'card art'; a.setAttribute('data-tilt', '');
          const im = new Image(); im.loading = 'lazy'; im.alt = ''; im.src = p.src;
          a.appendChild(im); grid.appendChild(a);
        });
        initTilt(grid); observeReveal(grid.parentElement);
        [...grid.children].forEach((c, i) => c.style.setProperty('--i', i));
      }
    });
  }
})();
