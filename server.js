// ===============================================================
// PROJECT PSYCO: HIGH-PERFORMANCE LOCAL GAME SERVER
// Built-in Node.js HTTP Server (Zero External Dependencies)
// ===============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg'
};

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1';
}

const server = http.createServer((req, res) => {
    let reqUrl = decodeURI(req.url.split('?')[0]);
    if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

    const safePath = path.normalize(path.join(ROOT, reqUrl));
    if (!safePath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`404 Not Found: ${reqUrl}`);
            return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(safePath);
        stream.pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIp();
    console.log('\n==========================================================');
    console.log('🎮 PROJECT PSYCO: MOMO & LIAN (RETRO DHAKA EDITION)');
    console.log('==========================================================\n');
    console.log(`▶ LAPTOP PLAY URL : http://localhost:${PORT}`);
    console.log(`▶ PHONE PLAY URL  : http://${ip}:${PORT}\n`);
    console.log('📱 HOW TO PLAY ON ANDROID PHONE (OFFLINE READY):');
    console.log(`   1. Connect your phone to same Wi-Fi (or laptop Mobile Hotspot)`);
    console.log(`   2. Open Chrome on your phone and go to: http://${ip}:${PORT}`);
    console.log(`   3. Tap Chrome Menu (3 dots) -> "Install App" or "Add to Home screen"`);
    console.log(`   4. Dedicated offline app installs immediately!\n`);
    console.log('Press Ctrl+C to stop server.\n');

    // Auto open browser on laptop
    const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${startCmd} http://localhost:${PORT}`);
});
