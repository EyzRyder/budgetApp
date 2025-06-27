<?php
$config = require_once __DIR__ . '/../config/config.php';

try {
    if ($config['use_mysql']) {
        $dsn = "mysql:host={$config['mysql']['host']};dbname={$config['mysql']['dbname']};charset={$config['mysql']['charset']}";
        $db = new PDO($dsn, $config['mysql']['user'], $config['mysql']['password']);
    } else {
        $sqlitePath = $config['sqlite_path'];
        if (!file_exists(dirname($sqlitePath))) {
            mkdir(dirname($sqlitePath), 0777, true);
        }
        $db = new PDO("sqlite:$sqlitePath");
    }

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQLite ingection
    if (!$config['use_mysql']) {
        $db->exec("
            CREATE TABLE IF NOT EXISTS budgets (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                createdAt INTEGER NOT NULL,
                amount REAL NOT NULL,
                color TEXT NOT NULL
            );
        ");

        $db->exec("
            CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                createdAt INTEGER NOT NULL,
                amount REAL NOT NULL,
                budgetId TEXT NOT NULL,
                FOREIGN KEY (budgetId) REFERENCES budgets(id) ON DELETE CASCADE
            );
        ");
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
