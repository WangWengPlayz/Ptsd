const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

const mimeTypes = {
  '.html':  'text/html',
  '.css':   'text/css',
  '.js':    'application/javascript',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.png':   'image/png',
  '.mp3':   'audio/mpeg',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0]; // strip query strings

  /* ── Uptime / health check endpoints ───────────────────────
     Both Better Stack and UptimeRobot need a plain 200 reply.
     Respond to GET and HEAD so monitors can use either method.
  ─────────────────────────────────────────────────────────── */
  if (urlPath === '/uptime' || urlPath === '/health') {
    const body = JSON.stringify({
      status:    'ok',
      service:   'jm-portfolio',
      uptime:    process.uptime(),
      timestamp: new Date().toISOString(),
    });
    res.writeHead(200, {
      'Content-Type':  'application/json',
      'Cache-Control': 'no-store',
      'Content-Length': Buffer.byteLength(body),
    });
    res.end(req.method === 'HEAD' ? '' : body);
    return;
  }

  /* ── Static file serving ─────────────────────────────────── */
  let filePath = path.join(
    __dirname,
    'public',
    urlPath === '/' ? 'index.html' : urlPath
  );

  const ext         = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback → serve index.html for unknown routes
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio running on http://0.0.0.0:${PORT}`);
});
