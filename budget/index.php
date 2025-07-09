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

    require_once(__DIR__ . '/../components/BudgetItem.php');
    require_once(__DIR__ . '/../components/Table.php');

    $budgetId = $_GET['id'] ?? null;
    if (!$budgetId) {
      echo "<p>not found.</p>";
      exit;
    }

    $payload = json_encode(['id' => $budgetId]);
    $ch = curl_init("http://localhost/WEB/api/get-budget-by-id.php");
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_HTTPHEADER => ["Content-Type: application/json"]
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($response, true);

    // Optional error handling
    if (!$data || !$data['success']) {
      echo "<p>Erro trying to load budget.</p>";
      exit;
    }

    $budget = $data['budget'];

    // depois seria bom filtrar
    $expenseRes = file_get_contents("http://localhost/WEB/api/get-all-expenses.php");
    $allExpenses = json_decode($expenseRes, true)['expenses'] ?? [];

    $expenses = array_filter($allExpenses, fn($e) => $e['budgetId'] === $budget['id']);

    echo '<div
      class="grid-lg"
      style="--accent: ' . $budget["color"] . '
      <h1 class="h2">
        <span class="accent">' . htmlspecialchars($budget["name"]) . '</span> Overview
      </h1>
      <div class="flex-lg">';
    BudgetItem($budget, true);
    echo "<add-expense-form data-budgets='" . json_encode([$budget]) . "'></add-expense-form>";
    echo '</div>';
    if (count($expenses) > 0) {
      echo '<div class="grid-md">
          <h2>
            <span class="accent">' . htmlspecialchars($budget["name"]) . '</span> Expenses
          </h2>';
      Table($expenses);

      echo '</div>';
    }

    echo '</div>';
    ?>
  </main>
  <img src="../assets/wave.svg" alt="" />
  <script type="module" src="../scripts/budget.js"></script>
</body>

</html>
