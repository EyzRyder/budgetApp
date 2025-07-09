<?php
require_once(__DIR__ . "/helper.php");
function ExpenseItem($expense, $showBudget)
{
    $payload = json_encode(["id" => $expense["budgetId"]]);
    $ch = curl_init("http://localhost/WEB/api/get-budget-by-id.php");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Content-Length: " . strlen($payload)
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    $budget = $data["budget"];

    echo "<td>" . htmlspecialchars($expense['name']) . "</td>";
    echo "<td>" . formatCurrency($expense['amount']) . "</td>";
    echo "<td>" . formatDateToLocaleString($expense['createdAt']) . "</td>";

    if ($showBudget && $budget) {
        echo "<td>";
        echo "<a href='/WEB/budget?id=".$budget['id']."' style='--accent: {$budget['color']}'>";
        echo htmlspecialchars($budget['name']);
        echo "</a>";
        echo "</td>";
        echo "<td>";
        echo "<delete-expense-form   expense-id=" . $expense['id'] . "
  expense-name=" . $expense['name'] . "></delete-expense-form>";
        echo "</td>";
    }
}
