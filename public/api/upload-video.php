<?php
/**
 * Hostinger Video Storage & Upload Handler
 * Stores high-definition video reels directly on Hostinger storage (public_html/uploads/reels)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, x-filename');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST is allowed']);
    exit;
}

// Upload directory on Hostinger
$uploadDir = __DIR__ . '/../uploads/reels';
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0775, true);
}

$uploadedFilename = null;
$finalRelativeUrl = null;

// Case 1: Standard Multipart Form Data ($_FILES)
if (!empty($_FILES)) {
    $fileKey = isset($_FILES['file']) ? 'file' : (isset($_FILES['video']) ? 'video' : key($_FILES));
    $file = $_FILES[$fileKey];

    if ($file['error'] === UPLOAD_ERR_OK) {
        $origName = basename($file['name']);
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        if (!in_array($ext, ['mp4', 'webm', 'mov', 'mkv'])) {
            $ext = 'mp4';
        }
        $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
        $uploadedFilename = 'reel-' . time() . '-' . substr($safeBase, 0, 35) . '.' . $ext;
        $destination = $uploadDir . '/' . $uploadedFilename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $finalRelativeUrl = '/uploads/reels/' . $uploadedFilename;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to move uploaded file to Hostinger storage']);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'File upload error code: ' . $file['error']]);
        exit;
    }
} else {
    // Case 2: Binary stream with HTTP_X_FILENAME header
    $headers = getallheaders();
    $rawFilename = isset($_SERVER['HTTP_X_FILENAME']) 
        ? $_SERVER['HTTP_X_FILENAME'] 
        : (isset($headers['x-filename']) ? $headers['x-filename'] : 'video.mp4');
    
    $decodedFilename = urldecode($rawFilename);
    $ext = strtolower(pathinfo($decodedFilename, PATHINFO_EXTENSION));
    if (!in_array($ext, ['mp4', 'webm', 'mov', 'mkv'])) {
        $ext = 'mp4';
    }
    $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($decodedFilename, PATHINFO_FILENAME));
    $uploadedFilename = 'reel-' . time() . '-' . substr($safeBase, 0, 35) . '.' . $ext;
    $destination = $uploadDir . '/' . $uploadedFilename;

    $input = fopen('php://input', 'rb');
    $output = fopen($destination, 'wb');

    if ($input && $output) {
        stream_copy_to_stream($input, $output);
        fclose($input);
        fclose($output);
        $finalRelativeUrl = '/uploads/reels/' . $uploadedFilename;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save binary stream to Hostinger storage']);
        exit;
    }
}

echo json_encode([
    'success' => true,
    'url' => $finalRelativeUrl,
    'filename' => $uploadedFilename,
    'storage' => 'hostinger'
], JSON_UNESCAPED_UNICODE);
