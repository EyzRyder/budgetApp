<?php
header('Content-Type: application/json');

// Require DB
require_once __DIR__ . '/db.php';

// Read input
$data = json_decode(file_get_contents("php://input"), true);
$id = trim($data['id'] ?? '');

// Validate input
if (!$id) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid id'
    ]);
    exit;
}


try {
    $stmt = $db->prepare("SELECT * FROM budgets WHERE id = ? ORDER BY createdAt DESC");
    $stmt->execute([$id]);
    $budget = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'budget' => $budget
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create budget: ' . $e->getMessage()
    ]);
    exit;
}

// Function to generate color based on current budget count
function generateColor($db)
{
    $count = (int) $db->query("SELECT COUNT(*) FROM budgets")->fetchColumn();
    $hue = ($count * 34) % 360;
    return "$hue 65% 50%";
}
