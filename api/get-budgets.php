<?php
header('Content-Type: application/json');

require_once __DIR__ . '/db.php';

try {
    $stmt = $db->query("SELECT * FROM budgets ORDER BY createdAt DESC");
    $budgets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'budgets' => $budgets
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch budgets: ' . $e->getMessage()]);
    exit;
}
