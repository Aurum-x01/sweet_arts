(function () {
  'use strict';
  const grid = document.getElementById('grid');
  const statusEl = document.getElementById('status');
  const countEl = document.getElementById('count');
  const sortBtn = document.getElementById('sort');
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbNum = document.getElementById('lbNum');

  let items = [], list = [], order = 'new', idx = 0, sig = '', failed = false;

  const pretty = n => n.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  const lbOpen = () => lb.classList.contains('open');

  function labels() {
    sortBtn.textContent = t(order === 'new' ? 'gal.newest' : 'gal.oldest');
    countEl.textContent = (items.length && !failed) ? t('gal.count', { n: items.length }) : '';
    if (failed) statusEl.textContent = t('gal.error');
    else statusEl.textContent = items.length ? '' : t('gal.empty');
  }

  function render() {
    list = sortPhotos(items, order);
    grid.innerHTML = '';
    list.forEach((it, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'thumb'; b.style.setProperty('--i', Math.min(i, 16));
      const img = new Image();
      img.loading = 'lazy'; img.decoding = 'async'; img.alt = pretty(it.name); img.src = it.src;
      img.onload = () => b.classList.add('ready');
      let tries = 0;
      img.onerror = () => {
        // a fresh upload can be listed before GitHub Pages has published the file: retry for a while
        if (tries++ < 12) { setTimeout(() => { img.src = it.src + '?r=' + Date.now(); }, 5000 * Math.min(tries, 4)); return; }
        items = items.filter(x => x !== it); list = list.filter(x => x !== it); b.remove(); labels();
      };
      const cap = document.createElement('span'); cap.className = 'cap'; cap.textContent = pretty(it.name);
      b.append(img, cap);
      b.addEventListener('click', () => open(list.indexOf(it)));
      grid.appendChild(b);
    });
    labels();
  }

  async function refresh(first) {
    const res = await loadPhotos();
    failed = res === null;
    const next = res || [];
    const s = next.map(p => p.name + p.mtime).join('|');
    if (first || (s !== sig && !lbOpen())) { sig = s; items = next; render(); }
    else labels();
  }

  /* ---- lightbox ---- */
  function show() {
    const it = list[idx]; if (!it) return;
    lbImg.classList.remove('in');
    const pre = new Image();
    pre.onload = () => { lbImg.src = it.src; requestAnimationFrame(() => lbImg.classList.add('in')); };
    pre.src = it.src;
    lbImg.alt = pretty(it.name);
    lbCap.textContent = pretty(it.name);
    lbNum.textContent = (idx + 1) + ' / ' + list.length;
    [list[(idx + 1) % list.length], list[(idx - 1 + list.length) % list.length]].forEach(n => { if (n) new Image().src = n.src; });
  }
  function open(i) {
    idx = i; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; show();
  }
  function close() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (document.fullscreenElement) document.exitFullscreen();
  }
  const move = d => { idx = (idx + d + list.length) % list.length; show(); };
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (lb.requestFullscreen) lb.requestFullscreen();
  }

  lb.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (act) {
      ({ close, prev: () => move(-1), next: () => move(1), fs: toggleFs })[act.dataset.act]();
    } else if (e.target === lb || e.target.classList.contains('lb-fig')) close();
  });
  addEventListener('keydown', e => {
    if (!lbOpen()) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'f' || e.key === 'F') toggleFs();
  });
  let sx = null;
  lb.addEventListener('pointerdown', e => { sx = e.clientX; });
  lb.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1);
  });

  sortBtn.addEventListener('click', () => { order = order === 'new' ? 'old' : 'new'; render(); });
  document.addEventListener('langchange', labels);

  refresh(true);
  setInterval(() => refresh(false), 30000); // pick up new photos without reloading
})();
