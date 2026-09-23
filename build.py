#!/usr/bin/env python3
"""
WebCraftsmen — build script
===========================
Assembles the single-file site (../index.html) from the readable sources in this folder.

    python3 build.py            # production: minified CSS/JS/HTML  (needs `esbuild` on PATH or via npx)
    python3 build.py --pretty   # readable output, handy for debugging

Sources
    head.html          <head> meta, icons, fonts, pre-paint theme/lang script
    css/style.css      all styles (table of contents at the top)
    body.html          page markup
    js/data.js         EDIT HERE: contact config, portfolio list, RO/EN texts, live-demo code
    js/core.js         utilities, i18n, preloader, cursor, nav, hero, clock …
    js/features.js     live demo, portfolio viewer, matrix, nerd stats, page modes, barrel roll
    js/ui.js           command palette, terminal, dialogs, section scrolling, keyboard, init
    portfolio/*.html   concept pages, bundled as lazy JSON (parsed only when the viewer opens)

The JS files share one scope: they are concatenated in the order above inside a single IIFE.
If esbuild isn't available the build still works, it just skips minification.
"""
import json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'index.html')
PRETTY = '--pretty' in sys.argv
JS_ORDER = ['data.js', 'core.js', 'features.js', 'ui.js']


def read(*p):
    with open(os.path.join(HERE, *p), encoding='utf-8') as f:
        return f.read()


# ---------------------------------------------------------------- minifiers
def _esbuild_cmd():
    if os.environ.get('ESBUILD'):
        return [os.environ['ESBUILD']]
    if shutil.which('esbuild'):
        return ['esbuild']
    if shutil.which('npx'):
        return ['npx', '--yes', 'esbuild']
    return None


ESBUILD = None if PRETTY else _esbuild_cmd()


def esbuild(code, loader):
    if not ESBUILD:
        return code
    r = subprocess.run(ESBUILD + ['--minify', '--loader=' + loader, '--log-level=warning'],
                       input=code, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'esbuild ({loader}) failed:\n{r.stderr}')
    return r.stdout.strip()


RAW = re.compile(r'(<(script|style|pre|textarea)\b[^>]*>)(.*?)(</\2>)', re.S | re.I)


def min_html(html):
    """Conservative HTML minify: inline <style>/<script> go through esbuild, comments and
    whitespace between tags are collapsed; <pre>/<textarea> are left untouched."""
    if PRETTY or not ESBUILD:
        return html
    keep = []

    def stash(m):
        open_tag, tag, body, close = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
        if tag == 'style':
            body = esbuild(body, 'css')
        elif tag == 'script' and body.strip() and 'type=' not in open_tag.lower():
            body = esbuild(body, 'js')
        keep.append(open_tag + body + close)
        return f'\x00{len(keep) - 1}\x00'

    html = RAW.sub(stash, html)
    html = re.sub(r'<!--(?!\[).*?-->', '', html, flags=re.S)   # comments
    html = re.sub(r'>\s+<', '> <', html)                          # whitespace between tags
    html = re.sub(r'\s{2,}', ' ', html)                           # runs of whitespace
    html = re.sub(r'> <(/?(?:html|head|body|meta|link|title|script|style|div|section|main|nav|header|footer|ul|ol|li|p|h[1-6]|article|aside|canvas|svg|form|figure|br)\b)', r'><\1', html)
    return re.sub(r'\x00(\d+)\x00', lambda m: keep[int(m.group(1))], html).strip()


# ---------------------------------------------------------------- assemble
def build():
    css = esbuild(read('css', 'style.css'), 'css')

    js = "(() => {\n'use strict';\n" + '\n'.join(read('js', f) for f in JS_ORDER) + '\n})();'
    js = esbuild(js, 'js')

    pages = {}
    for f in sorted(os.listdir(os.path.join(HERE, 'portfolio'))):
        if f.endswith('.html'):
            pages['portfolio/' + f] = min_html(read('portfolio', f))
    pages_json = json.dumps(pages, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

    head = min_html(read('head.html'))
    body = min_html(read('body.html'))
    nl = '\n'
    html = (head + nl + '<style>' + nl + css + nl + '</style>' + nl + '</head>' + nl
            + body + nl
            + '<script type="application/json" id="pages-data">' + pages_json + '</script>' + nl
            + '<script>' + nl + js + nl + '</script>' + nl
            + '</body>' + nl + '</html>' + nl)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html)
    mode = 'pretty' if PRETTY else ('minified' if ESBUILD else 'unminified (esbuild not found)')
    print(f'index.html → {len(html.encode()) / 1024:.1f} KB ({mode})')


if __name__ == '__main__':
    build()
