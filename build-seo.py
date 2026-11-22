#!/usr/bin/env python3
"""
SEO helper for the static site (no dependencies, Python 3).

  python build-seo.py https://your-name.github.io/your-repo/   <- set the real site address
  python build-seo.py                                          <- just rebuild sitemap.xml / robots.txt

What it does
  * replaces the placeholder address in all meta tags (canonical, og:url, og:image, JSON-LD) with the real one
  * builds sitemap.xml (pages + every picture from the photos folder, so Google Images can find them)
  * builds robots.txt

On GitHub it runs automatically (see .github/workflows/photos-manifest.yml) and finds the address itself:
  - from the CNAME file if you use your own domain
  - otherwise from the repository name: https://<owner>.github.io/<repo>/
"""
import datetime, glob, os, re, sys
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.abspath(__file__))
PLACEHOLDER = 'https://YOUR-USERNAME.github.io/YOUR-REPO/'
PAGES = ['', 'gallery.html', 'prices.html']
IMG = re.compile(r'\.(jpe?g|png|webp|gif|avif|bmp)$', re.I)


def path(*p):
    return os.path.join(ROOT, *p)


def read(p, default=''):
    try:
        with open(p, encoding='utf-8') as f:
            return f.read()
    except OSError:
        return default


def norm(url):
    url = url.strip()
    return url if url.endswith('/') else url + '/'


current = norm(read(path('.site-url'), PLACEHOLDER) or PLACEHOLDER)


def detect():
    if len(sys.argv) > 1:
        return norm(sys.argv[1])
    cname = read(path('CNAME')).split()
    if cname:
        return 'https://%s/' % cname[0]
    repo = os.environ.get('GITHUB_REPOSITORY')
    if repo and current == PLACEHOLDER and '/' in repo:
        owner, name = repo.split('/', 1)
        owner = owner.lower()
        return 'https://%s.github.io/' % owner + ('' if name.lower() == owner + '.github.io' else name + '/')
    return None


target = detect()
if target and target != current:
    for f in glob.glob(path('*.html')) + [path('robots.txt')]:
        text = read(f)
        if current in text:
            with open(f, 'w', encoding='utf-8') as out:
                out.write(text.replace(current, target))
    with open(path('.site-url'), 'w', encoding='utf-8') as out:
        out.write(target)
    current = target
    print('Site address set to', current)

base = current
today = datetime.date.today().isoformat()
photos = sorted(n for n in os.listdir(path('photos')) if IMG.search(n)) if os.path.isdir(path('photos')) else []

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
for page in PAGES:
    lines.append('  <url>')
    lines.append('    <loc>%s</loc>' % escape(base + page))
    lines.append('    <lastmod>%s</lastmod>' % today)
    if page == 'gallery.html':
        for n in photos:
            lines.append('    <image:image><image:loc>%s</image:loc></image:image>' % escape(base + 'photos/' + quote(n)))
    lines.append('  </url>')
lines.append('</urlset>')
with open(path('sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

with open(path('robots.txt'), 'w', encoding='utf-8') as f:
    f.write('User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n' % base)

print('sitemap.xml: %d pages, %d images | base: %s' % (len(PAGES), len(photos), base))
if base == PLACEHOLDER:
    print('NOTE: the site address is still a placeholder. Run:  python build-seo.py https://your-address/')
