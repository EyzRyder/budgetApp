<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = trim($data['id'] ?? '');
$name = trim($data['name'] ?? '');
$amount = floatval($data['amount'] ?? 0);

if (!$id || !$name || $amount <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

try {
    $stmt = $db->prepare("UPDATE budgets SET name = ?, amount = ? WHERE id = ?");
    $stmt->execute([$name, $amount, $id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Update failed: ' . $e->getMessage()]);
    exit;
}
