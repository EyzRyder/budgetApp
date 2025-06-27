export function showIntro() {
    const introElement = document.getElementById('intro');
    const dashElement = document.getElementById('dashboard');

    if (introElement || dashElement) {
        introElement.style.display = 'flex';
        dashElement.style.display = 'none';
    } else {
        console.error("element not found")
    }
}

export function showApp(name) {
    const introElement = document.getElementById('intro');
    const dashElement = document.getElementById('dashboard');
    const spanElement = document.getElementById('usernamespan');

    if (introElement || dashElement || spanElement) {
        introElement.style.display = 'none';
        dashElement.style.display = 'grid';
        spanElement.textContent = name;
    } else {
        console.error("element not found")
    }
}

export function addBudget(budget) {
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