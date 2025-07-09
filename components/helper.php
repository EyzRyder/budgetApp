<?php
function formatCurrency($amount)
{
    //if (class_exists('NumberFormatter')) {
    //    return $formatter = new NumberFormatter('pt_BR', style: NumberFormatter::CURRENCY);
    //} else {
        return 'R$ ' . number_format($amount, 2, ',', '.');
    //}
}
function formatDateToLocaleString($timestamp)
{
    $date = new DateTime("@$timestamp");
    $date->setTimezone(new DateTimeZone(date_default_timezone_get()));
    return $date->format('d/m/Y');
}

function formatPercentage($amt)
{
    return number_format($amt * 100, 0) . '%';
}

function calculateSpentByBudget($budgetId)
{
    // get expenses by id
    $response = file_get_contents('http://localhost/WEB/api/get-all-expenses.php');
    $expenses = json_decode($response, associative: true)["expenses"];

    $spent = 0;

    foreach ($expenses as $expense) {
        if ($expense['budgetId'] === $budgetId) {
            $spent += $expense['amount'];
        }
    }

    return $spent;
}
