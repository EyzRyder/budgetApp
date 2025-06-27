<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$amount = floatval($data['amount'] ?? 0);
$budgetId = trim($data['budgetId'] ?? '');

if (!$name || $amount <= 0 || !$budgetId) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid expense data']);
    exit;
}

$id = uniqid("e_", true);
$createdAt = time();

try {
    $stmt = $db->prepare("INSERT INTO expenses (id, name, createdAt, amount, budgetId) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $createdAt, $amount, $budgetId]);

    echo json_encode([
        'success' => true,
        'expense' => [
            'id' => $id,
            'name' => $name,
            'amount' => $amount,
            'createdAt' => $createdAt,
            'budgetId' => $budgetId
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create expense: ' . $e->getMessage()]);
    exit;
}
