param([string]$Message = "Update our little love story")
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
python tools/build_album.py
if ($LASTEXITCODE -ne 0) { throw 'Album generation failed.' }
python tools/secure_pages.py
if ($LASTEXITCODE -ne 0) { throw 'Security policy generation failed.' }
python tools/check_site.py
if ($LASTEXITCODE -ne 0) { throw 'Website checks failed; nothing was published.' }
git add -- index.html styles.css script.js anniversary.js album.html album.js img cute-gifs audio tools publish.ps1 README.md .gitignore .gitattributes .nojekyll
if ($LASTEXITCODE -ne 0) { throw 'Could not stage the website.' }
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { throw 'Commit failed.' }
}
git push origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed. Check GitHub sign-in or remote changes; nothing was overwritten.' }
Write-Host 'Uploaded! GitHub Pages will deploy this commit automatically.'
