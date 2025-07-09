<?php
require_once(__DIR__ . "/../../components/BudgetItem.php");

$budgetsResponse = file_get_contents("http://localhost/WEB/api/get-budgets.php");
$budgetsData = json_decode($budgetsResponse, true);
$budgets = $budgetsData["budgets"];

$expensesResponse = file_get_contents("http://localhost/WEB/api/get-all-expenses.php");
$expensesData = json_decode($expensesResponse, true);
$expenses = $expensesData["expenses"];

echo "<div class='grid-lg'>
                <div class='flex-lg'>
                <add-budget-form></add-budget-form>
                <add-expense-form data-budgets='".json_encode($budgets)."'></add-expense-form>";
echo '</div>';
echo '<h2>Existing Budgets</h2>
                <div class="budgets">';
foreach ($budgets as $budget) {
    BudgetItem($budget);
}
echo '</div>';

if (count($expenses) > 0) {
    require_once(__DIR__ . "/../../components/Table.php");
    echo '<div class="grid-md"><h2>Recent Expenses</h2>';
    $recentExpenses = array_slice($expenses, 0, 8);
    Table($recentExpenses);
    echo '<a href="/WEB/expenses">View all expenses</a>';
}
echo '</div>';
