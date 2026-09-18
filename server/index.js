import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'public', 'uploads', 'reels');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Ensure data and uploads dirs exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const sharedReelsFile = path.join(dataDir, 'shared_reels.json');
const sharedUgcFile = path.join(dataDir, 'shared_ugc_content.json');
const sharedCommentsFile = path.join(dataDir, 'shared_comments.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function readJsonFile(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.warn(`[Hostinger Server] Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[Hostinger Server] Error writing ${filePath}:`, err.message);
    return false;
  }
}

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-filename');
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    setCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  setCors(res);

  // 1. Hostinger API: GET /api/reels
  if (req.method === 'GET' && pathname === '/api/reels') {
    const reels = readJsonFile(sharedReelsFile, []);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(reels));
    return;
  }

  // 2. Hostinger API: POST /api/reels
  if (req.method === 'POST' && pathname === '/api/reels') {
    const newReel = await parseBody(req);
    if (!newReel || !newReel.id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Reel data with id is required' }));
      return;
    }
    const current = readJsonFile(sharedReelsFile, []);
    const updated = [newReel, ...current.filter(r => r.id !== newReel.id)];
    writeJsonFile(sharedReelsFile, updated);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, reel: newReel }));
    return;
  }

  // 3. Hostinger API: DELETE /api/reels/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/reels')) {
    const reelId = pathname.replace('/api/reels/', '').trim() || parsedUrl.searchParams.get('id');
    const current = readJsonFile(sharedReelsFile, []);
    const filtered = current.filter(r => r.id !== reelId);
    writeJsonFile(sharedReelsFile, filtered);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deleted: reelId }));
    return;
  }

  // 4. Hostinger API: POST /api/upload-video
  if (req.method === 'POST' && pathname === '/api/upload-video') {
    const rawFilename = req.headers['x-filename'] || 'video.mp4';
    let decodedFilename = 'video.mp4';
    try {
      decodedFilename = decodeURIComponent(rawFilename);
    } catch(e) {
      decodedFilename = rawFilename;
    }
    const ext = path.extname(decodedFilename) || '.mp4';
    const base = path.basename(decodedFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35);
    const filename = `reel-${Date.now()}-${base}${ext}`;
    const targetPath = path.join(uploadsDir, filename);

    const writeStream = fs.createWriteStream(targetPath);
    req.pipe(writeStream);
    writeStream.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        url: `/uploads/reels/${filename}`,
        filename,
        storage: 'hostinger-nodejs'
      }));
    });
    writeStream.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  // 5. Hostinger API: /api/ugc/content
  if (pathname === '/api/ugc/content') {
    if (req.method === 'GET') {
      const data = readJsonFile(sharedUgcFile, []);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
      return;
    }
    if (req.method === 'POST') {
      const item = await parseBody(req);
      const current = readJsonFile(sharedUgcFile, []);
      const updated = [item, ...current.filter(c => c.id !== item.id)];
      writeJsonFile(sharedUgcFile, updated);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, item }));
      return;
    }
  }

  // 6. Hostinger API: /api/comments
  if (pathname === '/api/comments') {
    const commentsStore = readJsonFile(sharedCommentsFile, {});
    if (req.method === 'GET') {
      const reelId = parsedUrl.searchParams.get('reelId');
      const list = reelId ? (commentsStore[reelId] || []) : commentsStore;
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(list));
      return;
    }
    if (req.method === 'POST') {
      const { reelId, comment } = await parseBody(req);
      if (reelId && comment) {
        const cur = commentsStore[reelId] || [];
        commentsStore[reelId] = [comment, ...cur.filter(c => c.id !== comment.id)];
        writeJsonFile(sharedCommentsFile, commentsStore);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, comment }));
        return;
      }
    }
  }

  // 7. Static file streaming (uploaded videos in public/uploads/ or built assets in dist/)
  let candidateFile = path.join(distDir, pathname);
  if (pathname.startsWith('/uploads/reels/')) {
    const videoFile = pathname.replace('/uploads/reels/', '');
    candidateFile = path.join(uploadsDir, videoFile);
  } else if (!fs.existsSync(candidateFile) && fs.existsSync(path.join(rootDir, 'public', pathname))) {
    candidateFile = path.join(rootDir, 'public', pathname);
  }

  if (fs.existsSync(candidateFile) && fs.statSync(candidateFile).isFile()) {
    const ext = path.extname(candidateFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(candidateFile).pipe(res);
    return;
  }

  // 8. Single Page App fallback (serve dist/index.html)
  const indexHtml = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexHtml).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`[Hostinger Server] Running in production at http://${HOST}:${PORT}`);
});
