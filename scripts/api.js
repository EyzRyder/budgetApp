// this file contains all api calls

export async function fetchBudgetSummary() {
  const res = await fetch("http://localhost/WEB/api/get-budget-summary.php");
  return res.json();
}

export async function createBudget({ name, amount }) {
  const res = await fetch("http://localhost/WEB/api/create-budget.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount }),
  });
  return res.json();
}

export async function updateBudget({ id, name, amount }) {
  const res = await fetch("http://localhost/WEB/api/update-budget.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, amount }),
  });
  return res.json();
}

export async function deleteBudget(id) {
  const res = await fetch("http://localhost/WEB/api/delete-budget.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
}

export async function fetchExpenses() {
  const res = await fetch("http://localhost/WEB/api/get-all-expenses.php");
  return res.json();
}

export async function fetchBudgetExpenses() {
  const res = await fetch("http://localhost/WEB/api/get-budget-expenses.php");
  return res.json();
}

export async function createExpense({ name, amount, budgetId }) {
  const res = await fetch("http://localhost/WEB/api/create-expense.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount, budgetId }),
  });
  return res.json();
}

export async function updateExpense({ id, name, amount }) {
  const res = await fetch("http://localhost/WEB/api/update-expense.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, amount }),
  });
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch("http://localhost/WEB/api/delete-expense.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
