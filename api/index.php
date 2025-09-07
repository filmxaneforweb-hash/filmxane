<?php
// Filmxane GoDaddy API Gateway
// Bu dosya tüm API isteklerini backend'e yönlendirir

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Preflight request handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Backend URL (GoDaddy'de backend ayrı bir subdomain'de çalışacak)
$backendUrl = 'https://api.filmxane.com'; // veya backend subdomain'iniz

// Request path'i al
$path = $_SERVER['REQUEST_URI'];
$path = str_replace('/api/', '', $path);

// Request method
$method = $_SERVER['REQUEST_METHOD'];

// Headers'ı hazırla
$headers = [
    'Content-Type: application/json'
];

// Authorization header'ı varsa ekle
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

// Request body'yi al
$body = file_get_contents('php://input');

// cURL ile backend'e istek gönder
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $backendUrl . '/api/' . $path);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Error handling
if ($error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Backend connection failed: ' . $error
    ]);
    exit();
}

// Response'u döndür
http_response_code($httpCode);
echo $response;
?>
