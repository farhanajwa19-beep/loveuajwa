"""Apply GitHub Pages-compatible browser restrictions and script integrity.
Run after building the album and whenever scripts change. No secrets live here.
"""
from pathlib import Path
import base64, hashlib, re
ROOT = Path(__file__).resolve().parents[1]

def secure_page(path):
    source = path.read_text(encoding='utf-8-sig')
    source = re.sub(r'\s*<meta\b[^>]*(?:http-equiv="Content-Security-Policy"|name="(?:referrer|robots)")[^>]*>', '', source, flags=re.I)
    hashes = []
    def script_tag(match):
        tag = match.group(0)
        src = re.search(r'src="([^"]+)"', tag).group(1).split('?')[0]
        script = (path.parent / src).resolve()
        if not script.is_relative_to(ROOT) or script.suffix != '.js':
            raise ValueError(f'Unexpected script path: {path.name}')
        # Git stores JavaScript with LF; hash those exact deployable bytes.
        script.write_bytes(script.read_bytes().replace(b'\r\n', b'\n'))
        digest = 'sha256-' + base64.b64encode(hashlib.sha256(script.read_bytes()).digest()).decode()
        hashes.append("'" + digest + "'")
        tag = re.sub(r'\s+(?:integrity|crossorigin)="[^"]*"', '', tag)
        # Content hash refreshes caches as well as verifying script bytes.
        tag = re.sub(r'src="[^"]+"', f'src="{src}?v={digest[7:19].replace("/", "_").replace("+", "-")}"', tag)
        return tag[:-1] + f' integrity="{digest}" crossorigin="anonymous">'
    source = re.sub(r'<script\b[^>]*src="[^"]+"[^>]*>', script_tag, source)
    policy = "; ".join([
        "default-src 'none'", "script-src " + (' '.join(hashes) if hashes else "'none'"),
        "script-src-attr 'none'", "style-src 'self' https://fonts.googleapis.com",
        "style-src-attr 'unsafe-inline'", "font-src https://fonts.gstatic.com",
        "img-src 'self'", "media-src 'self'", "connect-src 'none'", "object-src 'none'",
        "frame-src 'none'", "base-uri 'none'", "form-action 'none'", "worker-src 'none'",
        "require-trusted-types-for 'script'", "trusted-types 'none'"
    ])
    meta = f'\n    <meta http-equiv="Content-Security-Policy" content="{policy}">\n    <meta name="referrer" content="no-referrer">\n    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'
    source = re.sub(r'(<meta charset="[^"]+"\s*/?>)',lambda m:m.group(1)+meta,source,count=1,flags=re.I)
    path.write_text(source,encoding='utf-8')

if __name__ == '__main__':
    for name in ['index.html', 'album.html', 'Ajwas-gift/index.html']:
        secure_page(ROOT/name)
    print('Applied page security policies and script integrity.')
