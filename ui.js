/* =========================================================================
   COMMAND PALETTE (Ctrl/⌘ + K) — fuzzy search with highlighting
   ========================================================================= */
const palette = (function(){
  const ov = $('#palette-overlay'), input = $('#palette-input'), list = $('#palette-list');
  let sel = 0, results = [], lastFocus = null;
  const C = (label, group, run) => ({ label, group, run });
  const cmds = () => [
    C('cmd-top', 'cmd-go', () => goTo('top')),
    C('cmd-services', 'cmd-go', () => goTo('servicii')),
    C('cmd-demo', 'cmd-go', () => goTo('demo')),
    C('cmd-work', 'cmd-go', () => portfolio.open()),
    C('cmd-process', 'cmd-go', () => goTo('proces')),
    C('cmd-pricing', 'cmd-go', () => goTo('preturi')),
    C('cmd-contactgo', 'cmd-go', () => goTo('contact')),
    C('cmd-lang', 'cmd-pref', toggleLang),
    C('cmd-theme', 'cmd-pref', () => toggleTheme(undefined, undefined, true)),
    C('cmd-term', 'cmd-fun', () => terminal.open()),
    C('cmd-matrix', 'cmd-fun', () => matrix.start()),
    C('cmd-confetti', 'cmd-fun', () => confetti()),
    C('cmd-disco', 'cmd-fun', disco),
    C('cmd-flip', 'cmd-fun', flip),
    C('cmd-fps', 'cmd-fun', () => hud.toggle()),
    C('cmd-replay', 'cmd-fun', () => demo.replay()),
    C('cmd-copy', 'cmd-contact', () => copyText(CONFIG.email)),
    C('cmd-mail', 'cmd-contact', () => { location.href = 'mailto:' + CONFIG.email; }),
    C('cmd-call', 'cmd-contact', () => { location.href = 'tel:' + CONFIG.phone; }),
  ];
  // subsequence fuzzy match → returns score + matched indices (or null)
  function fuzzy(q, s){
    if (!q) return { score: 0, idx: [] };
    const a = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const b = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let j = 0, score = 0, prev = -2; const idx = [];
    for (let i = 0; i < b.length && j < a.length; i++){
      if (b[i] === a[j]){ idx.push(i); score += (i === prev + 1 ? 5 : 1) + (i === 0 || b[i - 1] === ' ' ? 3 : 0); prev = i; j++; }
    }
    return j === a.length ? { score, idx } : null;
  }
  function render(){
    const q = input.value.trim();
    results = cmds().map(c => { const label = t(c.label); const m = fuzzy(q, label); return m && Object.assign({}, c, { text: label, m }); })
      .filter(Boolean).sort((a, b) => b.m.score - a.m.score);
    sel = clamp(sel, 0, Math.max(0, results.length - 1));
    if (!results.length){ list.innerHTML = `<li class="empty">${t('pal-empty')}</li>`; return; }
    list.innerHTML = results.map((r, i) => {
      const s = new Set(r.m.idx);
      const txt = Array.from(r.text).map((ch, k) => s.has(k) ? `<mark>${ch}</mark>` : ch).join('');
      return `<li role="option" data-i="${i}" class="${i === sel ? 'sel' : ''}" aria-selected="${i === sel}"><span>${txt}</span><span class="grp">${t(r.group)}</span></li>`;
    }).join('');
    const cur = list.children[sel]; if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
  }
  function open(){ lastFocus = document.activeElement; ov.classList.add('open'); input.value = ''; sel = 0; render(); input.focus(); }
  function close(){ ov.classList.remove('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function run(i){ const r = results[i]; if (!r) return; close(); setTimeout(r.run, 60); }
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown'){ e.preventDefault(); sel = (sel + 1) % Math.max(1, results.length); render(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); sel = (sel - 1 + results.length) % Math.max(1, results.length); render(); }
    else if (e.key === 'Enter'){ e.preventDefault(); run(sel); }
    else if (e.key === 'Escape'){ close(); }
  });
  list.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) run(+li.dataset.i); });
  list.addEventListener('pointermove', e => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== sel){ sel = +li.dataset.i; $$('li', list).forEach((x, i) => x.classList.toggle('sel', i === sel)); } });
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  return { open, close, isOpen: () => ov.classList.contains('open') };
})();

