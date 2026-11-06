"""Fail publishing on missing security controls or common accidental secrets.
This is a lightweight check, not a comprehensive secret scanner or security audit.
"""
from pathlib import Path
from html.parser import HTMLParser
import base64,hashlib,re
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self): super().__init__(); self.policy=''; self.scripts=[]; self.robots=''
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        assert not any(k.startswith('on') for k in a), 'Inline handler found'
        if tag=='meta' and a.get('http-equiv','').lower()=='content-security-policy': self.policy=a['content']
        if tag=='meta' and a.get('name')=='robots': self.robots=a['content']
        if tag=='script':
            assert 'src' in a, 'Inline script found'
            self.scripts.append(a)
for name in ['index.html','album.html','Ajwas-gift/index.html']:
    page=Page();page.feed((ROOT/name).read_text(encoding='utf-8-sig'))
    assert "default-src 'none'" in page.policy and "connect-src 'none'" in page.policy, f'Missing restrictions: {name}'
    assert 'noindex' in page.robots, f'Missing noindex: {name}'
    for a in page.scripts:
        src=(ROOT/name).parent/a['src'].split('?')[0]
        actual='sha256-'+base64.b64encode(hashlib.sha256(src.read_bytes()).digest()).decode()
        assert a.get('integrity')==actual and "'"+actual+"'" in page.policy, f'Stale script integrity: {name}'
for name in ['script.js','album.js']:
    assert not re.search(r'\.innerHTML\s*=|\beval\s*\(', (ROOT/name).read_text(encoding='utf-8-sig')), f'Unsafe HTML/code sink: {name}'
patterns=[rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',rb'gh[pousr]_[A-Za-z0-9]{30,}',rb'github_pat_[A-Za-z0-9_]{30,}',rb'AKIA[A-Z0-9]{16}']
files=[ROOT/n for n in ['index.html','album.html','script.js','album.js','anniversary.js','styles.css','publish.ps1','README.md']]
files += list((ROOT/'tools').glob('*.py'))
for p in files:
    assert not any(re.search(pattern,p.read_bytes()) for pattern in patterns), f'Potential secret in {p.relative_to(ROOT)}; inspect before publishing'
print('PASS: security policies, script integrity, noindex, DOM sinks and common secret signatures.')
