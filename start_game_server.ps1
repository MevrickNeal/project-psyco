# ===============================================================
# ZERO-DEPENDENCY LOCAL OFFLINE GAME SERVER (PowerShell + .NET)
# Serves the game to your Laptop & Phone over Wi-Fi / Hotspot
# ===============================================================

$port = 8080
$folder = $PSScriptRoot

# Find local Wi-Fi / LAN IP
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual' -and $_.IPAddress -notmatch '^169\.' 
} | Select-Object -First 1).IPAddress

if (-not $ip) { $ip = "127.0.0.1" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")
try {
    $listener.Start()
} catch {
    # Fallback to localhost if wild-card binding requires admin
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🎮 PROJECT PSYCO: MOMO & LIAN (RETRO DHAKA EDITION)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "▶ LAPTOP PLAY URL : http://localhost:$port" -ForegroundColor Cyan
Write-Host "▶ PHONE PLAY URL  : http://$($ip):$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 HOW TO INSTALL AS DEDICATED OFFLINE APP ON ANDROID:" -ForegroundColor Magenta
Write-Host "   1. Connect phone to same Wi-Fi (or Laptop Mobile Hotspot)"
Write-Host "   2. Open Chrome/Browser on phone and go to: http://$($ip):$port"
Write-Host "   3. Tap Chrome Menu (3 dots) -> 'Install App' or 'Add to Home Screen'"
Write-Host "   4. Done! It installs a dedicated fullscreen offline app on your phone!"
Write-Host ""
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host "----------------------------------------------------------"

# Launch default browser on laptop
Start-Process "http://localhost:$port"

# MIME Types dictionary
$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".mp3"  = "audio/mpeg"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "/index.html"
        }

        # URL decode path and translate slashes
        $decodedPath = [System.Uri]::UnescapeDataString($urlPath).TrimStart('/')
        $filePath = Join-Path $folder $decodedPath.Replace('/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $decodedPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
