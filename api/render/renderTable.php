<?php
require_once(__DIR__ . "/../../components/BudgetItem.php");

$budgetsResponse = file_get_contents("http://localhost/WEB/api/get-budgets.php");
$budgetsData = json_decode($budgetsResponse, true);
$budgets = $budgetsData["budgets"];

$expensesResponse = file_get_contents("http://localhost/WEB/api/get-all-expenses.php");
$expensesData = json_decode($expensesResponse, true);
$expenses = $expensesData["expenses"];


if (count($expenses) > 0) {
    require_once(__DIR__ . "/../../components/Table.php");
    echo '<div class="grid-md"><h2>Recent Expenses</h2>';
    Table($recentExpenses);
}
echo '</div>';