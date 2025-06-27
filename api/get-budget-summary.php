<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    // Fetch budgets
    $budgets = $db->query("SELECT * FROM budgets ORDER BY createdAt DESC")->fetchAll(PDO::FETCH_ASSOC);

    // Calculate total spent for each
    $stmt = $db->query("SELECT budgetId, SUM(amount) as spent FROM expenses GROUP BY budgetId");
    $expensesMap = [];
    foreach ($stmt as $row) {
        $expensesMap[$row['budgetId']] = (float)$row['spent'];
    }

    // Merge
    foreach ($budgets as &$b) {
        $b['spent'] = $expensesMap[$b['id']] ?? 0;
    }

    echo json_encode([
        'success' => true,
        'budgets' => $budgets
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch budget summaries: ' . $e->getMessage()]);
    exit;
}
