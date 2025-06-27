<?php
    require_once(__DIR__ . "/ExpenseItem.php");
function Table($expenses = [], $showBudget = true)
{
    $headers = ["Name", "Amount", "Date"];
    if ($showBudget) {
        $headers[] = "Budget"; // or i could use array_push($array, values,...) that allows me to input alot of values but nah
    }
    echo '<div class="table">
            <table>
                <thead>
                    <tr>';

    foreach ($headers as $header) {
        echo "<th>{$header}</th>";
    }
    echo '</tr>
        </thead>
    <tbody>';
    foreach ($expenses as $expense) {
        echo '<tr>';
        ExpenseItem($expense, $showBudget);
        echo '</tr>';
    }
    echo '</tbody>
      </table>
    </div>';
}