<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="../assets/logomark.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../styles/style.css" />
  <title>Budget</title>
</head>

<body>
  <nav-component></nav-component>
  <main>
    <?php

    require_once(__DIR__ . "/../components/BudgetItem.php");

    $budgetsResponse = file_get_contents("http://localhost/WEB/api/get-budgets.php");
    $budgetsData = json_decode($budgetsResponse, true);
    $budgets = $budgetsData["budgets"];

    $expensesResponse = file_get_contents("http://localhost/WEB/api/get-all-expenses.php");
    $expensesData = json_decode($expensesResponse, true);
    $expenses = $expensesData["expenses"];


    if (count($expenses) > 0) {
      require_once(__DIR__ . "/../components/Table.php");
      echo '<div class="grid-md"><h2>Expenses</h2>';
      Table($expenses);
    }
    echo '</div>';
    ?>
  </main>
  <img src="../assets/wave.svg" alt="" />
  <script type="module" src="../scripts/budget.js"></script>
</body>

</html>
