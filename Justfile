# Default recipe: list available recipes
default:
    @just --list

# Preview static site locally (automatically stamps assets first)
serve port="8088": stamp
    @echo "🌐 Serving legal & compliance web pages from docs/ on http://localhost:{{port}}"
    python3 -m http.server {{port}} --directory docs

# Alias for serve
web-serve port="8088": (serve port)

# Update cache-busting timestamp (yyMMddHHmm) across all HTML files in docs/
stamp:
    python3 -c "import glob, re, datetime; s = datetime.datetime.now().strftime('%y%m%d%H%M'); [p and (lambda text: open(p, 'w', encoding='utf-8').write(re.sub(r'script\.js(\?v=[^\"]*)?', f'script.js?v={s}', re.sub(r'style\.css(\?v=[^\"]*)?', f'style.css?v={s}', text))))(open(p, 'r', encoding='utf-8').read()) for p in glob.glob('docs/*.html')]; print(f'✅ Updated all HTML files in docs/ with timestamp v={s}')"

# Alias for stamp
web-stamp: stamp
