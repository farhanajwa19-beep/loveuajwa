# Our little love story

Static pink anniversary website. `index.html` belongs at the repository root.

## Publish future updates

Add images to `img/`, then run `./publish.ps1` in the VS Code PowerShell terminal (or ask Codex to publish). It rebuilds the complete album, commits the site and all its asset folders, and pushes to `main`. GitHub Pages then deploys automatically. It never force-pushes. GitHub sign-in is required once on your computer. Changes are uploaded when you run this command; saving a file alone does not publish it.

## Local preview

Run `python -m http.server 5173` and visit http://localhost:5173/.

## Dates

The monthly anniversary is the 31st, using the final day of shorter months (Feb 28/29, Apr/Jun/Sep/Nov 30). It shows a celebration for the entire anniversary day. Dates follow the visitor's local timezone. The days-together counter counts calendar dates from December 31, 2025, avoiding daylight-saving drift.

## Album

`python tools/build_album.py` rebuilds `album.html` from all supported image files in `img/`. Screenshot dates are file labels, not claims about when a memory happened. Full images stay uncropped. The viewer supports previous/next, arrow keys, Escape, and touch buttons.

## Public-site security

The site stays public by request. Anyone who can see a photo, letter, secret memory or script can copy it, including from repository history. The easter eggs are surprises, not access controls. Search `noindex` directives are requests to cooperating crawlers, not privacy or deletion guarantees.

`publish.ps1` regenerates the album, security policies and JavaScript integrity hashes, then runs lightweight checks before committing. If editing scripts by hand, run `python tools/secure_pages.py` before previewing. Integrity hashes use LF bytes; `.gitattributes` preserves the deployed line endings.

Browser policies block inline/event-handler scripts, unapproved script bytes, external images, forms, embeds, workers and fetch/WebSocket connections. Trusted Types restrictions block HTML-string injection sinks in supporting browsers. Inline style attributes remain allowed for existing animation and sticker sizing. Google Fonts is the only allowed third-party resource service. Referrers are suppressed. Policies are delivered in HTML meta tags because this is GitHub Pages; this does not provide header-only features such as `frame-ancestors`, and does not protect direct image URLs.

Never add passwords, tokens, private keys, personal documents or sensitive photos to this public repository. Common credential filenames are ignored and basic token signatures checked, but these checks are not exhaustive. Repository write access, GitHub account protection, hosting configuration and access to this computer remain separate security boundaries. No server, login, user uploads, analytics or third-party JavaScript is used by the site.
