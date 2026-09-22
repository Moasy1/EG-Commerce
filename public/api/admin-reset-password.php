<?php
/**
 * Hostinger Admin Reset Password API
 * Updates user password in Supabase Auth via Admin REST API,
 * and maintains server-side persistent registered user credentials.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, x-admin-token');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true);

if (!$body || !is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$userId = isset($body['userId']) ? trim($body['userId']) : '';
$email = isset($body['email']) ? strtolower(trim($body['email'])) : '';
$newPassword = isset($body['newPassword']) ? (string)$body['newPassword'] : '';

if (empty($newPassword) || strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters long']);
    exit;
}

if (empty($userId) && empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'userId or email is required']);
    exit;
}

$supabaseUrl = getenv('SUPABASE_URL') ?: (getenv('VITE_SUPABASE_URL') ?: 'https://dbufgbonhnoridenwjry.supabase.co');
$serviceRoleKey = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';

$supabaseUpdated = false;
$supabaseError = null;

// If we have a Supabase Service Role Key and a valid UUID userId, update Supabase Auth via Admin REST API
if (!empty($serviceRoleKey) && !empty($userId) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $userId)) {
    $endpoint = rtrim($supabaseUrl, '/') . '/auth/v1/admin/users/' . $userId;
    
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['password' => $newPassword]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . $serviceRoleKey,
        'Authorization: Bearer ' . $serviceRoleKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        $supabaseUpdated = true;
    } else {
        $supabaseError = "Supabase Admin API responded with HTTP $httpCode: $response ($curlErr)";
    }
}

// Also persist credentials to server-side registered users data store
$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0775, true);
}
$usersFile = $dataDir . '/registered_users.json';
$registeredUsers = file_exists($usersFile) ? json_decode(file_get_contents($usersFile), true) : [];
if (!is_array($registeredUsers)) {
    $registeredUsers = [];
}

$userFound = false;
foreach ($registeredUsers as &$u) {
    if ((!empty($userId) && isset($u['id']) && $u['id'] === $userId) || 
        (!empty($email) && isset($u['email']) && strtolower($u['email']) === $email)) {
        $u['password'] = $newPassword;
        $u['updated_at'] = date('c');
        $userFound = true;
        break;
    }
}
unset($u);

if (!$userFound && (!empty($email) || !empty($userId))) {
    $registeredUsers[] = [
        'id' => $userId ?: ('u-' . time()),
        'email' => $email,
        'password' => $newPassword,
        'updated_at' => date('c')
    ];
}

@file_put_contents($usersFile, json_encode($registeredUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Password reset successfully',
    'userId' => $userId,
    'email' => $email,
    'supabaseUpdated' => $supabaseUpdated,
    'supabaseError' => $supabaseError,
    'timestamp' => date('c')
]);
