<?php
header('Content-Type: application/json');

// Require DB
require_once __DIR__ . '/db.php';

// Read input
$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$amount = floatval($data['amount'] ?? 0);

// Validate input
if (!$name || $amount <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid name or amount']);
    exit;
}

// Generate ID and metadata
$id = uniqid("b_", true);
$createdAt = time();
$color = generateColor($db);

try {
    $statement = $db->prepare("INSERT INTO budgets (id, name, createdAt, amount, color) VALUES (?, ?, ?, ?, ?)");
    $statement->execute([$id, $name, $createdAt, $amount, $color]);

    echo json_encode([
        'success' => true,
        'budget' => [
            'id' => $id,
            'name' => $name,
            'createdAt' => $createdAt,
            'amount' => $amount,
            'color' => $color
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create budget: ' . $e->getMessage()]);
    exit;
}

// Function to generate color based on current budget count
function generateColor($db) {
    $count = (int)$db->query("SELECT COUNT(*) FROM budgets")->fetchColumn();
    $hue = ($count * 34) % 360;
    return "$hue 65% 50%";
}
