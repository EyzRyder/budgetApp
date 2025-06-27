// this file cotains the Event binding logic
import { createBudget, deleteBudget, createExpense, deleteExpense, updateBudget, updateExpense } from './api.js';
import { addBudget, addExpense, populateBudgetSelect } from './ui.js';

export function bindEvents() {
    document.getElementById('budget-form').addEventListener('submit', async e => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const amount = parseFloat(e.target.amount.value);
        const result = await createBudget({ name, amount });
        if (result.success) addBudget(result.budget, {});
        e.target.reset();
    });

    document.getElementById('expense-form').addEventListener('submit', async e => {
        e.preventDefault();
        const { name, amount, budgetId } = Object.fromEntries(new FormData(e.target));
        const result = await createExpense({ name, amount: parseFloat(amount), budgetId });
        if (result.success) addExpense(result.expense);
        e.target.reset();
    });

    document.getElementById('budget-list').addEventListener('click', async e => {
        if (e.target.matches('.delete-budget')) {
            const id = e.target.dataset.id;
            if (confirm('Delete this budget?')) {
                const res = await deleteBudget(id);
                if (res.success) document.querySelector(`[data-budget-id="${id}"]`).remove();
            }
        } else if (e.target.matches('.delete-expense')) {
            const id = e.target.dataset.id;
            if (confirm('Delete this expense?')) {
                const res = await deleteExpense(id);
                if (res.success) document.querySelector(`[data-expense-id="${id}"]`).remove();
            }
        }
    });
    
    document.getElementById('budget-list').addEventListener('click', e => {
        if (e.target.matches('.edit-budget')) {
            const id = e.target.dataset.id;
            document.querySelector(`form.edit-budget-form[data-id="${id}"]`).style.display = 'block';
            e.target.style.display = 'none';
        }
    });

    document.getElementById('budget-list').addEventListener('submit', async e => {
        if (e.target.matches('.edit-budget-form')) {
            e.preventDefault();
            const id = e.target.dataset.id;
            const name = e.target.editName.value.trim();
            const amount = parseFloat(e.target.editAmount.value);

            const result = await updateBudget({ id, name, amount });
            if (result.success) {
                location.reload(); // simplest way to reflect update
            } else {
                alert(result.error || 'Could not update budget');
            }
        }
        if (e.target.matches('.edit-expense')) {
            const id = e.target.dataset.id;
            const form = document.querySelector(`.edit-expense-form[data-id="${id}"]`);
            form.style.display = 'block';
            e.target.style.display = 'none';
        }
    });

    document.getElementById('budget-list').addEventListener('submit', async e => {
        if (e.target.matches('.edit-expense-form')) {
            e.preventDefault();
            const id = e.target.dataset.id;
            const name = e.target.editName.value.trim();
            const amount = parseFloat(e.target.editAmount.value);

            const result = await updateExpense({ id, name, amount });
            if (result.success) {
                location.reload(); // simplest refresh
            } else {
                alert(result.error || 'Could not update expense');
            }
        }
    });
}
