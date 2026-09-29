/* =========================================================================
   UTILITIES
   ========================================================================= */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e){} },
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;

/* =========================================================================
   I18N
   ========================================================================= */
let LANG = root.lang === 'en' ? 'en' : 'ro';
const t = (k) => (I18N[LANG][k] !== undefined ? I18N[LANG][k] : (I18N.ro[k] !== undefined ? I18N.ro[k] : k));
const L = (obj) => (obj && (obj[LANG] || obj.ro)) || '';
const langHooks = [];
const onLang = (fn) => langHooks.push(fn);

/* text scramble — works on every text node, so inline markup (spans, <br>) survives */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ăîșțâ';
function scramble(el, dur = 800, easeOut = false){
  if (reduceMotion || !el) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = []; let n;
  while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push({ n, final: n.nodeValue });
  const token = (el._scr = (el._scr || 0) + 1);
  const start = performance.now();
  (function frame(now){
    if (el._scr !== token) return;
    const p = clamp((now - start) / dur, 0, 1), q = easeOut ? 1 - Math.pow(1 - p, 3) : p;   // easeOut: quick start, slow finish
    nodes.forEach(o => {
      const len = o.final.length, shown = Math.floor(q * len);
      let s = o.final.slice(0, shown);
      for (let i = shown; i < len; i++){
        const c = o.final[i];
        s += (c === ' ' || c === '\n') ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      o.n.nodeValue = s;
    });
    if (p < 1) requestAnimationFrame(frame);
    else nodes.forEach(o => (o.n.nodeValue = o.final));
  })(start);
}

function applyLang(lang, animate){
  LANG = lang;
  root.lang = lang;
  store.set('wc-lang', lang);
  $$('[data-i18n]').forEach(el => {
    const v = t(el.getAttribute('data-i18n'));
    if (typeof v === 'string') el.innerHTML = v;
  });
  $$('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))));
  $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))));
  $$('[data-i18n-title]').forEach(el => el.setAttribute('title', t(el.getAttribute('data-i18n-title'))));
  document.title = lang === 'ro' ? 'WebCraftsmen — Dezvoltare web în România' : 'WebCraftsmen — Web development in Romania';
  langHooks.forEach(fn => fn(lang));
  if (animate){
    // scramble every heading that's currently on screen
    $$('h1, h2, h3, .nav-links a, .btn span, .kicker span:last-child').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!(r.bottom > 0 && r.top < innerHeight) || el.closest('#preturi, #proces, #contact')) return;
      if (el.matches('.hero-title')) magicTitle(el, true); else scramble(el, el.dataset.scrambleDur ? 1170 : 600, !!el.dataset.scrambleDur);
    });
  }
}

/* =========================================================================
   TOASTS
   ========================================================================= */
function toast(msg, ms = 2600){
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, ms);
}

/* =========================================================================
   THEME — circular reveal using the View Transitions API (with fallback)
   ========================================================================= */
