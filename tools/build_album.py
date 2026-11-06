from pathlib import Path
import html, re, struct
ROOT = Path(__file__).resolve().parents[1]
files = sorted((ROOT/'img').iterdir(), key=lambda p: (p.name.startswith('Screenshot'),p.name), reverse=True)
files = [p for p in files if p.suffix.lower() in {'.png','.jpg','.jpeg','.gif','.webp'}]
existing = ROOT/'album.html'
head = (ROOT/'index.html').read_text(encoding='utf-8').split('<body')[0].replace('<title>For Ajwa</title>','<title>Our little photo album · For Ajwa</title>')
head = re.sub(r'<meta\s+name="description"\s+content="[^"]*"\s*/>', '<meta name="description" content="All our little worlds, tucked into one pink photo album.">', head)
cards=[]
for i,p in enumerate(files):
    label = 'A little piece of us'
    date = re.search(r'Screenshot (\d{4}-\d{2}-\d{2})',p.name)
    if date: label = date.group(1)
    caption = f'{label} · memory {len(files)-i:02d}'
    cards.append(f'''<article class="album-print"><button class="album-photo" type="button" data-index="{i}" aria-label="Open memory {len(files)-i}"><img src="img/{html.escape(p.name,quote=True)}" alt="Saved memory from our games together" loading="{'eager' if i<3 else 'lazy'}" decoding="async"></button><h2>{html.escape(caption)}</h2><span class="album-heart" aria-hidden="true">♡</span></article>''')
page=head+'''<body class="album-page">
<header class="album-header"><nav class="topbar container" aria-label="Album navigation"><a class="brand" href="index.html">ajwa &amp; matthew ♡</a><a class="secondary-btn" href="index.html">← Back to our love story</a></nav>
<div class="album-intro container"><img class="album-mascot" src="cute-gifs/277781-peachsnugglesgoma.gif" width="498" height="330" alt="Two little kitties snuggling"><p class="eyebrow">OUR VERY OWN LITTLE KEEPSAKE</p><h1>Every little world.<br><em>Always u &amp; me.</em></h1><p class="handwritten">All our memories, collected with love ♡</p><p class="album-description">A place for every matching outfit, every silly moment, and every little adventure with u.</p><span class="album-count">'''+str(len(files))+''' memories &amp; counting</span></div></header>
<main class="container album-main"><div class="album-grid">'''+''.join(cards)+'''</div><p class="album-ending handwritten">My favorite part of every picture? Being there with u. ♡</p></main>
<footer class="footer"><p class="handwritten">More little moments. More us.</p><a href="index.html">Back to our love story ♡</a></footer>
<dialog class="album-viewer" id="albumViewer" aria-labelledby="albumCaption"><button class="close-memory" id="albumClose" aria-label="Close memory" type="button">×</button><img id="albumFull" alt=""><h2 id="albumCaption" class="handwritten"></h2><div class="album-controls"><button id="albumPrev" type="button" aria-label="Previous memory">←</button><span id="albumPosition" aria-live="polite"></span><button id="albumNext" type="button" aria-label="Next memory">→</button></div></dialog>
<script src="album.js?v=album-1"></script></body></html>'''
existing.write_text(page,encoding='utf-8')
print(f'Built album with {len(files)} images.')
