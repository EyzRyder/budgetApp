<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $stmt = $db->query("SELECT * FROM expenses ORDER BY createdAt DESC");
    $grouped = [];

    foreach ($stmt as $row) {
        $budgetId = $row['budgetId'];
        if (!isset($grouped[$budgetId])) {
            $grouped[$budgetId] = [];
        }
        $grouped[$budgetId][] = $row;
    }

    echo json_encode([
        'success' => true,
        'expensesByBudget' => $grouped
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to group expenses: ' . $e->getMessage()]);
    exit;
}
