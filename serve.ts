// A tiny static server for play-testing the game locally:
//   node serve.ts   →   http://localhost:8080
// It serves only this directory's game/ folder, nothing else.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'game');
const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]));
  const rel = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
  if (rel.includes('..')) {
    res.writeHead(403).end('no');
    return;
  }
  try {
    const body = await readFile(join(root, rel));
    res.writeHead(200, { 'content-type': types[extname(rel)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(8080, () => console.log('Lantern Harbour at http://localhost:8080'));
