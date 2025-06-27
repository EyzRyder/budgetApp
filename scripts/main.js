import { showIntro, showApp } from './ui.js';
import { bindEvents } from './events.js';
import { fetchBudgetSummary, fetchExpenses } from './api.js'
import "./components/navbar.js";
import "./components/AddBudgetForm.js";
import "./components/AddExpenseForm.js";
import "./components/BtnDeleteExpenses.js";
import "./components/BtnDeleteBudget.js";
const storedName = localStorage.getItem('userName');

bindEvents();

if (!storedName) {
    showIntro();
} else {
    startApp(storedName);
}

async function startApp(name) {
    showApp(name);
    const [{ budgets }, { expenses }] = await Promise.all([
        fetchBudgetSummary(), fetchExpenses()
    ]);
    console.log(budgets);
    console.log(expenses);
}


