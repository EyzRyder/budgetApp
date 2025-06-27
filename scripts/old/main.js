import { fetchBudgetSummary, fetchBudgetExpenses } from './api.js';
import { showIntro, showApp, populateBudgetSelect, addBudget, addExpense, renderSummary } from './ui.js';
import { bindEvents } from './events.js';

const storedName = localStorage.getItem('userName');
if (!storedName) {
    showIntro();
} else {
    startApp(storedName);
}

// Name form
const nameForm = document.getElementById('name-form');
nameForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.userName.value.trim();
    localStorage.setItem('userName', name);
    startApp(name);
    window.dispatchEvent(
    new CustomEvent("storageUpdateAdded", {
      detail: { key: "userName", value: name },
    })
  );
});

async function startApp(name) {
    showApp(name);
    bindEvents();
    const [{ budgets }, { expensesByBudget }] = await Promise.all([
        fetchBudgetSummary(), fetchBudgetExpenses()
    ]);
    budgets.forEach(b => addBudget(b, expensesByBudget));
    renderSummary(budgets);
    populateBudgetSelect(budgets);

    Object.values(expensesByBudget).flat().forEach(addExpense);
}
