<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="./assets/logomark.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./styles/style.css" />
  <title>Home Budget</title>
</head>

<body>
  <nav-component></nav-component>
  <main>
    <?php
    require_once(__DIR__ . "/components/Intro.php");
    Intro();
    ?>
    <div id="dashboard" class="dashboard">
      <h1>
        Welcomf back, <span class="accent" id="usernamespan"></span>
      </h1>
      <div class="grid-sm" id="budgetexpensegrid">
        <?php
        $budgetsResponse = file_get_contents("http://localhost/WEB/api/get-budgets.php");
        $budgetsData = json_decode($budgetsResponse, true);
        $budgets = $budgetsData["budgets"];
        $expenses = [];

        if (count($budgets) > 0) {
          require_once(__DIR__ . '/api/render/renderBudgetExpenseForm.php');
        } else {
          require_once(__DIR__ . '/api/render/renderInicialBudgetForm.php');
        }
        ?>
      </div>
    </div>
  </main>
  <img src="./assets/wave.svg" alt="" />
  <script type="module" src="./scripts/main.js"></script>
</body>

</html>
