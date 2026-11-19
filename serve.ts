// serve.ts — a pocket static server for trying the app locally.
//   node serve.ts [--port 8123]
// It serves only the files under app/, answers 404 for anything else,
// and never follows a path that climbs out of app/.

import { readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = fileURLToPath(new URL('./app/', import.meta.url));
const portFlag = process.argv.indexOf('--port');
const port = portFlag > -1 ? Number(process.argv[portFlag + 1]) || 8080 : 8080;

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  let wanted: string;
  try {
    wanted = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  } catch {
    res.writeHead(400).end('bad path');
    return;
  }
  if (wanted === '/') wanted = '/index.html';
  const rel = normalize(wanted).replace(/^[/\\]+/, '');
  if (rel.startsWith('..')) {
    res.writeHead(403).end('outside app/');
    return;
  }
  const file = join(appRoot, rel);
  try {
    if (!statSync(file).isFile()) throw new Error('not a file');
    const body = readFileSync(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'content-length': body.length,
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Vice Nights Cover Studio at http://localhost:${port}`);
});
