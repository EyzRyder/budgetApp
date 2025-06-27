<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = trim($data['id'] ?? '');

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing budget ID']);
    exit;
}

try {
    $stmt = $db->prepare("DELETE FROM budgets WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete budget: ' . $e->getMessage()]);
    exit;
}
