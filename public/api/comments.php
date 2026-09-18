<?php
/**
 * Hostinger Comments API Backend
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
$commentsFile = $dataDir . '/shared_comments.json';

function getCommentsStore($file) {
    if (!file_exists($file)) return [];
    $content = file_get_contents($file);
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

$method = $_SERVER['REQUEST_METHOD'];
$store = getCommentsStore($commentsFile);

if ($method === 'GET') {
    $reelId = isset($_GET['reelId']) ? trim($_GET['reelId']) : null;
    if ($reelId) {
        $comments = isset($store[$reelId]) ? $store[$reelId] : [];
        echo json_encode($comments, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode($store, JSON_UNESCAPED_UNICODE);
    }
    exit;
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    $reelId = isset($payload['reelId']) ? $payload['reelId'] : null;
    $comment = isset($payload['comment']) ? $payload['comment'] : null;

    if (!$reelId || !$comment) {
        http_response_code(400);
        echo json_encode(['error' => 'reelId and comment are required']);
        exit;
    }

    if (!isset($store[$reelId])) {
        $store[$reelId] = [];
    }

    $existing = array_values(array_filter($store[$reelId], function ($c) use ($comment) {
        return $c['id'] !== $comment['id'];
    }));
    array_unshift($existing, $comment);
    $store[$reelId] = $existing;

    file_put_contents($commentsFile, json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'comment' => $comment], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
