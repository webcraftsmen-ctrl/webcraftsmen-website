/* =========================================================================
   LIVE BUILD DEMO — types code, syntax-highlights it, renders it live
   ========================================================================= */
const demo = (function(){
  const pre = $('#code-out'), body = $('#code-body'), frame = $('#preview');
  const playBtn = $('#demo-play'), skipBtn = $('#demo-skip'), speed = $('#demo-speed'), stats = $('#demo-stats');
  let code = '', startIdx = 0, cssStart = 0, idx = 0, playing = false, started = false, lastT = 0, docReady = false, rendered = -1, liveCss = null;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const RE = /(<!--.*?(?:-->|$)|\/\*.*?(?:\*\/|$))|(<\/?)([a-zA-Z][\w-]*)|([a-zA-Z-]+)(?==")|("[^"]*"?|'[^']*'?)|(#[0-9A-Fa-f]{3,6}\b)|(-?-?[a-z-]+)(?=\s*:\s)|(\/?>)|(@keyframes|var\([^)]*\)?)/g;
  function hl(line){
    let out = '', last = 0;
    line.replace(RE, (m, com, lt, tag, attr, str, hex, prop, gt, kw, off) => {
      out += esc(line.slice(last, off));
      const cls = com ? 'com' : lt ? 'tag' : attr ? 'attr' : str ? 'str' : hex ? 'hex' : prop ? 'prop' : kw ? 'hex' : 'tag';
      out += `<span class="tk-${cls}">${esc(m)}</span>`;
      last = off + m.length;
      return m;
    });
    return out + esc(line.slice(last));
  }
  function initDoc(){
    if (!docReady) return;
    try {
      const d = frame.contentDocument, data = DEMO_CODE[LANG];
      d.body.innerHTML = data.html;                      // markup stays put, so CSS animations keep running
      liveCss = d.createElement('style'); d.head.appendChild(liveCss);
      rendered = -1; render();
    } catch(e){}
  }
  function render(){
    if (rendered === Math.floor(idx)) return;
    const n = Math.floor(idx); rendered = n;
    const txt = code.slice(0, n), lines = txt.split('\n');
    pre.innerHTML = lines.map((l, i) => `<span class="ln">${hl(l)}${i === lines.length - 1 ? '<span class="caret"></span>' : ''}</span>`).join('');
    body.scrollTop = body.scrollHeight;
    stats.textContent = `${Math.max(0, n - startIdx)} / ${code.length - startIdx} ${t('demo-chars')}`;
    if (liveCss) liveCss.textContent = code.slice(cssStart, n).replace(/<\/?[a-z]*>?$/i, '');
  }
  function setLabel(){
    const k = !started ? 'demo-play' : playing ? 'demo-pause' : idx >= code.length ? 'demo-replay' : 'demo-resume';
    playBtn.firstElementChild.textContent = t(k);
  }
  function loop(now){
    if (!playing) return;
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    idx = Math.min(code.length, idx + (+speed.value) * 28 * dt);
    render();
    if (idx >= code.length){ playing = false; setLabel(); return; }
    requestAnimationFrame(loop);
  }
  function play(){
    if (idx >= code.length){ idx = startIdx; rendered = -1; }
    started = true; playing = true; lastT = performance.now(); setLabel();
    requestAnimationFrame(loop);
  }
  function pause(){ playing = false; setLabel(); }
  function load(){
    const d = DEMO_CODE[LANG];
    code = d.html + '\n\n<style>\n' + d.css + '</style>';
    cssStart = d.html.length + '\n\n<style>\n'.length;
    startIdx = cssStart;                                  // skip the filler: markup appears instantly
    idx = startIdx; rendered = -1;
    $('#demo-file').textContent = d.file; $('#demo-url').textContent = d.url;
    initDoc(); render(); setLabel();
  }
  frame.addEventListener('load', () => { docReady = true; initDoc(); });
  frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';
  playBtn.addEventListener('click', () => (playing ? pause() : play()));
  skipBtn.addEventListener('click', () => { idx = code.length; playing = false; started = true; render(); setLabel(); });
  onLang(() => { const was = playing || started; playing = false; load(); if (was) play(); });
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting && !started){ play(); io.disconnect(); } }, { threshold: 0.35 });
  io.observe($('#demo'));
  return { replay(){ idx = startIdx; rendered = -1; goTo('demo'); play(); }, load };
})();

