<?php
require_once(__DIR__ . "/helper.php");
function BudgetItem($budget, $showDelete = false)
{
    $id = $budget['id'];
    $name = $budget['name'];
    $amount = $budget['amount'];
    $color = $budget['color'];

    $spent = calculateSpentByBudget($id);
    $remaining = $amount - $spent;
    $percent = $amount > 0 ? $spent / $amount : 0;

    echo "<div class='budget' style='--accent: {$color}'>";

    echo "<div class='progress-text'>";
    echo "<h3>" . htmlspecialchars($name) . "</h3>";
    echo "<p>" . formatCurrency($amount) . " Budgeted</p>"; //orçado
    echo "</div>";

    echo "<progress max='{$amount}' value='{$spent}'>" . formatPercentage($percent) . "</progress>";

    echo "<div class='progress-text'>";
    echo "<small>" . formatCurrency($spent) . " spent</small>"; //gasto
    echo "<small>" . formatCurrency($remaining) . " remaining</small>"; //restantes
    echo "</div>";

    echo "<div class='flex-sm'>";

    if ($showDelete) {
        echo "<delete-budget-form budget-id='".$id."' ></delete-budget-form>";
    } else {
        echo "<a href='./budget?id={$id}' class='btn'>";
        echo "<span>View Details</span>";
        echo '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>';
        echo "</a>";
    }

    echo "</div></div>";
}