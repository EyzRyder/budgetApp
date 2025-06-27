const introScreen = document.getElementById("intro-screen");
const appScreen = document.getElementById("app-screen");
const nameForm = document.getElementById("name-form");
const welcomeName = document.getElementById("welcome-name");

const list = document.getElementById("budget-list");
const form = document.getElementById("budget-form");

const expenseForm = document.getElementById("expense-form");
const expenseBudgetSelect = document.getElementById("expenseBudget");
const expensesContainer = document.getElementById("expensesContainer");

const storedName = localStorage.getItem("userName")

let globalGroupedExpenses = {};

if (!storedName) {
  introScreen.style.display = "block";
} else {
  initApp(storedName);
}

// ============== FUNCTIONS

function initApp(name) {
  introScreen.style.display = "none";
  appScreen.style.display = "block";
  welcomeName.textContent = name;

  // Load budgets + expenses
  fetch("api/get-budget-summary.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && Array.isArray(data.budgets)) {
        return Promise.all([
          data.budgets,
          fetch("api/get-budget-expenses.php").then((r) => r.json()),
        ]);
      }
    })
    .then(([budgets, expensesData]) => {
      if (expensesData.success) {
        globalGroupedExpenses = expensesData.expensesByBudget || {};
        budgets.forEach((b) => addBudgetToList(b));
        populateBudgetSelect(budgets);
      }
    })
    .catch(() => alert("Failed to load data"));
}

// Populate budget dropdown
function populateBudgetSelect(budgets) {
  budgets.forEach((b) => {
    const option = document.createElement("option");
    option.value = b.id;
    option.textContent = b.name;
    expenseBudgetSelect.appendChild(option);
  });
}

// Add expense to DOM
function addExpenseToList(expense) {
  const div = document.createElement("div");
  div.className = "budget";
  div.dataset.expenseId = expense.id;
  div.innerHTML = `
    <strong>${expense.name}</strong><br/>
    $${expense.amount.toFixed(2)} 
    <br/><small>${new Date(expense.createdAt * 1000).toLocaleDateString()}</small>
    <br/>
    <button class="btn btn--warning delete-expense" data-id="${expense.id}">Delete</button>
  `;

  expensesContainer.prepend(div);
}

function addBudgetToList(budget) {
  const div = document.createElement("div");
  div.className = "budget";
  div.style.borderColor = `hsl(${budget.color})`;
  div.dataset.budgetId = budget.id;

  const remaining = budget.amount - budget.spent;
  const percent = Math.min((budget.spent / budget.amount) * 100, 100).toFixed(1);

  div.innerHTML = `
    <h3>${budget.name}</h3>
    <div class="progress-text">
      <span>Spent: $${budget.spent.toFixed(2)}</span>
      <span>Remaining: $${remaining.toFixed(2)}</span>
    </div>
    <progress value="${budget.spent}" max="${budget.amount}"></progress>
    <p><small>Created on: ${new Date(budget.createdAt * 1000).toLocaleDateString()}</small></p>
    <button class="btn btn--warning delete-budget" data-id="${budget.id}">Delete Budget</button>
    <div class="grid-sm" id="expenses-${budget.id}"></div>
  `;

  list.appendChild(div);

  const group = globalGroupedExpenses[budget.id] || [];
  const container = div.querySelector(`#expenses-${budget.id}`);

  group.forEach((exp) => {
    const item = document.createElement("div");
    item.className = "expense";
    item.dataset.expenseId = exp.id;
    item.innerHTML = `
      <strong>${exp.name}</strong>: $${exp.amount.toFixed(2)}
      <br/><small>${new Date(exp.createdAt * 1000).toLocaleDateString()}</small>
      <button class="btn btn--warning delete-expense" data-id="${exp.id}">×</button>
    `;
    container.appendChild(item);
  });
}

// ============== addEventListener

document.addEventListener("DOMContentLoaded", () => {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const amount = parseFloat(form.amount.value);

    if (!name || amount <= 0) {
      alert("Please enter a valid name and amount.");
      return;
    }

    try {
      const res = await fetch("api/create-budget.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount }),
      });

      const data = await res.json();

      if (data.success) {
        addBudgetToList(data.budget);
        form.reset();
      } else {
        alert(data.error || "Unknown error");
      }
    } catch (err) {
      alert("Failed to connect to server.");
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const amount = parseFloat(form.amount.value);

  if (!name || amount <= 0) {
    alert("Please enter a valid name and amount.");
    return;
  }

  try {
    const res = await fetch("api/create-budget.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount }),
    });

    const data = await res.json();

    if (data.success) {
      addBudgetToList(data.budget);
      form.reset();
    } else {
      alert(data.error || "Unknown error");
    }
  } catch (err) {
    alert("Failed to connect to server.");
  }
});

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = expenseForm.name.value.trim();
  const amount = parseFloat(expenseForm.amount.value);
  const budgetId = expenseForm.budgetId.value;

  if (!name || amount <= 0 || !budgetId) {
    alert("Fill all fields properly");
    return;
  }

  try {
    const res = await fetch("api/create-expense.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount, budgetId }),
    });
    const data = await res.json();

    if (data.success) {
      addExpenseToList(data.expense);
      expenseForm.reset();
    } else {
      alert(data.error || "Error");
    }
  } catch {
    alert("Connection failed.");
  }
});

expensesContainer.addEventListener("click", async (e) => {
  if (e.target.matches(".delete-expense")) {
    const id = e.target.dataset.id;
    if (!confirm("Delete this expense?")) return;

    try {
      const res = await fetch("api/delete-expense.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        const toRemove = document.querySelector(`[data-expense-id="${id}"]`);
        toRemove?.remove();
      } else {
        alert(data.error || "Could not delete.");
      }
    } catch {
      alert("Connection error.");
    }
  }
});

list.addEventListener("click", async (e) => {
  if (e.target.matches(".delete-budget")) {
    const id = e.target.dataset.id;
    if (!confirm("Delete this budget and all associated expenses?")) return;

    try {
      const res = await fetch("api/delete-budget.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        document.querySelector(`[data-budget-id="${id}"]`)?.remove();
      } else {
        alert(data.error || "Could not delete budget.");
      }
    } catch {
      alert("Connection error.");
    }
  }
});

nameForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameForm.userName.value.trim();
  if (name) {
    localStorage.setItem("userName", name);
    initApp(name);
  }
});

document.getElementById("logout").addEventListener("click", () => {
  if (confirm("Clear your data and restart?")) {
    localStorage.removeItem("userName");
    location.reload();
  }
});

// ============== load content

// Load all budgets on page load
fetch("api/get-budget-summary.php")
  .then((res) => res.json())
  .then((data) => {
    if (data.success && Array.isArray(data.budgets)) {
      data.budgets.forEach((b) => {
        addBudgetToList(b);
      });
      populateBudgetSelect(data.budgets);
    } else {
      console.warn("No budgets found.");
    }
  })
  .catch(() => {
    alert("Failed to load budgets.");
  });

fetch("api/get-budget-summary.php")
  .then((res) => res.json())
  .then((data) => {
    if (data.success && Array.isArray(data.budgets)) {
      return Promise.all([
        data.budgets,
        fetch("api/get-budget-expenses.php").then((r) => r.json()),
      ]);
    }
  })
  .then(([budgets, expensesData]) => {
    if (expensesData.success) {
      globalGroupedExpenses = expensesData.expensesByBudget || {};
      budgets.forEach((b) => addBudgetToList(b));
      populateBudgetSelect(budgets);
    }
  })
  .catch(() => alert("Failed to load data"));