/* =========================================================================
   PORTFOLIO — "Portofoliu" / "Vezi lucrările" open the live viewer: the real
   concept pages (bundled in #pages-data as JSON, parsed only on first use),
   shown at desktop / tablet / phone size, arrows to move between projects.
   ========================================================================= */
let PAGES = null;
function pageHTML(path){
  if (!PAGES){ try { PAGES = JSON.parse($('#pages-data').textContent); } catch(e){ PAGES = {}; } }
  return PAGES[path] || null;
}
function loadFrame(f, path){
  const html = pageHTML(path);
  if (html){ f.removeAttribute('src'); f.srcdoc = html; } else f.src = path;   // fallback: the file next to index.html
}
const portfolio = { open: (i = 0) => lightbox.open(i) };

const lightbox = (function(){
  const box = $('#lightbox'), device = $('#lb-device'), frame = $('#lb-frame'), devBtns = $$('#lb-devices button');
  const SIZES = { desktop: [1440, 900], tablet: [820, 1180], mobile: [390, 844] };
  let k = 0, lastFocus = null, dev = innerWidth < 700 ? 'mobile' : 'desktop', currentPage = '';
  function layoutDevice(){
    const [W, Hd] = SIZES[dev], small = innerWidth < 700;
    const availW = Math.min(1200, innerWidth - (small ? 40 : 170));
    const availH = innerHeight - (small ? 290 : 250);
    let s = Math.min(1, availW / W);
    let boxH;
    if (dev === 'desktop'){ boxH = availH; }
    else { s = Math.min(s, availH / Hd); boxH = Hd * s; }
    device.className = 'lb-device ' + dev + (device.classList.contains('ready') ? ' ready' : '');
    device.style.width = (W * s) + 'px';
    device.style.height = boxH + 'px';
    frame.style.width = W + 'px';
    frame.style.height = (boxH / s) + 'px';
    frame.style.transform = `scale(${s})`;
    devBtns.forEach(b => b.classList.toggle('on', b.dataset.dev === dev));
  }
  function show(){
    const p = PORTFOLIO[k]; if (!p) return;
    if (currentPage !== p.page){ currentPage = p.page; device.classList.remove('ready'); loadFrame(frame, p.page); }
    layoutDevice();
    $('#lb-title').textContent = L(p.title); $('#lb-desc').textContent = L(p.desc);
    $('#lb-count').textContent = `${String(k + 1).padStart(2, '0')} / ${String(PORTFOLIO.length).padStart(2, '0')}`;
  }
  frame.addEventListener('load', () => device.classList.add('ready'));
  devBtns.forEach(b => b.addEventListener('click', () => { dev = b.dataset.dev; layoutDevice(); }));
  window.addEventListener('resize', () => { if (box.classList.contains('open')) layoutDevice(); });
  function open(i){ lastFocus = document.activeElement; k = i; box.classList.add('open'); show(); document.body.classList.add('locked'); $('#lb-close').focus(); }
  function close(){ box.classList.remove('open'); document.body.classList.remove('locked'); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  function step(d){ const n = PORTFOLIO.length; k = (k + d + n) % n; show(); }
  $('#lb-close').addEventListener('click', close);
  $('#lb-prev').addEventListener('click', () => step(-1));
  $('#lb-next').addEventListener('click', () => step(1));
  box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lb-live')) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  return { open, close, isOpen: () => box.classList.contains('open') };
})();

/* =========================================================================
   CONTACT — copy-to-clipboard buttons
   ========================================================================= */
async function copyText(txt){
  try { await navigator.clipboard.writeText(txt); toast(t('copied')); return; } catch(e){}
  const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast(t('copied')); } catch(e){ toast(t('copy-fail')); }
  ta.remove();
}
document.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (b) copyText(b.dataset.copy); });