const themeBtn = $('#theme-btn');
let heroColor = '';
function readColors(){ heroColor = getComputedStyle(root).getPropertyValue('--maroon').trim() || '#7A1F2B'; }
function setTheme(theme, x, y){
  const swap = () => {
    root.setAttribute('data-theme', theme);
    store.set('wc-theme', theme);
    $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#100C0B' : '#7A1F2B');
    readColors();
  };
  if (!document.startViewTransition || reduceMotion){ swap(); return; }
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(swap);
  vt.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(() => {});
}
function toggleTheme(x, y, announce){
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if (x === undefined){ const r = themeBtn.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
  setTheme(next, x, y);
  if (announce) toast(t(next === 'dark' ? 'toast-theme-dark' : 'toast-theme-light'));
}
themeBtn.addEventListener('click', e => toggleTheme(e.clientX || undefined, e.clientY || undefined, false));
readColors();

/* =========================================================================
   LANGUAGE BUTTON
   ========================================================================= */
function toggleLang(){ applyLang(LANG === 'ro' ? 'en' : 'ro', true); toast(t('toast-lang'), 1600); }
$('#lang-btn').addEventListener('click', toggleLang);

/* =========================================================================
   PRELOADER
   ========================================================================= */
const pre = $('#preloader');
let preDone = false;
function finishPreloader(){
  if (preDone) return; preDone = true;
  pre.classList.add('done');
  document.body.classList.remove('locked');
  setTimeout(() => { pre.remove(); }, 1000);
  magicTitle($('.hero-title'));
  $('#top').classList.add('intro-done');
  startRotator();
}
(function runPreloader(){
  if (reduceMotion){ setTimeout(finishPreloader); return; }   // deferred: the rest of the script must be set up first
  document.body.classList.add('locked');
  const num = $('#pl-num'), bar = $('#pl-bar'), log = $('#pl-log');
  const logs = t('pl-logs');
  // ~4.2 s with a couple of believable "thinking" pauses; it always lands on 100%
  const dur = 4200, start = performance.now();
  const KEYS = [[0, 0], [.18, .31], [.30, .36], [.46, .58], [.60, .63], [.78, .88], [.90, .96], [1, 1]];
  const curve = p => { for (let i = 1; i < KEYS.length; i++){ const [x0, y0] = KEYS[i - 1], [x1, y1] = KEYS[i]; if (p <= x1){ const f = (p - x0) / (x1 - x0); return y0 + (y1 - y0) * (f * f * (3 - 2 * f)); } } return 1; };
  let lastLog = -1;
  pre.addEventListener('click', finishPreloader);
  (function step(now){
    if (preDone) return;
    const p = clamp((now - start) / dur, 0, 1), e = curve(p);
    num.textContent = Math.round(e * 100);
    bar.style.width = (e * 100) + '%';
    const li = Math.min(logs.length - 1, Math.floor(e * logs.length * .999));
    if (li !== lastLog){ lastLog = li; log.innerHTML += `<div>&gt; ${logs[li]}</div>`; log.scrollTop = 999; }
    if (p < 1) requestAnimationFrame(step);
    else { num.textContent = 100; bar.style.width = '100%'; setTimeout(finishPreloader, 450); }
  })(start);
})();

/* =========================================================================
   HERO INTRO — quiet "type alignment": each letter starts slightly out of
   place (nudged up/down, a little sideways, faint and soft) and slides into
   its slot, left to right, like type being set. No spin, no sparkle.
   ========================================================================= */
function magicTitle(el){
  // subtle: the headline just settles from 90% to full opacity
  if (!el) return;
  el.style.opacity = 1;
  if (!reduceMotion) el.animate([{ opacity: .9 }, { opacity: 1 }], { duration: 900, easing: 'ease-out' });
}

/* =========================================================================
   CUSTOM CURSOR + MAGNETIC BUTTONS
   ========================================================================= */
if (finePointer && !reduceMotion){
  document.body.classList.add('fine-cursor');
  const dot = $('.cursor-dot'), ring = $('.cursor-ring'), label = $('#cursor-label');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  window.addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    const lab = e.target.closest('[data-cursor]');
    const hov = e.target.closest('a, button, input, textarea, select, label, .svc');
    ring.classList.toggle('label', !!lab);
    ring.classList.toggle('hover', !lab && !!hov);
    label.textContent = lab ? t(lab.getAttribute('data-cursor')) : '';
  });
  document.addEventListener('pointerleave', () => { dot.style.opacity = ring.style.opacity = 0; });
  document.addEventListener('pointerenter', () => { dot.style.opacity = ring.style.opacity = 1; });
  (function loop(){
    rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();

  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* =========================================================================
   NAV: hide on scroll, active link, mobile menu, progress bar
   ========================================================================= */
const nav = $('#nav'), navLinks = $('#nav-links'), navToggle = $('#nav-toggle'), progress = $('#progress');
let lastY = scrollY, scrollVel = 0;
function onScroll(){
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  scrollVel = y - lastY;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (!navLinks.classList.contains('open')) nav.classList.toggle('hidden', y > 240 && scrollVel > 0);
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', e => {
  if (e.target.closest('a')){ navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
});
const linkMap = new Map($$('a', navLinks).map(a => [a.getAttribute('href').slice(1), a]));
const secIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    linkMap.forEach(a => a.classList.remove('active'));
    const a = linkMap.get(en.target.id);
    if (a) a.classList.add('active');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => secIO.observe(s));
const goTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };

/* =========================================================================
   REVEAL ON SCROLL (+ heading scramble, counters)
   ========================================================================= */
const revIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    $$('[data-scramble]', en.target).forEach(h => scramble(h, +(h.dataset.scrambleDur || 900), !!h.dataset.scrambleDur));
    revIO.unobserve(en.target);
  });
}, { threshold: 0.12 });
$$('.reveal, .reveal-stagger').forEach(el => revIO.observe(el));


