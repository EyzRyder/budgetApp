// this js file contains the DOM rendering utilities

import { deleteBudget, deleteExpense } from './api.js';

export function showIntro() {
    document.getElementById('intro-screen').style.display = 'block';
}
export function showApp(name) {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    document.getElementById('welcome-name').textContent = name;
}

export function clearContainer(id) {
    document.getElementById(id).innerHTML = '';
}

export function populateBudgetSelect(budgets) {
    const select = document.getElementById('expenseBudget');
    select.innerHTML = '';
    budgets.forEach(b => {
        const opt = document.createElement('option'); opt.value = b.id; opt.textContent = b.name;
        select.appendChild(opt);
    });
}

export function addBudget(budget, expensesMap) {
    const container = document.getElementById('budget-list');
    const div = document.createElement('div');
    div.className = 'budget';
    div.dataset.budgetId = budget.id;
    div.style.borderColor = `hsl(${budget.color})`;

    const spent = parseFloat(expensesMap[budget.id]) || 0;
    const remaining = budget.amount - spent;

    div.innerHTML = `
    <h3>${budget.name}</h3>
    <div class="progress-text">
      <span>Spent: $${spent.toFixed(2)}</span>
      <span>Remaining: $${remaining.toFixed(2)}</span>
    </div>
    <progress value="${spent}" max="${budget.amount}"></progress>
    <p><small>Created: ${new Date(budget.createdAt * 1000).toLocaleDateString()}</small></p>

    <button class="btn btn--warning delete-budget" data-id="${budget.id}">Delete Budget</button>
    <button class="btn btn--outline edit-budget" data-id="${budget.id}">Edit</button>

    <form class="edit-budget-form grid-sm" data-id="${budget.id}" style="display: none;">
      <label>New Name:</label>
      <input type="text" name="editName" value="${budget.name}" required />

      <label>New Amount:</label>
      <input type="number" name="editAmount" value="${budget.amount}" min="0.01" step="0.01" required />

      <button type="submit" class="btn">Save</button>
    </form>

    <div class="grid-sm" id="expenses-${budget.id}"></div>
  `;

    container.appendChild(div);
}

export function addExpense(expense) {
    const parent = document.getElementById(`expenses-${expense.budgetId}`);
    if (!parent) return;

    const div = document.createElement('div');
    div.className = 'expense';
    div.dataset.expenseId = expense.id;

    div.innerHTML = `
    <strong>${expense.name}</strong>: $${expense.amount.toFixed(2)}
    <br/><small>${new Date(expense.createdAt * 1000).toLocaleDateString()}</small>
    <button class="btn btn--warning delete-expense" data-id="${expense.id}">×</button>
    <button class="btn btn--outline edit-expense" data-id="${expense.id}">Edit</button>

    <form class="edit-expense-form" data-id="${expense.id}" style="display: none;">
      <input type="text" name="editName" value="${expense.name}" required />
      <input type="number" name="editAmount" value="${expense.amount}" min="0.01" step="0.01" required />
      <button type="submit" class="btn">Save</button>
    </form>
  `;

    parent.appendChild(div);
}

export function renderSummary(budgets) {
  const el = document.getElementById("summary-box");
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const remaining = totalBudgeted - totalSpent;

  el.innerHTML = `
    <div class="grid-md">
      <h2>💰 Total Budgeted: $${totalBudgeted.toFixed(2)}</h2>
      <h2>💸 Total Spent: $${totalSpent.toFixed(2)}</h2>
      <h2>📊 Remaining: $${remaining.toFixed(2)}</h2>
    </div>
  `;
}