/* =========================================================================
   FX: CONFETTI (physics particles)
   ========================================================================= */
const confettiCv = $('#confetti'), cctx = confettiCv.getContext('2d');
let confettiParts = [], confettiRunning = false;
function confetti(x = innerWidth / 2, y = innerHeight / 3, n = 160){
  const DPR = Math.min(2, devicePixelRatio || 1);
  confettiCv.width = innerWidth * DPR; confettiCv.height = innerHeight * DPR; cctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const cols = ['#7A1F2B', '#E0677B', '#F6C177', '#FAF7F2', '#17130F', '#C9485F', '#A6DA95'];
  for (let i = 0; i < n; i++){
    const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 10;
    confettiParts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, w: 6 + Math.random() * 6, h: 3 + Math.random() * 5,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: cols[i % cols.length], life: 0 });
  }
  if (!confettiRunning){ confettiRunning = true; requestAnimationFrame(confettiLoop); }
}
function confettiLoop(){
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  confettiParts.forEach(p => {
    p.vy += 0.28; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.r); cctx.scale(1, Math.cos(p.life * 0.15));
    cctx.fillStyle = p.c; cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cctx.restore();
  });
  confettiParts = confettiParts.filter(p => p.y < innerHeight + 40 && p.life < 400);
  if (confettiParts.length) requestAnimationFrame(confettiLoop);
  else { confettiRunning = false; cctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* =========================================================================
   FX: MATRIX RAIN
   ========================================================================= */
const matrix = (function(){
  /* Locked "Matrix" sequence (3 s, then 5, 7, 9 …):
     1. glitch-in, then a deep parallax code rain (3 depth layers)
     2. a green terminal line types out a message, one per stage
     3. finale: the rain "decodes" into WEBCRAFTSMEN — every cell cycles random glyphs,
        then locks into its letter, left-to-right in a wave, with a glowing lock flash
     4. glitch-out back to the site. Nothing can stop it midway. */
  const cv = $('#matrix'), ctx = cv.getContext('2d');
  let on = false, uses = 0, t0 = 0, total = 0, cols = [], W = 0, H = 0, DPR = 1, lastDraw = 0;
  const GLY = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789WEBCRAFTSMEN<>{}/=*';
  const rg = () => GLY[(Math.random() * GLY.length) | 0];
  const duration = () => 3 + uses * 2;
  function setup(){
    DPR = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = [];
    [[11, .35, .5], [15, .65, .8], [21, 1, 1.25]].forEach(([fs, a, sp]) => {        // far → near layers
      for (let x = Math.random() * fs; x < W; x += fs * 1.25){
        cols.push({ x, fs, a, sp: sp * (.6 + Math.random() * .8), y: -Math.random() * H * 1.5, trail: Array.from({ length: 12 + (Math.random() * 18 | 0) }, rg) });
      }
    });
  }
  function start(){
    if (on) return; on = true;
    total = duration() * 1000; uses++;
    setup(); t0 = performance.now();
    cv.classList.remove('out'); cv.classList.add('on');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(draw);
  }
  function end(){
    cv.classList.add('out');
    setTimeout(() => { on = false; cv.classList.remove('on', 'out'); }, 500);
  }
  function draw(now){
    if (!on) return;
    const el = Math.max(0, now - t0), p = el / total;       // rAF time can be a hair before t0
    if (el >= total){ end(); return; }
    requestAnimationFrame(draw);
    if (now - lastDraw < 33) return; lastDraw = now;

    const decodeStart = Math.max(total - 1900, total * .35);           // last ~1.9 s = the decode finale
    const inFinale = el > decodeStart, fk = inFinale ? Math.min(1, (el - decodeStart) / 1500) : 0;

    // rain (fades back while the finale takes over)
    ctx.fillStyle = `rgba(0,0,0,${.16 + fk * .12})`; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    for (const c of cols){
      c.y += c.fs * c.sp * .9;
      if (c.y - c.trail.length * c.fs > H) { c.y = -Math.random() * H * .4; }
      if (Math.random() < .08) c.trail[(Math.random() * c.trail.length) | 0] = rg();
      ctx.font = `${c.fs}px "JetBrains Mono", monospace`;
      for (let k = 0; k < c.trail.length; k++){
        const y = c.y - k * c.fs; if (y < -c.fs || y > H + c.fs) continue;
        const fade = 1 - k / c.trail.length;
        ctx.fillStyle = k === 0 ? `rgba(225,255,235,${c.a * (1 - fk * .8)})` : `rgba(60,255,122,${fade * c.a * .85 * (1 - fk * .75)})`;
        ctx.fillText(c.trail[k], c.x, y);
      }
    }

    // terminal lines (one per stage: 3 s → 1 line, 5 s → 2, 7 s+ → 3)
    const lines = t('mx-lines').slice(0, Math.min(3, Math.max(1, Math.floor((total / 1000 - 1) / 2))));
    const span = decodeStart / lines.length;
    if (!inFinale){
      const li = Math.min(lines.length - 1, Math.floor(el / span)), lt = (el - li * span) / span;
      const txt = lines[li], shown = txt.slice(0, Math.floor(Math.min(1, lt * 1.6) * txt.length));
      ctx.save();
      ctx.font = `500 ${W < 700 ? 17 : 24}px "JetBrains Mono", monospace`; ctx.textAlign = 'left';
      const x = W < 700 ? 24 : W * .12, y = H * .42;
      ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.fillRect(x - 14, y - 34, ctx.measureText(txt).width + 60, 50);
      ctx.shadowColor = '#3CFF7A'; ctx.shadowBlur = 12; ctx.fillStyle = '#B8FFCB';
      ctx.fillText(shown + ((now / 400 | 0) % 2 ? '█' : ' '), x, y);
      ctx.restore();
    }

    // finale: glyphs decode into WEBCRAFTSMEN
    if (inFinale){
      const word = 'WEBCRAFTSMEN', fs = Math.min(W / (word.length * .82), 120), cw = fs * .74, x0 = W / 2 - (word.length - 1) * cw / 2, y = H * .48;
      ctx.save();
      ctx.font = `700 ${fs}px "JetBrains Mono", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = 0; i < word.length; i++){
        const lockAt = .15 + i / word.length * .55, locked = fk >= lockAt, flash = locked ? Math.max(0, 1 - (fk - lockAt) * 6) : 0;
        const ch = locked ? word[i] : (fk > lockAt - .25 ? rg() : ' ');
        if (ch === ' ') continue;
        ctx.shadowColor = '#3CFF7A'; ctx.shadowBlur = locked ? 18 + flash * 40 : 8;
        ctx.fillStyle = locked ? (flash > .2 ? '#FFFFFF' : (i < 3 ? '#9CFFB5' : '#E9FFF0')) : 'rgba(60,255,122,.55)';
        ctx.fillText(ch, x0 + i * cw, y);
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = Math.max(0, (fk - .75) * 4);
      ctx.fillStyle = '#3CFF7A'; ctx.fillRect(x0 - cw / 2, y + fs * .62, cw * word.length * Math.min(1, (fk - .75) * 4), 2);
      ctx.restore();
    }

    // tiny countdown, bottom right
    ctx.save();
    ctx.font = '600 12px "JetBrains Mono", monospace'; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(60,255,122,.75)';
    ctx.fillText(`${t('matrix-left')} · 00:${String(Math.max(0, Math.ceil((total - el) / 1000))).padStart(2, '0')}`, W - 20, H - 20);
    ctx.fillStyle = 'rgba(60,255,122,.25)'; ctx.fillRect(0, H - 3, W * (1 - p), 3);
    ctx.restore();
  }
  // while it runs there is no way out: swallow clicks, keys, wheel and touch
  const block = e => { if (on){ e.preventDefault(); e.stopPropagation(); } };
  ['click', 'wheel', 'touchmove', 'contextmenu'].forEach(ev => cv.addEventListener(ev, block, { passive: false }));
  window.addEventListener('keydown', e => { if (on){ e.preventDefault(); e.stopImmediatePropagation(); } }, true);

  return { start, stop: () => {}, get on(){ return on; } };
})();

/* =========================================================================
   FPS / NERD STATS HUD
   ========================================================================= */
const hud = (function(){
  const el = $('#fps-hud'), g = $('#hud-graph'), gx = g.getContext('2d');
  let on = false, frames = 0, lastSec = performance.now(), hist = [];
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  function loop(now){
    if (!on) return;
    frames++;
    if (now - lastSec >= 500){
      const fps = Math.round(frames * 1000 / (now - lastSec)); frames = 0; lastSec = now;
      hist.push(fps); if (hist.length > 60) hist.shift();
      $('#hud-fps').textContent = fps;
      $('#hud-dom').textContent = document.getElementsByTagName('*').length;
      const max = document.documentElement.scrollHeight - innerHeight;
      $('#hud-scroll').textContent = Math.round(max > 0 ? scrollY / max * 100 : 0) + '%';
      if (performance.memory) $('#hud-mem').textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      $('#hud-load').textContent = nav && nav.loadEventEnd ? Math.round(nav.loadEventEnd) + ' ms' : Math.round(performance.now()) + ' ms*';
      gx.clearRect(0, 0, 300, 68);
      gx.strokeStyle = getComputedStyle(root).getPropertyValue('--maroon').trim() || '#7A1F2B'; gx.lineWidth = 2; gx.beginPath();
      hist.forEach((v, i) => { const x = i * 5, y = 66 - clamp(v, 0, 120) / 120 * 64; i ? gx.lineTo(x, y) : gx.moveTo(x, y); });
      gx.stroke();
    }
    requestAnimationFrame(loop);
  }
  function toggle(){ on = !on; el.classList.toggle('show', on); if (on){ lastSec = performance.now(); frames = 0; requestAnimationFrame(loop); } }
  return { toggle };
})();

/* =========================================================================
   SILLY MODES
   ========================================================================= */
/* Page modes: 'disco' and 'green' (terminal look). Only one is active at a time:
   turning one on switches the other off; pressing the active one again returns to normal. */
let pageMode = null;
function setMode(m){
  const next = pageMode === m ? null : m;
  if (pageMode) toast(t(`toast-${pageMode}-off`), 1400);
  root.classList.remove('disco', 'green');
  pageMode = next;
  if (next){ root.classList.add(next); toast(t(`toast-${next}-on`), 1600); }
  readColors();                                  // hero sphere / canvases pick up the new accent colour
  $$('.fx-btn[data-action="disco"], .fx-btn[data-action="terminal"]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.action === 'disco' ? 'disco' : 'green') === pageMode)));
}
function disco(){ setMode('disco'); }
function greenMode(){ setMode('green'); }
/* barrel roll: the whole page does one full 360° spin (one-shot, works in any mode) */
let rolling = false;
function flip(){
  if (rolling || reduceMotion) return; rolling = true;
  root.style.transformOrigin = `50% ${scrollY + innerHeight / 2}px`;   // spin around the middle of the screen
  const a = root.animate([
    { transform: 'rotate(0deg) scale(1)' },
    { transform: 'rotate(180deg) scale(.82)', offset: .5 },
    { transform: 'rotate(360deg) scale(1)' },
  ], { duration: 1300, easing: 'cubic-bezier(.65,0,.35,1)' });
  a.onfinish = a.oncancel = () => { rolling = false; root.style.transformOrigin = ''; };
}
