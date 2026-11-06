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