/* stats: count UP to the target — except "0 templates", which counts DOWN from 99 (it's funnier) */
const statIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    $$('[data-count]', en.target).forEach(el => {
      const target = +el.getAttribute('data-count');
      const from = target === 0 ? 99 : 0, dur = 1800, start = performance.now();
      if (reduceMotion){ el.textContent = target; return; }
      (function f(now){
        const p = clamp((now - start) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(lerp(from, target, e));
        if (p < 1) requestAnimationFrame(f);
      })(start);
    });
    statIO.unobserve(en.target);
  });
}, { threshold: 0.4 });
statIO.observe($('#stats'));

/* =========================================================================
   HERO — interactive 3D point sphere (plain canvas 2D, hand-rolled projection)
   ========================================================================= */
(function heroSphere(){
  const cv = $('#hero-canvas'), ctx = cv.getContext('2d'), hero = $('#top');
  let W = 0, H = 0, DPR = 1, pts = [], visible = true;
  let rotX = 0.35, rotY = 0, spinV = 0.0022, dragging = false, lastPX = 0, lastPY = 0;
  let mouseX = -9999, mouseY = -9999, tiltX = 0, tiltY = 0;
  let pulse = 0, pulseT = 0;

  function size(){
    DPR = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const N = W < 700 ? 420 : 900, g = Math.PI * (3 - Math.sqrt(5));
    pts = [];
    for (let i = 0; i < N; i++){
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, ox: 0, oy: 0 });
    }
    buildShapes(N);
  }

  /* ---------- mystic shapes the dots gather into (a new one every cycle, 6 in a loop) ----------
     Shapes are drawn with y pointing UP here and flipped at the end. Each is a list of 3D polylines;
     the N dots are spread evenly along those lines and the lines themselves are traced when formed. */
  const circle = (r, n = 72, cx = 0, cy = 0, z = 0) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]; });
  const polyStar = (k, step, r, rot = Math.PI / 2) => Array.from({ length: k + 1 }, (_, i) => { const a = rot + (i * step % k) / k * Math.PI * 2; return [Math.cos(a) * r, Math.sin(a) * r, 0]; });
  const SHAPES = [
    // 1. pyramid (3D)
    { spin: true, lines: (() => { const b = -.62, s = .8, A = [0, .98, 0], c = [[-s, b, -s], [s, b, -s], [s, b, s], [-s, b, s]];
      return [[...c, c[0]], [c[0], A], [c[1], A], [c[2], A], [c[3], A]]; })() },
    // 2. eye of providence: triangle + eye + pupil
    { lines: (() => { const eyeTop = Array.from({ length: 33 }, (_, i) => { const x = -.46 + i / 32 * .92; return [x, -.12 + .2 * Math.cos(x / .46 * Math.PI / 2), 0]; });
      const eyeBot = eyeTop.map(([x, y]) => [x, -.12 - (y + .12), 0]);
      return [[[0, .95, 0], [-.9, -.62, 0], [.9, -.62, 0], [0, .95, 0]], eyeTop, eyeBot, circle(.1, 28, 0, -.12)]; })() },
    // 3. pentagram in a circle
    { lines: [polyStar(5, 2, .92), circle(.95)] },
    // 4. hexagram (two triangles) in a circle
    { lines: [polyStar(3, 1, .9), polyStar(3, 1, .9, -Math.PI / 2), circle(.97)] },
    // 5. merkaba — two interlocked tetrahedra (3D)
    { spin: true, lines: (() => { const s = .58, T = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => v.map(c => c * s)), U = T.map(v => v.map(c => -c));
      const edges = V => [[V[0], V[1]], [V[0], V[2]], [V[0], V[3]], [V[1], V[2]], [V[1], V[3]], [V[2], V[3]]];
      return [...edges(T), ...edges(U)]; })() },
    // 6. the deathly-hallows sigil: triangle, circle, line
    { lines: [[[0, .95, 0], [-.92, -.66, 0], [.92, -.66, 0], [0, .95, 0]], circle(.43, 64, 0, -.12), [[0, .95, 0], [0, -.66, 0]]] },
  ];
  SHAPES.forEach(s => { s.lines = s.lines.map(l => l.map(([x, y, z]) => [x, -y, z])); });
  function buildShapes(N){
    const order = Array.from({ length: N }, (_, i) => i).sort(() => Math.random() - .5);   // random pairing = swirly morph
    SHAPES.forEach(s => {
      const segs = [];
      s.lines.forEach(l => { for (let i = 1; i < l.length; i++){ const a = l[i - 1], b = l[i]; segs.push([a, b, Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])]); } });
      const total = segs.reduce((t, sg) => t + sg[2], 0);
      s.target = new Array(N);
      let si = 0, acc = 0;
      for (let k = 0; k < N; k++){
        let d = (k + .5) / N * total;
        while (si < segs.length - 1 && d > acc + segs[si][2]){ acc += segs[si][2]; si++; }
        const [a, b, len] = segs[si], f = len ? (d - acc) / len : 0;
        s.target[order[k]] = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
      }
    });
  }
  const T0 = performance.now() + (reduceMotion ? 0 : 4700), REST = 3, IN = 1.4, HOLD = 3, OUT = 1.4, CYCLE = REST + IN + HOLD + OUT;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function shapeState(now){
    const t = (now - T0) / 1000; if (t < 0) return { shape: SHAPES[0], k: 0, t: 0 };
    const c = Math.floor(t / CYCLE), tc = t - c * CYCLE;
    let k = 0;
    if (tc < REST) k = 0; else if (tc < REST + IN) k = ease((tc - REST) / IN); else if (tc < REST + IN + HOLD) k = 1; else k = 1 - ease((tc - REST - IN - HOLD) / OUT);
    return { shape: SHAPES[c % SHAPES.length], k, t };
  }
  size();
  window.addEventListener('resize', size);
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(hero);

  hero.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
    tiltX = (e.clientY / innerHeight - 0.5) * 0.6;
    tiltY = (e.clientX / innerWidth - 0.5) * 0.6;
    if (dragging){
      spinV = (e.clientX - lastPX) * 0.0008;
      rotX += (e.clientY - lastPY) * 0.004;
      lastPX = e.clientX; lastPY = e.clientY;
    }
  });
  hero.addEventListener('pointerleave', () => { mouseX = mouseY = -9999; dragging = false; });
  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('a, button')) return;
    dragging = true; lastPX = e.clientX; lastPY = e.clientY;
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  hero.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    pulse = 1; pulseT = performance.now();
  });

  function frame(now){
    requestAnimationFrame(frame);
    if (!preDone || !visible || document.hidden) return;   // idle behind the loading screen
    const big = W > 960;
    const cx = big ? W * 0.74 : W * 0.5, cy = H * (big ? 0.5 : 0.42);
    const R = big ? Math.min(H * 0.34, W * 0.23) : Math.min(W, H) * 0.42;
    const alphaMul = big ? 1 : 0.35;
    if (!dragging) spinV = lerp(spinV, 0.0022, 0.02);
    if (!reduceMotion) rotY += spinV;
    const rx = rotX + tiltX, ry = rotY + tiltY;
    const sx = Math.sin(rx), cxr = Math.cos(rx), sy = Math.sin(ry), cyr = Math.cos(ry);
    const age = (now - pulseT) / 1000;
    pulse = pulse > 0.001 ? Math.exp(-age * 2.2) : 0;

    ctx.clearRect(0, 0, W, H);

    // orbit ring
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-0.35);
    ctx.strokeStyle = heroColor; ctx.globalAlpha = 0.18 * alphaMul; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, 0, R * 1.45, R * 0.36, 0, 0, Math.PI * 2); ctx.stroke();
    const sa = now * 0.0006;
    ctx.globalAlpha = 0.9 * alphaMul; ctx.fillStyle = heroColor;
    ctx.beginPath(); ctx.arc(Math.cos(sa) * R * 1.45, Math.sin(sa) * R * 0.36, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // shape morph state: rotation used while a sign is formed (flat signs face the viewer and sway,
    // 3D ones turn slowly)
    const S = reduceMotion ? { k: 0 } : shapeState(now), K = S.k;
    let rot2 = null;
    if (K > 0){
      const sry = (S.shape.spin ? S.t * .55 : Math.sin(S.t * .6) * .38) + tiltY * .6, srx = (S.shape.spin ? .32 : Math.sin(S.t * .45) * .16) + tiltX * .5;
      rot2 = [Math.sin(srx), Math.cos(srx), Math.sin(sry), Math.cos(sry)];
    }
    const rotate = (px_, py_, pz_, s_x, c_x, s_y, c_y) => {
      let x = px_ * c_y + pz_ * s_y, z = -px_ * s_y + pz_ * c_y, y = py_;
      const y2 = y * c_x - z * s_x; z = y * s_x + z * c_x; return [x, y2, z];
    };

    // the sign's lines, traced in as the dots arrive
    if (K > .35){
      const la = (K - .35) / .65;
      ctx.save();
      ctx.strokeStyle = heroColor; ctx.lineWidth = 1.2; ctx.globalAlpha = la * .75 * alphaMul;
      if (big){ ctx.shadowColor = heroColor; ctx.shadowBlur = 10; }
      S.shape.lines.forEach(l => {
        ctx.beginPath();
        l.forEach((v, i) => {
          const [x, y, z] = rotate(v[0], v[1], v[2], rot2[0], rot2[1], rot2[2], rot2[3]);
          const ps = 2.6 / (2.6 - z), X = cx + x * R * ps, Y = cy + y * R * ps;
          i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
        });
        ctx.stroke();
      });
      ctx.restore();
    }

    ctx.fillStyle = heroColor;
    for (let i = 0; i < pts.length; i++){
      const p = pts[i];
      // rotate Y then X
      let [x, y, z] = rotate(p.x, p.y, p.z, sx, cxr, sy, cyr);
      if (K > 0){
        const tg = S.shape.target[i], [tx_, ty_, tz_] = rotate(tg[0], tg[1], tg[2], rot2[0], rot2[1], rot2[2], rot2[3]);
        x += (tx_ - x) * K; y += (ty_ - y) * K; z += (tz_ - z) * K;
      }
      const wave = pulse ? 1 + pulse * 0.28 * Math.sin(p.y * 9 - age * 14) : 1;
      const persp = 2.6 / (2.6 - z);
      let px = cx + x * R * persp * wave, py = cy + y * R * persp * wave;
      // mouse repulsion (in screen space, eased per point)
      const dx = px - mouseX, dy = py - mouseY, d2 = dx * dx + dy * dy;
      let tx = 0, ty = 0;
      if (d2 < 12000){ const d = Math.sqrt(d2) || 1, f = (110 - d) * 0.45; tx = dx / d * f; ty = dy / d * f; }
      p.ox = lerp(p.ox, tx, 0.15); p.oy = lerp(p.oy, ty, 0.15);
      px += p.ox; py += p.oy;
      const depth = (z + 1) / 2;
      ctx.globalAlpha = (0.12 + depth * 0.75) * alphaMul;
      const s = 0.8 + depth * 2.1;
      ctx.fillRect(px - s / 2, py - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(frame);
})();

/* typewriter rotator */
let rotTimer = null;
function startRotator(){
  const el = $('#rotator');
  clearTimeout(rotTimer);
  let wi = 0, ci = 0, del = false;
  (function tick(){
    const words = t('rotator'), w = words[wi % words.length];
    if (reduceMotion){ el.textContent = w; wi++; rotTimer = setTimeout(tick, 2200); return; }
    if (!del){ ci++; el.textContent = w.slice(0, ci); if (ci >= w.length){ del = true; rotTimer = setTimeout(tick, 1600); return; } }
    else { ci--; el.textContent = w.slice(0, ci); if (ci <= 0){ del = false; wi++; } }
    rotTimer = setTimeout(tick, del ? 35 : 75);
  })();
}
onLang(() => { if (preDone) startRotator(); });

/* Bucharest clock + availability */
function tickClock(){
  const now = new Date();
  const time = new Intl.DateTimeFormat('ro-RO', { timeZone: 'Europe/Bucharest', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Bucharest', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now);
  const wd = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[parts.find(p => p.type === 'weekday').value];
  const hr = +parts.find(p => p.type === 'hour').value % 24;
  const h = CONFIG.officeHours, open = h.days.includes(wd) && hr >= h.start && hr < h.end;
  $('#bucharest-clock').textContent = time;
  $('#contact-clock').textContent = time.slice(0, 5);
  $('#status-dot').classList.toggle('off', !open);
  $('#status-text').textContent = t(open ? 'status-open' : 'status-closed');
}
tickClock(); setInterval(tickClock, 1000); onLang(tickClock);

/* =========================================================================
   SERVICES — cursor-following spotlight
   ========================================================================= */
$$('.svc, .c-card').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));