/* =========================================================================
   TERMINAL (press ` or ~) — a tiny fake shell
   ========================================================================= */
const terminal = (function(){
  const ov = $('#term-overlay'), out = $('#term-out'), input = $('#term-input'), body = $('#term-body');
  const hist = []; let hi = 0, booted = false;
  const tr = (ro, en) => (LANG === 'ro' ? ro : en);
  const print = (txt, cls = '') => { const d = document.createElement('div'); d.className = 'line ' + cls; d.innerHTML = txt; out.appendChild(d); body.scrollTop = body.scrollHeight; };
  const sections = { services: 'servicii', servicii: 'servicii', demo: 'demo', work: 'portofoliu', portofoliu: 'portofoliu', process: 'proces', proces: 'proces', pricing: 'preturi', preturi: 'preturi', contact: 'contact', top: 'top' };
  const CMDS = {
    help: () => tr(
`<span class="hl">Comenzi disponibile:</span>
  help              lista asta
  about             cine suntem
  services          ce facem
  pricing           prețuri
  contact           date de contact
  goto &lt;secțiune&gt;    services · demo · work · process · pricing · contact
  lang ro|en        schimbă limba
  theme             luminos ⇄ întunecat
  matrix · confetti · disco · flip · stats
  date · whoami · ls · cat &lt;fișier&gt; · echo · history
  sudo hire-webcraftsmen
  clear · exit`,
`<span class="hl">Available commands:</span>
  help              this list
  about             who we are
  services          what we do
  pricing           pricing
  contact           contact details
  goto &lt;section&gt;     services · demo · work · process · pricing · contact
  lang ro|en        switch language
  theme             light ⇄ dark
  matrix · confetti · disco · flip · stats
  date · whoami · ls · cat &lt;file&gt; · echo · history
  sudo hire-webcraftsmen
  clear · exit`),
    about: () => tr('WebCraftsmen — site-uri web construite temeinic, în București.\nProiectăm și dezvoltăm site-uri rapide, clare și ușor de întreținut. Fără șabloane, fără cod inutil.',
                    'WebCraftsmen — websites built properly, in Bucharest.\nWe design and build fast, clear, easy-to-maintain websites. No templates, no bloat.'),
    services: () => ['svc1-t', 'svc2-t', 'svc3-t', 'svc4-t'].map((k, i) => `  <span class="ok">0${i + 1}</span> ${t(k)}`).join('\n'),
    pricing: () => `  ${t('tier1-name').padEnd(24)} <span class="ok">€1554</span>\n  ${t('tier2-name').padEnd(24)} <span class="ok">€6840</span>\n  <span class="dim">${t('pricing-sub')}</span>`,
    contact: () => `  email   <span class="ok">${CONFIG.email}</span>\n  ${tr('telefon', 'phone  ')} <span class="ok">+40 731 386 809</span>\n  ${tr('locație', 'where  ')} ${t('contact-loc-val')}`,
    goto: (a) => { const id = sections[(a[0] || '').toLowerCase()]; if (id === 'portofoliu'){ close(); setTimeout(() => portfolio.open(), 120); return '→ portofoliu'; } if (!id) return tr('Secțiune necunoscută. Încearcă: ', 'Unknown section. Try: ') + 'services, demo, work, process, pricing, contact'; close(); setTimeout(() => goTo(id), 100); return '→ ' + id; },
    lang: (a) => { const l = (a[0] || '').toLowerCase(); if (l !== 'ro' && l !== 'en') return 'usage: lang ro|en'; applyLang(l, true); return l === 'ro' ? 'Limba: Română ✓' : 'Language: English ✓'; },
    theme: () => { toggleTheme(undefined, undefined, false); return '✓ ' + root.getAttribute('data-theme'); },
    matrix: () => { close(); setTimeout(matrix.start, 150); return tr('Urmează iepurele alb…', 'Follow the white rabbit…'); },
    confetti: () => { confetti(); return '🎉'; },
    disco: () => { close(); setTimeout(disco, 150); return '🪩'; },
    flip: () => { close(); setTimeout(flip, 150); return '🙃'; },
    stats: () => { hud.toggle(); return 'HUD ⇄'; },
    date: () => new Intl.DateTimeFormat(LANG === 'ro' ? 'ro-RO' : 'en-GB', { timeZone: 'Europe/Bucharest', dateStyle: 'full', timeStyle: 'medium' }).format(new Date()) + ' (Europe/Bucharest)',
    whoami: () => tr('un vizitator cu gusturi excelente', 'a visitor with excellent taste'),
    ls: () => '<span class="hl">about.txt</span>  <span class="hl">pricing.txt</span>  <span class="hl">contact.txt</span>  <span class="dim">secrets/</span>',
    cat: (a) => { const f = (a[0] || '').replace(/\.txt$/, ''); if (CMDS[f] && ['about', 'pricing', 'contact'].includes(f)) return CMDS[f](); if (f.indexOf('secrets') === 0) return tr('Permisiune refuzată. Frumoasă încercare.', 'Permission denied. Nice try.'); return `cat: ${a[0] || ''}: ${tr('fișier inexistent', 'no such file')}`; },
    echo: (a) => a.join(' ').replace(/</g, '&lt;'),
    history: () => hist.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h.replace(/</g, '&lt;')}`).join('\n'),
    sudo: (a) => {
      if ((a[0] || '') === 'hire-webcraftsmen'){ close(); setTimeout(() => { confetti(); goTo('contact'); }, 150); return tr('[sudo] parolă acceptată. Te ducem la contact…', '[sudo] password accepted. Taking you to contact…'); }
      return tr('Nice try. Doar „sudo hire-webcraftsmen” funcționează aici.', 'Nice try. Only "sudo hire-webcraftsmen" works here.');
    },
    rm: () => tr('Hei! Nu ștergem nimic aici. 😅', 'Hey! We don\'t delete things here. 😅'),
    clear: () => { out.innerHTML = ''; return null; },
    exit: () => { close(); return null; },
  };
  function exec(line){
    const raw = line.trim(); if (!raw) return;
    hist.push(raw); hi = hist.length;
    print(`<span class="p">guest@webcraftsmen:~$</span> ${raw.replace(/</g, '&lt;')}`);
    const [cmd, ...args] = raw.split(/\s+/);
    const fn = CMDS[cmd.toLowerCase()];
    if (!fn){ print(`${cmd.replace(/</g, '&lt;')}: ${tr('comandă necunoscută. Scrie', 'command not found. Type')} <span class="hl">help</span>`, 'dim'); return; }
    const res = fn(args); if (res !== null && res !== undefined) print(res, 'ok');
  }
  function boot(){
    booted = true;
    print(`<span class="hl">╔══════════════════════════════════════════╗
║   W E B C R A F T S M E N   O S   v2.0   ║
╚══════════════════════════════════════════╝</span>`);
    print(tr('Scrie <span class="hl">help</span> pentru comenzi.', 'Type <span class="hl">help</span> for commands.'), 'dim');
  }
  function open(){ if (!booted) boot(); ov.classList.add('open'); input.focus(); }
  function close(){ ov.classList.remove('open'); }
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){ exec(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); if (hi > 0){ hi--; input.value = hist[hi]; } }
    else if (e.key === 'ArrowDown'){ e.preventDefault(); if (hi < hist.length - 1){ hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } }
    else if (e.key === 'Tab'){
      e.preventDefault();
      const m = Object.keys(CMDS).filter(k => k.startsWith(input.value.trim()));
      if (m.length === 1) input.value = m[0] + ' '; else if (m.length) print(m.join('  '), 'dim');
    }
    else if (e.key === 'Escape') close();
    else if (e.key === 'l' && e.ctrlKey){ e.preventDefault(); out.innerHTML = ''; }
  });
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  body.addEventListener('click', () => input.focus());
  return { open, close, isOpen: () => ov.classList.contains('open') };
})();

/* "special price?" dialog */
const whoBox = $('#who-dlg');
function whoDlg(open){ whoBox.classList.toggle('open', open); if (open) setTimeout(() => $('#who-ok').focus(), 20); }
$('#who-ok').addEventListener('click', () => whoDlg(false));
whoBox.addEventListener('click', e => { if (e.target === whoBox) whoDlg(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && whoBox.classList.contains('open')) whoDlg(false); });

/* data-action buttons: section effect buttons + "Portofoliu" / "Vezi lucrările" */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-action]'); if (!b) return;
  const a = b.dataset.action;
  if (a === 'work'){ e.preventDefault(); portfolio.open(); }
  if (a === 'terminal') greenMode();
  if (a === 'matrix') matrix.start();
  if (a === 'fps') hud.toggle();
  if (a === 'disco') disco();
  if (a === 'flip') flip();
  if (a === 'whoami') whoDlg(true);
});

/* =========================================================================
   SECTION-BY-SECTION SCROLL (mouse / trackpad / keyboard)
   One wheel gesture = one step: the next section snaps into place. Sections
   taller than the screen are walked through in screen-sized steps first,
   so nothing inside them is skipped. Touch devices use native CSS snapping.
   ========================================================================= */
(function sectionScroll(){
  if (!finePointer) return;
  const stops = () => $$('main > section');
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  let animating = false, lastWheel = 0, lastJump = 0, lastMag = 0, usedGesture = false;
  const blocked = () => document.body.classList.contains('locked') || matrix.on || $('.overlay.open') || $('.lightbox.open');
  function animateTo(y){
    y = clamp(Math.round(y), 0, maxY());
    const from = scrollY, dist = y - from;
    if (Math.abs(dist) < 2) return;
    if (reduceMotion){ window.scrollTo({ top: y, behavior: 'instant' }); return; }
    animating = true;
    const dur = clamp(Math.abs(dist) * 0.55, 550, 950), t0 = performance.now();
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    (function f(now){
      const p = clamp((now - t0) / dur, 0, 1);
      window.scrollTo({ top: from + dist * ease(p), behavior: 'instant' });
      if (p < 1) requestAnimationFrame(f); else animating = false;
    })(t0);
  }
  function targetFor(dir){
    const list = stops(), y = scrollY, vh = innerHeight, page = vh * 0.85;
    let idx = 0;
    list.forEach((el, i) => { if (el.getBoundingClientRect().top + y <= y + 5) idx = i; });
    const el = list[idx], top = el.getBoundingClientRect().top + y, bottom = top + el.offsetHeight;
    if (dir > 0){
      const rest = bottom - (y + vh);
      if (rest > vh * 0.25) return y + Math.min(rest, page);                       // still more of this section below
      const next = list[idx + 1];
      return next ? next.getBoundingClientRect().top + y : maxY();
    }
    const above = y - top;
    if (above > vh * 0.25) return y - Math.min(above, page);                       // still more of this section above
    const prev = list[idx - 1];
    if (!prev) return 0;
    const pTop = prev.getBoundingClientRect().top + y;
    return Math.max(pTop, pTop + prev.offsetHeight - vh);                 // land on the end of a tall section
  }
  window.addEventListener('wheel', e => {
    if (e.ctrlKey || blocked()) return;
    if (e.target.closest && e.target.closest('.term-body, .palette ul')) return;
    e.preventDefault();
    // One section per gesture.
    // • Trackpads keep sending a fading "inertia" tail for 1–3 s after the fingers lift
    //   (macOS cancels it only when the mouse moves). Only meaningful deltas (≥ 6) keep a
    //   gesture alive, so that faint tail can't swallow the user's next swipe.
    // • A fresh swipe during the tail shows up as a sudden jump in strength → new gesture.
    // • A 900 ms cooldown after each jump stops the strong start of the inertia from
    //   triggering a second jump (the old "skips a page" bug).
    const now = performance.now(), mag = Math.abs(e.deltaY);
    const fresh = now - lastWheel > 250 || (now - lastJump > 900 && mag >= 25 && mag > lastMag * 2.5);
    if (mag >= 6){ if (fresh) usedGesture = false; lastWheel = now; }
    else if (now - lastWheel > 250) usedGesture = false;
    lastMag = mag;
    if (animating || usedGesture || now - lastJump < 900 || mag < 10) return;   // a faint tail never jumps
    usedGesture = true; lastJump = now;
    animateTo(targetFor(e.deltaY > 0 ? 1 : -1));
  }, { passive: false });
  document.addEventListener('keydown', e => {
    const tag = (document.activeElement || {}).tagName || '';
    if (blocked() || /INPUT|TEXTAREA|SELECT/.test(tag) || (e.key === ' ' && /BUTTON|A/.test(tag))) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(e.key), up = ['ArrowUp', 'PageUp'].includes(e.key);
    if (!down && !up) return;
    e.preventDefault();
    if (!animating) animateTo(targetFor(down ? 1 : -1));
  });
})();


/* =========================================================================
   GLOBAL KEYBOARD: shortcuts + Konami code
   ========================================================================= */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let kpos = 0;
document.addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); palette.isOpen() ? palette.close() : palette.open(); return; }
  if (e.key === 'Escape'){ if (terminal.isOpen()) terminal.close(); }
  if (typing) return;
  if (e.code === 'Backquote' || e.key === '`' || e.key === '~'){ e.preventDefault(); terminal.isOpen() ? terminal.close() : terminal.open(); return; }
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === KONAMI[kpos] ? kpos + 1 : (k === KONAMI[0] ? 1 : 0);
  if (kpos === KONAMI.length){ kpos = 0; disco(); }
});

