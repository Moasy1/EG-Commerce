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
            'id' => 'ee000000-0000-0000-0000-000000000001',
            'creatorHandle' => '@cairo_chic',
            'creatorName' => 'كايرو شيك • Cairo Chic',
            'avatar' => '/images/reels/fashion_citrine_blazer_thumb.jpg',
            'videoBg' => '/images/reels/fashion_citrine_blazer.mp4',
            'caption' => 'تنسيق بليزر السيترين الأوفرسايز مع بنطلون جينز كلاسيك ونظارة شمسية 💛 فخامة الصيف وأناقة لا تقاوم! #بليزر #موضة_القاهرة',
            'music' => 'ألحان إيقاعية هادية • صيف 2026',
            'likes' => 4820,
            'comments' => 3,
            'saves' => 1140,
            'categoryId' => 'fashion',
            'qualityScore' => 0.95,
            'trendScore' => 0.90,
            'createdAt' => date('c'),
            'products' => [
                [
                    'id' => 'p-fashion-blazer',
                    'title' => 'بليزر أوفرسايز أصفر ليموني راقي',
                    'price' => 2200,
                    'originalPrice' => 2750,
                    'discount' => '20% OFF',
                    'image' => '/images/reels/fashion_citrine_blazer_thumb.jpg'
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
