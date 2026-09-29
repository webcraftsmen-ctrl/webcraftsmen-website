/* =========================================================================
   WebCraftsmen — site data (edit here)
   1) CONFIG · PORTFOLIO   2) TRANSLATIONS (RO / EN)   3) LIVE-DEMO CODE
   ========================================================================= */

/* -------------------------------------------------------------------------
   1) CONFIG & PORTFOLIO
   ------------------------------------------------------------------------- */
const CONFIG = {
  email: 'hello@webcraftsolutions.dev',
  phone: '+40731386809',
  // Used for the "available now" badge in the hero. Days: 1 = Monday … 7 = Sunday.
  officeHours: { days: [1, 2, 3, 4, 5], start: 9, end: 18 },
};

/* PORTFOLIO — shown in the live viewer, in this order.
   `page` is a key of the bundled #pages-data (the files in /portfolio are the originals).
   To add a project: add its page to /portfolio, re-bundle, and add an entry here. */
const PORTFOLIO = [
  { page: 'portfolio/bakery.html', title: { ro: 'Hearth & Grain', en: 'Hearth & Grain' },
    desc: { ro: 'Brutărie & cafenea · layout cald, centrat, cu meniul zilei', en: 'Bakery & café · warm, centered layout with a daily menu' } },
  { page: 'portfolio/law.html', title: { ro: 'Alderwood Family Law', en: 'Alderwood Family Law' },
    desc: { ro: 'Cabinet de avocatură · hero întunecat, formal, cu cifre de încredere', en: 'Law firm · dark, formal split hero with trust stats' } },
  { page: 'portfolio/fitness.html', title: { ro: 'Pulse', en: 'Pulse' },
    desc: { ro: 'Studio de fitness · îndrăzneț, dark, cu program de clase', en: 'Fitness studio · bold, dark, with a class schedule' } },
  { page: 'portfolio/dental.html', title: { ro: 'Northline Dental', en: 'Northline Dental' },
    desc: { ro: 'Clinică dentară · luminos, liniștitor, cu listă de beneficii', en: 'Dental clinic · soft, reassuring, with a benefits checklist' } },
  { page: 'portfolio/florist.html', title: { ro: 'Coastal Bloom', en: 'Coastal Bloom' },
    desc: { ro: 'Florărie · editorial, cu galerie de produse', en: 'Florist · editorial split hero with a product gallery' } },
  { page: 'portfolio/architecture.html', title: { ro: 'Ferro & Co.', en: 'Ferro & Co.' },
    desc: { ro: 'Birou de arhitectură · alb-negru, pe grilă, cu portofoliu', en: 'Architecture studio · black & white, grid-lined, with a portfolio' } },
  { page: 'portfolio/pet.html', title: { ro: 'Brightside', en: 'Brightside' },
    desc: { ro: 'Pet care · jucăuș, rotunjit, cu echipa și tarife', en: 'Pet care · playful, rounded, with team and rates' } },
  { page: 'portfolio/realty.html', title: { ro: 'Summit Ridge Realty', en: 'Summit Ridge Realty' },
    desc: { ro: 'Imobiliare · verde și auriu, cu grilă de anunțuri', en: 'Real estate · forest & gold, with a listings grid' } },
  { page: 'portfolio/coffee.html', title: { ro: 'Vela Coffee Roasters', en: 'Vela Coffee Roasters' },
    desc: { ro: 'Prăjitorie de cafea · întunecat, cu carduri de origine', en: 'Coffee roaster · moody, dark, with origin cards' } },
];

/* -------------------------------------------------------------------------
   2) TRANSLATIONS
   ------------------------------------------------------------------------- */
