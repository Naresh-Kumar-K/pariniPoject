#!/usr/bin/env node
/**
 * Minimal static file server (no deps). Fallback if "serve" has issues.
 * Usage: node server.js [port]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const preferredPort = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
const MIMES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  file = path.join(__dirname, path.normalize(file).replace(/^(\.\.(\/|\\))+/, ''));
  const ext = path.extname(file);
  const mime = MIMES[ext] || 'application/octet-stream';

  fs.readFile(file, (err, data) => {
    if (err) {
      res.statusCode = err.code === 'ENOENT' ? 404 : 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end(err.code === 'ENOENT' ? 'Not Found' : 'Server Error');
      return;
    }
    res.setHeader('Content-Type', mime);
    res.end(data);
  });
});

let currentPort = preferredPort;
const maxTries = 10;

function tryListen() {
  if (currentPort > preferredPort + maxTries) {
    console.error('No available port. Stop other processes using ports', preferredPort, 'to', currentPort - 1);
    process.exit(1);
  }
  server.listen(currentPort, () => {
    console.log(`Thread & Weave running at http://localhost:${currentPort}`);
    console.log('Press Ctrl+C to stop.');
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort++;
    tryListen();
  } else {
    console.error(err);
    process.exit(1);
  }
});

tryListen();
