import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CANONICAL_REELS } from '../data/canonicalReels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'public', 'uploads', 'reels');
const sharedReelsFile = path.join(dataDir, 'shared_reels.json');
const sharedUgcFile = path.join(dataDir, 'shared_ugc_content.json');
const sharedCommentsFile = path.join(dataDir, 'shared_comments.json');

// Ensure directories exist
function ensureDirs() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(sharedReelsFile)) {
    fs.writeFileSync(sharedReelsFile, JSON.stringify(CANONICAL_REELS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(sharedUgcFile)) {
    fs.writeFileSync(sharedUgcFile, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(sharedCommentsFile)) {
    fs.writeFileSync(sharedCommentsFile, JSON.stringify({}, null, 2), 'utf-8');
  }
}

function readJsonFile(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      const text = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(text);
    }
  } catch (err) {
    console.warn(`[CrossDevice API] Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[CrossDevice API] Error writing ${filePath}:`, err.message);
    return false;
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
}

export function crossDeviceApiPlugin() {
  ensureDirs();

  const middleware = async (req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Handle preflight OPTIONS
    if (req.method === 'OPTIONS') {
      setCorsHeaders(res);
      res.writeHead(204);
      res.end();
      return;
    }

    // Only handle /api/ routes
    if (!pathname.startsWith('/api/')) {
      return next();
    }

    setCorsHeaders(res);

    // 1. GET /api/reels
    if (req.method === 'GET' && pathname === '/api/reels') {
      const reels = readJsonFile(sharedReelsFile, CANONICAL_REELS);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(reels));
      return;
    }

    // 2. POST /api/reels
    if (req.method === 'POST' && pathname === '/api/reels') {
      try {
        const newReel = await parseBody(req);
        if (!newReel || !newReel.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Reel data with id is required' }));
          return;
        }

        const currentReels = readJsonFile(sharedReelsFile, CANONICAL_REELS);
        // Prepend new reel or update if already present
        const updatedReels = [newReel, ...currentReels.filter(r => r.id !== newReel.id)];
        writeJsonFile(sharedReelsFile, updatedReels);

        console.log(`[CrossDevice API] Reel persisted across devices: ${newReel.id} (${newReel.caption?.slice(0, 30)}...)`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, reel: newReel }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 3. DELETE /api/reels/:id or /api/reels?id=...
    if (req.method === 'DELETE' && pathname.startsWith('/api/reels')) {
      const reelId = pathname.replace('/api/reels/', '').trim() || url.searchParams.get('id');
      if (reelId) {
        const currentReels = readJsonFile(sharedReelsFile, CANONICAL_REELS);
        const filtered = currentReels.filter(r => r.id !== reelId);
        writeJsonFile(sharedReelsFile, filtered);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deleted: reelId }));
        return;
      }
    }

    // 4. POST /api/upload-video (stream upload to public/uploads/reels/)
    if (req.method === 'POST' && pathname === '/api/upload-video') {
      try {
        ensureDirs();
        const rawFilename = req.headers['x-filename'] || 'video.mp4';
        let decodedFilename = 'video.mp4';
        try {
          decodedFilename = decodeURIComponent(rawFilename);
        } catch(e) {
          decodedFilename = rawFilename;
        }
        
        const ext = path.extname(decodedFilename) || '.mp4';
        const base = path.basename(decodedFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
        const filename = `reel-${Date.now()}-${base}${ext}`;
        const targetPath = path.join(uploadsDir, filename);

        const writeStream = fs.createWriteStream(targetPath);
        req.pipe(writeStream);

        writeStream.on('finish', () => {
          const publicUrl = `/uploads/reels/${filename}`;
          console.log(`[CrossDevice API] Uploaded video saved for network streaming: ${publicUrl}`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            url: publicUrl,
            filename
          }));
        });

        writeStream.on('error', (err) => {
          console.error('[CrossDevice API] Video upload failed:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to write video file' }));
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 5. GET & POST /api/ugc/content
    if (pathname === '/api/ugc/content') {
      if (req.method === 'GET') {
        const content = readJsonFile(sharedUgcFile, []);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(content));
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

    // 6. GET & POST /api/comments
    if (pathname === '/api/comments') {
      const commentsStore = readJsonFile(sharedCommentsFile, {});
      if (req.method === 'GET') {
        const reelId = url.searchParams.get('reelId');
        const list = reelId ? (commentsStore[reelId] || []) : commentsStore;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(list));
        return;
      }
      if (req.method === 'POST') {
        const payload = await parseBody(req);
        const { reelId, comment } = payload;
        if (reelId && comment) {
          const currentList = commentsStore[reelId] || [];
          commentsStore[reelId] = [comment, ...currentList.filter(c => c.id !== comment.id)];
          writeJsonFile(sharedCommentsFile, commentsStore);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, comment }));
          return;
        }
      }
    }

    // Not handled by our custom API
    next();
  };

  return {
    name: 'cross-device-sync-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}