const I18N = {
  ro: {
    'skip':'Sari la conținut','pl-skip':'click pentru a sări',
    'nav-services':'Servicii','nav-work':'Portofoliu','nav-process':'Proces','nav-pricing':'Prețuri','nav-contact':'Contact',
    'aria-theme':'Schimbă tema','aria-lang':'Schimbă limba în engleză','aria-menu':'Meniu',
    'hero-eyebrow':'București, România',
    'hero-title':'Site-uri web <span class="accent">construite</span> temeinic.',
    'rot-prefix':'Pentru',
    'hero-lead':'Proiectăm și dezvoltăm site-uri rapide, clare și ușor de întreținut pentru afaceri din România. Fără șabloane, fără cod inutil.',
    'hero-cta1':'Vezi prețurile','hero-cta3':'Vezi lucrările',
    'hero-side':'ora Bucureștiului · click pe sferă','scroll':'scroll',
    'status-open':'Disponibili acum','status-closed':'Răspundem de dimineață',
    'svc-kicker':'Ce facem','svc-title':'Tot ce ține de site-ul tău, făcut ca la carte.',
    'svc-sub':'De la prima schiță până la ultimul pixel — fiecare site e proiectat și scris de mână, pentru afacerea ta.',
    'svc1-t':'Design la comandă','svc1-d':'Nicio temă cumpărată. Identitate vizuală potrivită brandului tău, gândită pentru clienții tăi.',
    'svc2-t':'Cod scris de mână','svc2-d':'Fără cod inutil și fără pluginuri grele. Doar ce trebuie, ușor de întreținut pe termen lung.',
    'svc3-t':'Rapid și mobil','svc3-d':'Viteză mare de încărcare și optimizare completă pentru telefon — acolo unde sunt clienții tăi.',
    'svc4-t':'Backend și baze de date','svc4-d':'Conturi, rezervări, comenzi, panouri de administrare — funcționalitate completă, la comandă.',
    'demo-play':'Pornește','demo-pause':'Pauză','demo-resume':'Continuă','demo-replay':'Din nou','demo-skip':'Sari la final','demo-speed':'Viteză',
    'demo-chars':'caractere',
    'dev-desktop':'Desktop','dev-tablet':'Tabletă','dev-mobile':'Telefon',
    'proc-kicker':'Proces','proc-title':'Patru pași. Zero haos.','proc-sub':'Știi mereu în ce etapă suntem și ce urmează.',
    'p1-t':'Discuție','p1-d':'Ne povestești despre afacere, clienți și obiective. Stabilim pachetul potrivit.',
    'p2-t':'Design','p2-d':'Propunem direcția vizuală și structura paginilor. Ajustăm până îți place.',
    'p3-t':'Dezvoltare','p3-d':'Scriem codul de la zero, testăm pe telefon și desktop, optimizăm viteza.',
    'p4-t':'Lansare','p4-d':'Site-ul intră online. Îți arătăm cum funcționează și rămânem aproape.',
    'st1':'șabloane folosite','st2':'cod scris de mână','st3':'limbi pe acest site','st4':'timp de răspuns, de obicei',
    'pricing-kicker':'Prețuri','pricing-title':'Două moduri de a începe.','pricing-sub':'Preț fix, fără surprize. Alegi pachetul potrivit pentru stadiul afacerii tale.',
    'tier1-badge':'Pentru început','tier1-name':'Site web','tier1-note':'Ideal ca primă prezență online.',
    't1-f1':'Design la comandă, potrivit brandului','t1-f2':'Optimizat complet pentru mobil','t1-f3':'Viteză mare de încărcare',
    't1-f4':'Fără bază de date','t1-f5':'Fără interacțiuni complexe','t1-f6':'Actualizări anuale timp de 3 ani','t1-btn':'Alege acest pachet',
    'tier2-badge':'Pentru afaceri în creștere','tier2-name':'Aplicație','tier2-note':'Funcționalitate completă, la comandă.',
    't2-f2':'Interacțiuni complexe cu utilizatorul','t2-f3':'Bază de date',
    't2-btn':'Alege acest pachet',
    'contact-kicker':'Contact','contact-title':'Hai să vorbim.','contact-sub':'Scrie-ne direct sau sună-ne — răspundem rapid, de obicei în aceeași zi.',
    'contact-email-label':'Email','contact-phone-label':'Telefon','contact-loc-label':'Locație','contact-loc-val':'București, România','copy':'Copiază',
    'fx-price':'Preț special?','who-text':'Depinde și de cine ești.','who-ok':'Am înțeles','fx-green':'Mod terminal','toast-disco-on':'Modul disco: pornit 🪩','toast-disco-off':'Modul disco: oprit','toast-green-on':'Mod terminal: pornit','toast-green-off':'Mod terminal: oprit','matrix-left':'NU POȚI IEȘI','mx-lines':['Trezește-te, Neo…','Matrix-ul te are.','Urmează iepurele alb.'],'a-nav':'Principal','a-preview':'Previzualizare live','a-gallery':'Galerie','a-close':'Închide','a-prev':'Anterior','a-next':'Următor','a-device':'Dispozitiv','a-loading':'se încarcă…','a-palette':'Paleta de comenzi','a-term':'Comandă terminal','fun-disco':'Modul disco','fun-flip':'Barrel roll','c-write':'Scrie-ne un email','c-mail':'Trimite email','c-call':'Sună acum','c-local':'ora locală în București',
    'foot-fps':'Statistici nerd',
    'pal-ph':'Scrie o comandă sau caută…','pal-nav':'navighează','pal-run':'rulează','pal-close':'închide','pal-empty':'Nicio comandă găsită. Încearcă „temă” sau „matrix”.',
    'copied':'Copiat în clipboard ✓','copy-fail':'Nu am putut copia — selectează manual.',
    'toast-theme-dark':'Modul întunecat activat','toast-theme-light':'Modul luminos activat',
    
    'toast-lang':'Limba: Română',
    'tab-away':'Revino! Site-ul tău te așteaptă…',
    'pl-logs':['Încălzim serverele…','Aliniem div-urile la milimetru…','Negociem cu Internet Explorer… (am renunțat)','Lustruim pixelii…','Gata.'],
    'rotator':['restaurante.','clinici.','avocați.','startup-uri.','saloane.','hoteluri.','ateliere.','afacerea ta.'],
    'cmd-go':'Navigare','cmd-pref':'Preferințe','cmd-fun':'Distracție','cmd-contact':'Contact',
    'cmd-top':'Mergi sus','cmd-services':'Mergi la Servicii','cmd-demo':'Mergi la Demo live','cmd-work':'Mergi la Portofoliu','cmd-process':'Mergi la Proces',
    'cmd-pricing':'Mergi la Prețuri','cmd-contactgo':'Mergi la Contact',
    'cmd-lang':'Switch to English','cmd-theme':'Schimbă tema (luminos / întunecat)',
    'cmd-term':'Deschide terminalul','cmd-matrix':'Intră în Matrix','cmd-confetti':'Aruncă confetti','cmd-fps':'Arată / ascunde statisticile nerd',
    'cmd-disco':'Modul disco','cmd-replay':'Reia demo-ul live','cmd-flip':'Întoarce site-ul cu susul în jos',
    'cmd-copy':'Copiază adresa de email','cmd-mail':'Scrie-ne un email','cmd-call':'Sună-ne',
  },
  en: {
    'skip':'Skip to content','pl-skip':'click to skip',
    'nav-services':'Services','nav-work':'Work','nav-process':'Process','nav-pricing':'Pricing','nav-contact':'Contact',
    'aria-theme':'Toggle theme','aria-lang':'Switch language to Romanian','aria-menu':'Menu',
    'hero-eyebrow':'Bucharest, Romania',
    'hero-title':'Websites, <span class="accent">built</span> properly.',
    'rot-prefix':'For',
    'hero-lead':'We design and build fast, clear, easy-to-maintain websites for businesses in Romania. No templates, no bloat.',
    'hero-cta1':'See pricing','hero-cta3':'See our work',
    'hero-side':'Bucharest time · click the sphere','scroll':'scroll',
    'status-open':'Available now','status-closed':'Back in the morning',
    'svc-kicker':'What we do','svc-title':'Everything your website needs, done right.',
    'svc-sub':'From the first sketch to the last pixel — every site is designed and hand-coded for your business.',
    'svc1-t':'Custom design','svc1-d':'No bought themes. A visual identity that fits your brand, designed for your customers.',
    'svc2-t':'Hand-written code','svc2-d':'No bloat, no heavy plugins. Only what\'s needed — easy to maintain for years.',
    'svc3-t':'Fast & mobile','svc3-d':'Quick load times and full mobile optimization — right where your customers are.',
    'svc4-t':'Backend & databases','svc4-d':'Accounts, bookings, orders, admin panels — full custom functionality.',
    'demo-play':'Start','demo-pause':'Pause','demo-resume':'Resume','demo-replay':'Replay','demo-skip':'Skip to end','demo-speed':'Speed',
    'demo-chars':'characters',
    'dev-desktop':'Desktop','dev-tablet':'Tablet','dev-mobile':'Phone',
    'proc-kicker':'Process','proc-title':'Four steps. Zero chaos.','proc-sub':'You always know where we are and what comes next.',
    'p1-t':'Talk','p1-d':'You tell us about your business, customers and goals. We pick the right plan.',
    'p2-t':'Design','p2-d':'We propose a visual direction and page structure, and refine it until you love it.',
    'p3-t':'Build','p3-d':'We write the code from scratch, test on phone and desktop, and tune for speed.',
    'p4-t':'Launch','p4-d':'Your site goes live. We show you how it works and stay close.',
    'st1':'templates used','st2':'hand-written code','st3':'languages on this site','st4':'usual response time',
    'pricing-kicker':'Pricing','pricing-title':'Two ways to start.','pricing-sub':'Fixed price, no surprises. Pick the plan that fits where your business is at.',
    'tier1-badge':'To get started','tier1-name':'Website','tier1-note':'A solid first online presence.',
    't1-f1':'Custom design suited to your brand','t1-f2':'Fully optimized for mobile','t1-f3':'Fast load times',
    't1-f4':'No database','t1-f5':'No complex interactions','t1-f6':'Annual updates for 3 years','t1-btn':'Choose this plan',
    'tier2-badge':'For growing businesses','tier2-name':'Application','tier2-note':'Full custom functionality.',
    't2-f2':'Complex user interactions','t2-f3':'Database',
    't2-btn':'Choose this plan',
    'contact-kicker':'Contact','contact-title':'Let\'s talk.','contact-sub':'Email or call us — we usually reply the same day.',
    'contact-email-label':'Email','contact-phone-label':'Phone','contact-loc-label':'Location','contact-loc-val':'Bucharest, Romania','copy':'Copy',
    'fx-price':'Special price?','who-text':'Also depends on who you are.','who-ok':'Got it','fx-green':'Terminal mode','toast-disco-on':'Disco mode: on 🪩','toast-disco-off':'Disco mode: off','toast-green-on':'Terminal mode: on','toast-green-off':'Terminal mode: off','matrix-left':'THERE IS NO EXIT','mx-lines':['Wake up, Neo…','The Matrix has you.','Follow the white rabbit.'],'a-nav':'Main','a-preview':'Live preview','a-gallery':'Gallery','a-close':'Close','a-prev':'Previous','a-next':'Next','a-device':'Device','a-loading':'loading…','a-palette':'Command palette','a-term':'Terminal command','fun-disco':'Disco mode','fun-flip':'Barrel roll','c-write':'Email us','c-mail':'Send email','c-call':'Call now','c-local':'local time in Bucharest',
    'foot-fps':'Nerd stats',
    'pal-ph':'Type a command or search…','pal-nav':'navigate','pal-run':'run','pal-close':'close','pal-empty':'No commands found. Try “theme” or “matrix”.',
    'copied':'Copied to clipboard ✓','copy-fail':'Couldn\'t copy — please select it manually.',
    'toast-theme-dark':'Dark mode on','toast-theme-light':'Light mode on',
    
    'toast-lang':'Language: English',
    'tab-away':'Come back! Your website is waiting…',
    'pl-logs':['Warming up the servers…','Aligning divs to the pixel…','Negotiating with Internet Explorer… (gave up)','Polishing pixels…','Done.'],
    'rotator':['restaurants.','clinics.','law firms.','startups.','salons.','hotels.','workshops.','your business.'],
    'cmd-go':'Navigate','cmd-pref':'Preferences','cmd-fun':'Fun','cmd-contact':'Contact',
    'cmd-top':'Go to top','cmd-services':'Go to Services','cmd-demo':'Go to Live demo','cmd-work':'Go to Work','cmd-process':'Go to Process',
    'cmd-pricing':'Go to Pricing','cmd-contactgo':'Go to Contact',
    'cmd-lang':'Schimbă în Română','cmd-theme':'Toggle theme (light / dark)',
    'cmd-term':'Open terminal','cmd-matrix':'Enter the Matrix','cmd-confetti':'Throw confetti','cmd-fps':'Show / hide nerd stats',
    'cmd-disco':'Disco mode','cmd-replay':'Replay the live demo','cmd-flip':'Flip the site upside down',
    'cmd-copy':'Copy email address','cmd-mail':'Email us','cmd-call':'Call us',
  }
};

