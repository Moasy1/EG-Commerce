<?php
/**
 * Hostinger Creator Studio UGC Content API Backend
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0775, true);
}
$ugcFile = $dataDir . '/shared_ugc_content.json';

function getUgcData($file) {
    if (!file_exists($file)) return [];
    $content = file_get_contents($file);
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $content = getUgcData($ugcFile);
    $creatorId = isset($_GET['creatorId']) ? trim($_GET['creatorId']) : null;
    $merchantId = isset($_GET['merchantId']) ? trim($_GET['merchantId']) : null;
    $publisherId = isset($_GET['publisherId']) ? trim($_GET['publisherId']) : null;

    if ($creatorId || $merchantId || $publisherId) {
        $content = array_values(array_filter($content, function ($item) use ($creatorId, $merchantId, $publisherId) {
            if ($creatorId && (
                (isset($item['creatorId']) && $item['creatorId'] === $creatorId) ||
                (isset($item['publisherId']) && $item['publisherId'] === $creatorId)
            )) return true;

            if ($merchantId && (
                (isset($item['merchantId']) && $item['merchantId'] === $merchantId) ||
                (isset($item['creatorId']) && $item['creatorId'] === $merchantId)
            )) return true;

            if ($publisherId && (isset($item['publisherId']) && $item['publisherId'] === $publisherId)) return true;

            return false;
        }));
    }

    echo json_encode($content, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload || !isset($payload['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Content payload with id is required']);
        exit;
    }

    $payload['publisherId'] = $payload['publisherId'] ?? $payload['creatorId'] ?? null;
    $payload['publisherRole'] = $payload['publisherRole'] ?? (!empty($payload['isMerchantReel']) ? 'merchant' : 'creator');

    $content = getUgcData($ugcFile);
    $filtered = array_values(array_filter($content, function ($item) use ($payload) {
        return $item['id'] !== $payload['id'];
    }));
    array_unshift($filtered, $payload);

    file_put_contents($ugcFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'item' => $payload], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