/* =========================================================================
   TAB TITLE + CONSOLE GREETING
   ========================================================================= */
let savedTitle = document.title;
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ savedTitle = document.title; document.title = t('tab-away'); }
  else document.title = savedTitle;
});
console.log('%cWebCraftsmen', 'font:700 28px "Space Grotesk",sans-serif;color:#7A1F2B');
console.log('%cSalut, curiosule! 👋  Tot site-ul ăsta e scris de mână — zero framework-uri, zero șabloane.\nHi there! Every line of this site is hand-written — zero frameworks, zero templates.\n→ ' + CONFIG.email, 'font:13px Inter,sans-serif;color:#6B625C');

/* =========================================================================
   PRICING — phone carousel (dots + swipe either way)
   ========================================================================= */
(function priceDots(){
  const row = $('.pricing-layout'), dots = $$('#price-dots i');
  row.addEventListener('scroll', () => {
    const cards = $$('.price-card', row); if (!cards.length) return;
    const mid = row.scrollLeft + row.clientWidth / 2;
    let best = 0, bd = 1e9;
    cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd){ bd = d; best = i; } });
    dots.forEach((dt, i) => dt.classList.toggle('on', i === best));
  }, { passive: true });
  const cardsOf = () => $$('.price-card', row);
  const current = () => dots.findIndex(dt => dt.classList.contains('on'));
  const show = (i) => { const c = cardsOf()[i]; if (c) row.scrollTo({ left: c.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' }); };
  dots.forEach((dt, i) => dt.addEventListener('click', () => show(i)));

  /* phones: a horizontal swipe in EITHER direction moves to the other plan (wraps around) */
  const phone = matchMedia('(max-width:700px)');
  let x0 = 0, y0 = 0, dx = 0, axis = null;
  row.addEventListener('touchstart', e => {
    if (!phone.matches) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; axis = null;
    row.classList.add('dragging');
  }, { passive: true });
  row.addEventListener('touchmove', e => {
    if (!phone.matches) return;
    const mx = e.touches[0].clientX - x0, my = e.touches[0].clientY - y0;
    if (!axis && (Math.abs(mx) > 8 || Math.abs(my) > 8)) axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
    if (axis === 'x'){ e.preventDefault(); dx = mx; row.style.setProperty('--drag', (dx * 0.35) + 'px'); }
  }, { passive: false });
  row.addEventListener('touchend', () => {
    if (!phone.matches) return;
    row.classList.remove('dragging');
    row.style.setProperty('--drag', '0px');
    if (axis === 'x' && Math.abs(dx) > 40){
      const n = cardsOf().length, cur = Math.max(0, current());
      show((cur + (dx < 0 ? 1 : -1) + n) % n);
    }
    axis = null;
  });
})();

/* =========================================================================
   EFFECT BUTTONS on phones: dock each one on its section's kicker row
   (or the code-window bar in the demo) so it never covers content
   ========================================================================= */
(function dockFx(){
  const phone = matchMedia('(max-width:700px)');
  const btns = $$('.fx-btn').map(b => ({ b, home: b.parentElement, dock: $('.section-head', b.parentElement) || $('.window-bar', b.parentElement) }));
  const place = () => btns.forEach(({ b, home, dock }) => {
    const target = phone.matches && dock ? dock : home;
    if (b.parentElement !== target) target.appendChild(b);
  });
  place();
  phone.addEventListener('change', place);
})();

/* =========================================================================
   INIT
   ========================================================================= */
applyLang(LANG, false);
