// Simple static file server for the Budget app
// Usage: node server.js [port]
// Default port: 5173

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.argv[2], 10) || process.env.PORT || 5173;
const root = process.cwd();

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.pdf': 'application/pdf'
};

function send(res, status, headers, body){
  res.writeHead(status, headers);
  if(body) res.end(body); else res.end();
}

function safeJoin(base, target){
  const targetPath = path.posix.normalize(target.replace(/\\/g, '/'));
  return path.join(base, targetPath);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  filePath = safeJoin(root, filePath);

  // Prevent directory traversal
  if(!filePath.startsWith(root)){
    return send(res, 403, { 'Content-Type': 'text/plain' }, 'Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if(!err && stats.isDirectory()){
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if(readErr){
        // Fallback: serve index.html for unknown routes (SPA style)
        const fallback = path.join(root, 'index.html');
        fs.readFile(fallback, (fbErr, fbData) => {
          if(fbErr){
            return send(res, 404, { 'Content-Type': 'text/plain' }, 'Not Found');
          }
          send(res, 200, {
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-store'
          }, fbData);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mimeTypes[ext] || 'application/octet-stream';
      send(res, 200, {
        'Content-Type': type,
        'Cache-Control': 'no-store'
      }, data);
    });
  });
});

server.listen(port, () => {
  console.log(`Budget server running at http://localhost:${port}`);
});


