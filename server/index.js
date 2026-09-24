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
const sharedUsersFile = path.join(dataDir, 'registered_users.json');
const sharedMerchantsFile = path.join(dataDir, 'shared_merchants.json');
const sharedProductsFile = path.join(dataDir, 'shared_products.json');

if (!fs.existsSync(sharedUsersFile)) fs.writeFileSync(sharedUsersFile, JSON.stringify({}, null, 2), 'utf-8');
if (!fs.existsSync(sharedMerchantsFile)) fs.writeFileSync(sharedMerchantsFile, JSON.stringify([], null, 2), 'utf-8');
if (!fs.existsSync(sharedProductsFile)) fs.writeFileSync(sharedProductsFile, JSON.stringify([], null, 2), 'utf-8');

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
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => {
      clearTimeout(timer);
      resolve({});
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
    let reels = readJsonFile(sharedReelsFile, []);
    const creatorId = parsedUrl.searchParams.get('creatorId');
    const merchantId = parsedUrl.searchParams.get('merchantId');
    const publisherId = parsedUrl.searchParams.get('publisherId');
    const storeSlug = parsedUrl.searchParams.get('storeSlug');
    const creatorHandle = parsedUrl.searchParams.get('creatorHandle');

    if (creatorId || merchantId || publisherId || storeSlug || creatorHandle) {
      reels = reels.filter(r => {
        if (creatorId && (r.creatorId === creatorId || r.publisherId === creatorId)) return true;
        if (merchantId && (
          r.merchantId === merchantId || 
          r.creatorId === merchantId || 
          (Array.isArray(r.products) && r.products.some(p => p.merchantId === merchantId))
        )) return true;
        if (publisherId && r.publisherId === publisherId) return true;
        if (storeSlug && (
          (r.storeSlug && r.storeSlug.toLowerCase() === storeSlug.toLowerCase()) ||
          (r.creatorHandle && r.creatorHandle.toLowerCase().includes(storeSlug.toLowerCase()))
        )) return true;
        if (creatorHandle && r.creatorHandle && r.creatorHandle.replace(/^@/, '').toLowerCase() === creatorHandle.replace(/^@/, '').toLowerCase()) return true;
        return false;
      });
    }

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

    newReel.publisherId = newReel.publisherId || newReel.creatorId || null;
    newReel.publisherRole = newReel.publisherRole || (newReel.isMerchantReel ? 'merchant' : 'creator');
    newReel.creatorHandle = newReel.creatorHandle || '@creator';
    newReel.creatorName = newReel.creatorName || 'صانع محتوى';
    newReel.isMerchantReel = Boolean(newReel.isMerchantReel) || (newReel.publisherRole === 'merchant');

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
      let data = readJsonFile(sharedUgcFile, []);
      const creatorId = parsedUrl.searchParams.get('creatorId');
      const merchantId = parsedUrl.searchParams.get('merchantId');
      const publisherId = parsedUrl.searchParams.get('publisherId');

      if (creatorId || merchantId || publisherId) {
        data = data.filter(item => {
          if (creatorId && (item.creatorId === creatorId || item.publisherId === creatorId)) return true;
          if (merchantId && (item.merchantId === merchantId || item.creatorId === merchantId)) return true;
          if (publisherId && item.publisherId === publisherId) return true;
          return false;
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
      return;
    }
    if (req.method === 'POST') {
      const item = await parseBody(req);
      item.publisherId = item.publisherId || item.creatorId || null;
      item.publisherRole = item.publisherRole || (item.isMerchantReel ? 'merchant' : 'creator');

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

  // 7. Hostinger API: GET & POST /api/users & /api/auth/register & /api/auth/login
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
          name: merchantName,
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

  // 8. Hostinger API: GET & POST /api/merchants
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
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, merchant: newMerchant }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // 9. Hostinger API: GET & POST /api/products
  if (pathname === '/api/products') {
    const productsStore = readJsonFile(sharedProductsFile, []);
    if (req.method === 'GET') {
      const merchantId = parsedUrl.searchParams.get('merchantId');
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
        const updatedProducts = [newProduct, ...productsStore.filter(p => p.id !== newProduct.id)];
        writeJsonFile(sharedProductsFile, updatedProducts);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, product: newProduct }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // 6.5 Hostinger API: POST /api/commerce/admin-reset-password or /api/admin-reset-password
  if (req.method === 'POST' && (pathname === '/api/commerce/admin-reset-password' || pathname === '/api/admin-reset-password')) {
    const body = await parseBody(req);
    const { userId, newPassword, email } = body || {};

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Password must be at least 6 characters long' }));
      return;
    }

    if (!userId && !email) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'userId or email is required' }));
      return;
    }

    let supabaseUpdated = false;
    let supabaseError = null;

    // Try Supabase Admin API if service role key is configured
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://dbufgbonhnoridenwjry.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceKey && userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      try {
        const fetchRes = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/auth/v1/admin/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`
          },
          body: JSON.stringify({ password: newPassword })
        });
        if (fetchRes.ok) {
          supabaseUpdated = true;
        } else {
          const errText = await fetchRes.text();
          supabaseError = `Supabase admin error: ${fetchRes.status} ${errText}`;
        }
      } catch (e) {
        supabaseError = e.message;
      }
    }

    // Persist to local server data store
    const registeredUsersFile = path.join(dataDir, 'registered_users.json');
    const registeredUsers = readJsonFile(registeredUsersFile, []);
    let userFound = false;

    for (const u of registeredUsers) {
      if ((userId && u.id === userId) || (email && u.email && u.email.toLowerCase() === email.toLowerCase())) {
        u.password = newPassword;
        u.updated_at = new Date().toISOString();
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      registeredUsers.push({
        id: userId || `u-${Date.now()}`,
        email: email || '',
        password: newPassword,
        updated_at: new Date().toISOString()
      });
    }

    writeJsonFile(registeredUsersFile, registeredUsers);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      message: 'Password reset successfully',
      userId,
      email,
      supabaseUpdated,
      supabaseError
    }));
    return;
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
