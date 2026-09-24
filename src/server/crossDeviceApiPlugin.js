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
const sharedUsersFile = path.join(dataDir, 'registered_users.json');
const sharedMerchantsFile = path.join(dataDir, 'shared_merchants.json');
const sharedProductsFile = path.join(dataDir, 'shared_products.json');

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
  if (!fs.existsSync(sharedUsersFile)) {
    fs.writeFileSync(sharedUsersFile, JSON.stringify({}, null, 2), 'utf-8');
  }
  if (!fs.existsSync(sharedMerchantsFile)) {
    fs.writeFileSync(sharedMerchantsFile, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(sharedProductsFile)) {
    fs.writeFileSync(sharedProductsFile, JSON.stringify([], null, 2), 'utf-8');
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
    console.warn(`[CrossDevice API] Error writing ${filePath}:`, err.message);
    return false;
  }
}

function generateStoreSlug(name, email, id) {
  const latin = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (latin && latin.length >= 2) return latin;
  const emailPrefix = (email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (emailPrefix && emailPrefix.length >= 2) return `${emailPrefix}-boutique`;
  const cleanId = String(id || Date.now()).replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase();
  return `boutique-${cleanId || 'store'}`;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    const timer = setTimeout(() => resolve({}), 2000);
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      clearTimeout(timer);
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', () => {
      clearTimeout(timer);
      resolve({});
    });
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

    // 7. GET & POST /api/users & /api/auth/register & /api/auth/login
    if (pathname === '/api/users' || pathname === '/api/auth/users') {
      const usersStore = readJsonFile(sharedUsersFile, {});
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(usersStore));
        return;
      }
      if (req.method === 'POST') {
        try {
          const userData = await parseBody(req);
          const email = (userData.email || '').toLowerCase().trim();
          if (!email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email is required' }));
            return;
          }
          usersStore[email] = {
            ...userData,
            email,
            updated_at: new Date().toISOString()
          };
          writeJsonFile(sharedUsersFile, usersStore);
          console.log(`[CrossDevice API] User registered/updated across devices: ${email} (${userData.role || 'buyer'})`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, user: usersStore[email] }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }

    if (req.method === 'POST' && pathname === '/api/auth/register') {
      try {
        const userData = await parseBody(req);
        const email = (userData.email || '').toLowerCase().trim();
        if (!email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email is required' }));
          return;
        }
        const usersStore = readJsonFile(sharedUsersFile, {});
        usersStore[email] = {
          ...userData,
          email,
          updated_at: new Date().toISOString()
        };
        writeJsonFile(sharedUsersFile, usersStore);

        // If registering as a merchant, also auto-register in shared_merchants.json
        if (userData.role === 'merchant') {
          const merchantsStore = readJsonFile(sharedMerchantsFile, []);
          const merchantName = userData.store_name || userData.name || `${email.split('@')[0]} Store`;
          const merchantId = userData.merchant_id || `m-${userData.id || Date.now()}`;
          const slug = userData.store_slug || userData.slug || generateStoreSlug(merchantName, email, merchantId);
          const newMerchant = {
            id: merchantId,
            user_id: userData.id,
            name: `${merchantName} • متجر ${merchantName}`,
            shortName: merchantName,
            slug,
            handle: `@${slug}`,
            subdomain: `${slug}.egyptian-commerce.com`,
            customDomain: null,
            category: 'Egyptian Fashion & Retail',
            categoryAr: 'أزياء وتجارة مصرية معتمدة',
            bio: `متجر مصري موثق لـ ${merchantName}`,
            established: '2026',
            rating: 5.0,
            reviewsCount: 1,
            verified: true,
            logo: userData.avatar_url || '/images/brands/dripfit_logo.png',
            banner: '/images/products/the_sharp_v_yellow_1.webp'
          };
          const updatedMerchants = [newMerchant, ...merchantsStore.filter(m => m.id !== merchantId && m.slug !== slug)];
          writeJsonFile(sharedMerchantsFile, updatedMerchants);
          console.log(`[CrossDevice API] Merchant boutique registered across devices: ${merchantName} (${merchantId})`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, user: usersStore[email] }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      try {
        const { email, password } = await parseBody(req);
        const cleanEmail = (email || '').toLowerCase().trim();
        const usersStore = readJsonFile(sharedUsersFile, {});
        const user = usersStore[cleanEmail];
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'المستخدم غير موجود' }));
          return;
        }
        if (user.password && password && user.password !== password) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'كلمة المرور غير صحيحة' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, user, token: 'session-token-' + Date.now() }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 8. GET & POST /api/merchants
    if (pathname === '/api/merchants') {
      const merchantsStore = readJsonFile(sharedMerchantsFile, []);
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(merchantsStore));
        return;
      }
      if (req.method === 'POST') {
        try {
          const newMerchant = await parseBody(req);
          if (!newMerchant || !newMerchant.id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Merchant id is required' }));
            return;
          }
          const updatedMerchants = [newMerchant, ...merchantsStore.filter(m => m.id !== newMerchant.id && m.slug !== newMerchant.slug)];
          writeJsonFile(sharedMerchantsFile, updatedMerchants);
          console.log(`[CrossDevice API] Merchant updated across devices: ${newMerchant.name} (${newMerchant.id})`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, merchant: newMerchant }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }

    // 9. GET, POST & DELETE /api/products (Tenant-Scoped)
    if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
      const productsStore = readJsonFile(sharedProductsFile, []);
      if (req.method === 'GET') {
        const merchantId = url.searchParams.get('merchantId');
        const list = merchantId ? productsStore.filter(p => p.merchantId === merchantId || p.merchant_id === merchantId) : productsStore;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(list));
        return;
      }
      if (req.method === 'POST') {
        try {
          const newProduct = await parseBody(req);
          if (!newProduct || !newProduct.id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product id is required' }));
            return;
          }
          // Prevent cross-tenant product overwrite: if product exists, merchantId must match
          const existing = productsStore.find(p => p.id === newProduct.id);
          if (existing && existing.merchantId && newProduct.merchantId && existing.merchantId !== newProduct.merchantId) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized: Cannot modify product belonging to another merchant store' }));
            return;
          }
          const updatedProducts = [newProduct, ...productsStore.filter(p => p.id !== newProduct.id)];
          writeJsonFile(sharedProductsFile, updatedProducts);
          console.log(`[CrossDevice API] Product updated across devices: ${newProduct.title} (${newProduct.id})`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, product: newProduct }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
      if (req.method === 'DELETE') {
        const prodId = pathname.replace('/api/products/', '').trim() || url.searchParams.get('id');
        const reqMerchantId = url.searchParams.get('merchantId');
        if (prodId) {
          const target = productsStore.find(p => p.id === prodId);
          if (target && reqMerchantId && target.merchantId && target.merchantId !== reqMerchantId) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized: Cannot delete product belonging to another merchant' }));
            return;
          }
          const filtered = productsStore.filter(p => p.id !== prodId);
          writeJsonFile(sharedProductsFile, filtered);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, deleted: prodId }));
          return;
        }
      }
    }

    // Not handled by our custom API
    next();
  };

  // Track last write timestamp in memory for cross-device polling
  let lastSyncTimestamp = Date.now();

  // Patch writeJsonFile to bump lastSyncTimestamp on every write
  const origWriteJsonFile = writeJsonFile;

  return {
    name: 'cross-device-sync-plugin',
    configureServer(server) {
      // Inject /api/sync-status — returns last data write timestamp
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        if (url.pathname === '/api/sync-status' && req.method === 'GET') {
          setCorsHeaders(res);
          // Return the last modified time of shared_merchants.json as the sync timestamp
          let ts = lastSyncTimestamp;
          try {
            const stat = fs.statSync(sharedMerchantsFile);
            ts = Math.max(ts, stat.mtimeMs);
          } catch (e) {}
          try {
            const stat2 = fs.statSync(sharedUsersFile);
            ts = Math.max(ts, stat2.mtimeMs);
          } catch (e) {}
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ts, ok: true }));
          return;
        }
        next();
      });
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        if (url.pathname === '/api/sync-status' && req.method === 'GET') {
          setCorsHeaders(res);
          let ts = lastSyncTimestamp;
          try { const stat = fs.statSync(sharedMerchantsFile); ts = Math.max(ts, stat.mtimeMs); } catch (e) {}
          try { const stat2 = fs.statSync(sharedUsersFile); ts = Math.max(ts, stat2.mtimeMs); } catch (e) {}
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ts, ok: true }));
          return;
        }
        next();
      });
      server.middlewares.use(middleware);
    }
  };
}
