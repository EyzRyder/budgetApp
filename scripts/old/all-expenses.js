document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("all-expenses-container");

  fetch("api/get-all-expenses.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) throw new Error("Failed to load");
      if (!data.expenses.length) {
        container.innerHTML = "<p>No expenses to show.</p>";
        return;
      }

      data.expenses.forEach((exp) => {
        const div = document.createElement("div");
        div.className = "budget";
        div.dataset.expenseId = exp.id;
        div.style.borderColor = `hsl(${exp.color})`;

        div.innerHTML = `
          <h3>${exp.name}</h3>
          <p><strong>Amount:</strong> $${exp.amount.toFixed(2)}</p>
          <p><strong>Budget:</strong> ${exp.budgetName}</p>
          <p><small>${new Date(exp.createdAt * 1000).toLocaleDateString()}</small></p>
          <button class="btn btn--warning delete-expense" data-id="${exp.id}">Delete</button>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      container.innerHTML = "<p>Could not load expenses.</p>";
    });

  container.addEventListener("click", async (e) => {
    if (e.target.matches(".delete-expense")) {
      const id = e.target.dataset.id;
      if (!confirm("Delete this expense?")) return;

      const res = await fetch("api/delete-expense.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        document.querySelector(`[data-expense-id="${id}"]`)?.remove();
      } else {
        alert("Failed to delete.");
      }
    }
  });
});
