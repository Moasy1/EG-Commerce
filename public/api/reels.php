<?php
/**
 * Hostinger Reels API Backend
 * Compatible with Hostinger Shared, Cloud, and VPS Hosting (PHP 7.4 - 8.3+)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, x-filename');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0775, true);
}
$dataFile = $dataDir . '/shared_reels.json';

// Initialize default data if missing
if (!file_exists($dataFile)) {
    $initialReels = [
        [
            'id' => '22222222-d001-4000-8000-000000000001',
            'creatorHandle' => '@drip_fit',
            'creatorName' => 'Drip Fit • دريب فيت',
            'avatar' => '/images/brands/dripfit_logo.png',
            'videoBg' => '/images/reels/the_sharp_v_yellow_reel.mp4',
            'thumbnail' => '/images/products/the_sharp_v_yellow_1.webp',
            'caption' => 'The Sharp V Yellow drop is here! خامة قطنية استثنائية 100% وقصة أوفرسايز تليق بيومك وتمرينك 💛🔥 متوفر الآن حصرياً عبر متجر Drip Fit #DripFit #Streetwear #موضة_مصرية',
            'music' => 'Drip Fit Original Audio • الصيف في مصر 2026',
            'likes' => 1420,
            'comments' => 24,
            'saves' => 382,
            'categoryId' => 'streetwear',
            'merchantId' => '171842bd-daed-40ef-853f-917eab2ed437',
            'storeSlug' => 'drip-fit',
            'qualityScore' => 1.0,
            'trendScore' => 0.98,
            'createdAt' => date('c'),
            'products' => [
                [
                    'id' => '11111111-d001-4000-8000-000000000001',
                    'sku' => 'DF-SHARP-V-YEL',
                    'title' => 'The Sharp V Yellow Oversized T-Shirt • تيشرت شارب في أصفر أوفرسايز',
                    'merchantId' => '171842bd-daed-40ef-853f-917eab2ed437',
                    'price' => 680,
                    'originalPrice' => 850,
                    'discount' => '20% OFF',
                    'image' => '/images/products/the_sharp_v_yellow_1.webp'
                ]
            ]
        ]
    ];
    file_put_contents($dataFile, json_encode($initialReels, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getStoredReels($file) {
    if (!file_exists($file)) return [];
    $content = file_get_contents($file);
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $reels = getStoredReels($dataFile);
    $creatorId = isset($_GET['creatorId']) ? trim($_GET['creatorId']) : null;
    $merchantId = isset($_GET['merchantId']) ? trim($_GET['merchantId']) : null;
    $publisherId = isset($_GET['publisherId']) ? trim($_GET['publisherId']) : null;
    $storeSlug = isset($_GET['storeSlug']) ? trim($_GET['storeSlug']) : null;
    $creatorHandle = isset($_GET['creatorHandle']) ? trim($_GET['creatorHandle']) : null;

    if ($creatorId || $merchantId || $publisherId || $storeSlug || $creatorHandle) {
        $reels = array_values(array_filter($reels, function ($r) use ($creatorId, $merchantId, $publisherId, $storeSlug, $creatorHandle) {
            if ($creatorId && (
                (isset($r['creatorId']) && $r['creatorId'] === $creatorId) ||
                (isset($r['publisherId']) && $r['publisherId'] === $creatorId)
            )) return true;

            if ($merchantId && (
                (isset($r['merchantId']) && $r['merchantId'] === $merchantId) ||
                (isset($r['creatorId']) && $r['creatorId'] === $merchantId) ||
                (isset($r['products']) && is_array($r['products']) && array_filter($r['products'], function ($p) use ($merchantId) {
                    return isset($p['merchantId']) && $p['merchantId'] === $merchantId;
                }))
            )) return true;

            if ($publisherId && (isset($r['publisherId']) && $r['publisherId'] === $publisherId)) return true;

            if ($storeSlug && (
                (isset($r['storeSlug']) && strtolower($r['storeSlug']) === strtolower($storeSlug)) ||
                (isset($r['creatorHandle']) && strpos(strtolower($r['creatorHandle']), strtolower($storeSlug)) !== false)
            )) return true;

            if ($creatorHandle && isset($r['creatorHandle']) && strtolower(ltrim($r['creatorHandle'], '@')) === strtolower(ltrim($creatorHandle, '@'))) return true;

            return false;
        }));
    }

    echo json_encode($reels, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload || !isset($payload['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Reel data with id is required']);
        exit;
    }

    // Ensure publisher & ownership fields are firmly structured
    $payload['publisherId'] = $payload['publisherId'] ?? $payload['creatorId'] ?? null;
    $payload['publisherRole'] = $payload['publisherRole'] ?? (!empty($payload['isMerchantReel']) ? 'merchant' : 'creator');
    $payload['creatorHandle'] = $payload['creatorHandle'] ?? '@creator';
    $payload['creatorName'] = $payload['creatorName'] ?? 'صانع محتوى';
    $payload['isMerchantReel'] = !empty($payload['isMerchantReel']) || ($payload['publisherRole'] === 'merchant');

    $reels = getStoredReels($dataFile);
    // Remove if existing (update) and prepend
    $filtered = array_values(array_filter($reels, function ($r) use ($payload) {
        return $r['id'] !== $payload['id'];
    }));
    array_unshift($filtered, $payload);

    file_put_contents($dataFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode(['success' => true, 'reel' => $payload], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = end($pathParts);
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Reel id is required']);
        exit;
    }

    $reels = getStoredReels($dataFile);
    $filtered = array_values(array_filter($reels, function ($r) use ($id) {
        return $r['id'] !== $id;
    }));

    file_put_contents($dataFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'deleted' => $id]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
