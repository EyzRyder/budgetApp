<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $stmt = $db->query("
        SELECT e.*, b.name as budgetName, b.color
        FROM expenses e
        JOIN budgets b ON e.budgetId = b.id
        ORDER BY e.createdAt DESC
    ");
    $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'expenses' => $expenses
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load expenses: ' . $e->getMessage()]);
    exit;
}
