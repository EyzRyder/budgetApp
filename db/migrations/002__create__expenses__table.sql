CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  amount REAL NOT NULL,
  budgetId TEXT NOT NULL,
  FOREIGN KEY (budgetId) REFERENCES budgets(id) ON DELETE CASCADE
);