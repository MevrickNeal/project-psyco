$src = "C:\Users\Arena\Downloads\Personal Documents\Hardware Project\project-psyco-main"
$dst = "C:\Users\Arena\Downloads\Personal Documents\Hardware Project\project-psyco-main\android-apk-project\app\src\main\assets"

New-Item -ItemType Directory -Force -Path $dst | Out-Null

$files = @("index.html", "style.css", "phaser.min.js", "audio.js", "dhaka_map.js", "game.js", "manifest.json", "sw.js")
foreach ($f in $files) {
    Copy-Item (Join-Path $src $f) -Destination $dst -Force
}

Copy-Item -Recurse (Join-Path $src "assets") -Destination $dst -Force
Write-Host "Assets synced to Android project successfully!"