/* Live-demo source: the HTML skeleton (boring part) is shown instantly,
   the CSS (interesting part) is typed out live and styles the page as it goes. */
const DEMO_CODE = {
  ro: { file: 'brutaria-ana.html', url: 'https://brutaria-ana.ro', html: "<!-- brutaria-ana.html — structura e gata, acum vine partea frumoasă ↓ -->\n<header class=\"hero\">\n  <span class=\"badge\">● Deschis acum<\/span>\n  <h1>Brutăria <em>Ana<\/em><\/h1>\n  <p>Pâine cu maia, coaptă în fiecare dimineață din 1998.<\/p>\n  <div class=\"loaf\"><i><\/i><i><\/i><i><\/i><\/div>\n  <a class=\"btn\" href=\"#\">Comandă pentru mâine →<\/a>\n<\/header>\n<section class=\"menu\">\n  <article><b>Pâine cu maia<\/b><span>12 lei<\/span><\/article>\n  <article><b>Cozonac<\/b><span>35 lei<\/span><\/article>\n  <article><b>Covrigi<\/b><span>2 lei<\/span><\/article>\n  <article><b>Croissant<\/b><span>8 lei<\/span><\/article>\n<\/section>", css: ":root { --wine: #7A1F2B; --crust: #B5652B; --cream: #FFF8EE; --ink: #3B2416; }\nbody { margin: 0; font-family: Georgia, serif; color: var(--ink); background: var(--cream); }\n\n/* hero: un gradient viu, care curge \u00eencet */\n.hero {\n  position: relative; overflow: hidden; text-align: center; color: var(--cream);\n  padding: 44px 24px 60px;\n  background: linear-gradient(120deg, #4E1119, var(--wine), var(--crust), #4E1119);\n  background-size: 300% 300%; animation: glow 9s ease-in-out infinite;\n}\n@keyframes glow { 50% { background-position: 100% 50%; } }\n.badge { font: 12px/1 monospace; padding: 7px 13px; border-radius: 99px; background: rgba(255, 255, 255, .16); }\n.badge::first-letter { color: #7CFF9B; }\nh1 { font-size: clamp(34px, 7vw, 58px); margin: 16px 0 6px; letter-spacing: -1px; }\nh1 em { color: #FFD9A0; }\n.hero p { opacity: .85; margin: 0; }\n\n/* o p\u00e2ine desenat\u0103 doar din CSS: cre\u0219te \u0219i scoate aburi */\n.loaf {\n  position: relative; width: 150px; height: 84px; margin: 34px auto 22px;\n  border-radius: 75px 75px 26px 26px;\n  background: radial-gradient(circle at 30% 28%, #F0B878, var(--crust) 70%);\n  box-shadow: 0 18px 30px rgba(0, 0, 0, .35); animation: rise 3.2s ease-in-out infinite;\n  display: flex; justify-content: center; gap: 18px; padding-top: 22px; box-sizing: border-box;\n}\n.loaf i { width: 8px; height: 34px; border-radius: 4px; background: #8A4A1C; transform: rotate(24deg); }\n@keyframes rise { 50% { transform: translateY(-8px) scale(1.04); } }\n.loaf::before, .loaf::after {\n  content: ''; position: absolute; top: -40px; width: 12px; height: 34px; border-radius: 12px;\n  background: rgba(255, 255, 255, .45); filter: blur(4px); animation: steam 2.6s ease-in infinite;\n}\n.loaf::before { left: 48px; }\n.loaf::after { left: 88px; animation-delay: 1.3s; }\n@keyframes steam {\n  from { opacity: 0; transform: translateY(12px); }\n  40% { opacity: 1; }\n  to { opacity: 0; transform: translateY(-22px) scaleX(1.8); }\n}\n\n.btn {\n  display: inline-block; padding: 13px 24px; border-radius: 99px; text-decoration: none;\n  background: var(--cream); color: var(--wine); font-weight: bold; transition: transform .3s;\n}\n.btn:hover { transform: translateY(-3px) scale(1.05); }\n\n/* meniu: gril\u0103 responsiv\u0103, cardurile apar pe r\u00e2nd */\n.menu { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; padding: 26px; }\n.menu article {\n  display: flex; justify-content: space-between; align-items: baseline; padding: 18px;\n  border-radius: 16px; background: #fff; box-shadow: 0 10px 24px rgba(59, 36, 22, .10);\n  animation: pop .7s both;\n}\n.menu article:nth-child(2) { animation-delay: .12s; }\n.menu article:nth-child(3) { animation-delay: .24s; }\n.menu article:nth-child(4) { animation-delay: .36s; }\n.menu span { color: var(--wine); font-weight: bold; }\n@keyframes pop { from { opacity: 0; transform: translateY(18px) scale(.96); } }\n" },
  en: { file: 'anas-bakery.html', url: 'https://anas-bakery.ro', html: "<!-- anas-bakery.html — the structure is done, now the fun part ↓ -->\n<header class=\"hero\">\n  <span class=\"badge\">● Open now<\/span>\n  <h1>Ana's <em>Bakery<\/em><\/h1>\n  <p>Sourdough bread, baked fresh every morning since 1998.<\/p>\n  <div class=\"loaf\"><i><\/i><i><\/i><i><\/i><\/div>\n  <a class=\"btn\" href=\"#\">Order for tomorrow →<\/a>\n<\/header>\n<section class=\"menu\">\n  <article><b>Sourdough loaf<\/b><span>12 lei<\/span><\/article>\n  <article><b>Cozonac<\/b><span>35 lei<\/span><\/article>\n  <article><b>Pretzels<\/b><span>2 lei<\/span><\/article>\n  <article><b>Croissant<\/b><span>8 lei<\/span><\/article>\n<\/section>", css: ":root { --wine: #7A1F2B; --crust: #B5652B; --cream: #FFF8EE; --ink: #3B2416; }\nbody { margin: 0; font-family: Georgia, serif; color: var(--ink); background: var(--cream); }\n\n/* hero: a slow, living gradient */\n.hero {\n  position: relative; overflow: hidden; text-align: center; color: var(--cream);\n  padding: 44px 24px 60px;\n  background: linear-gradient(120deg, #4E1119, var(--wine), var(--crust), #4E1119);\n  background-size: 300% 300%; animation: glow 9s ease-in-out infinite;\n}\n@keyframes glow { 50% { background-position: 100% 50%; } }\n.badge { font: 12px/1 monospace; padding: 7px 13px; border-radius: 99px; background: rgba(255, 255, 255, .16); }\n.badge::first-letter { color: #7CFF9B; }\nh1 { font-size: clamp(34px, 7vw, 58px); margin: 16px 0 6px; letter-spacing: -1px; }\nh1 em { color: #FFD9A0; }\n.hero p { opacity: .85; margin: 0; }\n\n/* a loaf drawn purely in CSS: it rises, and it steams */\n.loaf {\n  position: relative; width: 150px; height: 84px; margin: 34px auto 22px;\n  border-radius: 75px 75px 26px 26px;\n  background: radial-gradient(circle at 30% 28%, #F0B878, var(--crust) 70%);\n  box-shadow: 0 18px 30px rgba(0, 0, 0, .35); animation: rise 3.2s ease-in-out infinite;\n  display: flex; justify-content: center; gap: 18px; padding-top: 22px; box-sizing: border-box;\n}\n.loaf i { width: 8px; height: 34px; border-radius: 4px; background: #8A4A1C; transform: rotate(24deg); }\n@keyframes rise { 50% { transform: translateY(-8px) scale(1.04); } }\n.loaf::before, .loaf::after {\n  content: ''; position: absolute; top: -40px; width: 12px; height: 34px; border-radius: 12px;\n  background: rgba(255, 255, 255, .45); filter: blur(4px); animation: steam 2.6s ease-in infinite;\n}\n.loaf::before { left: 48px; }\n.loaf::after { left: 88px; animation-delay: 1.3s; }\n@keyframes steam {\n  from { opacity: 0; transform: translateY(12px); }\n  40% { opacity: 1; }\n  to { opacity: 0; transform: translateY(-22px) scaleX(1.8); }\n}\n\n.btn {\n  display: inline-block; padding: 13px 24px; border-radius: 99px; text-decoration: none;\n  background: var(--cream); color: var(--wine); font-weight: bold; transition: transform .3s;\n}\n.btn:hover { transform: translateY(-3px) scale(1.05); }\n\n/* menu: responsive grid, cards pop in one by one */\n.menu { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; padding: 26px; }\n.menu article {\n  display: flex; justify-content: space-between; align-items: baseline; padding: 18px;\n  border-radius: 16px; background: #fff; box-shadow: 0 10px 24px rgba(59, 36, 22, .10);\n  animation: pop .7s both;\n}\n.menu article:nth-child(2) { animation-delay: .12s; }\n.menu article:nth-child(3) { animation-delay: .24s; }\n.menu article:nth-child(4) { animation-delay: .36s; }\n.menu span { color: var(--wine); font-weight: bold; }\n@keyframes pop { from { opacity: 0; transform: translateY(18px) scale(.96); } }\n" },
};
