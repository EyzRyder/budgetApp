CREATE TABLE budgets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  amount REAL NOT NULL,
  color TEXT NOT NULL
);