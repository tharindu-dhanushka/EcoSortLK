import { WASTE_ITEMS, QUIZ_QUESTIONS } from './data';

export async function initializeDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS waste_items (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      disposal TEXT NOT NULL,
      preparation TEXT NOT NULL,
      warning TEXT NOT NULL,
      reuse TEXT NOT NULL,
      favorite INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL UNIQUE,
      option_1 TEXT NOT NULL,
      option_2 TEXT NOT NULL,
      option_3 TEXT NOT NULL,
      option_4 TEXT NOT NULL,
      answer INTEGER NOT NULL
    );
  `);

  // INSERT OR IGNORE protects user favourites if the app restarts.
  await db.withTransactionAsync(async () => {
    for (const item of WASTE_ITEMS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO waste_items
        (id, name, category, disposal, preparation, warning, reuse)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        item.id, item.name, item.category, item.disposal,
        item.preparation, item.warning, item.reuse
      );
    }
    for (const item of QUIZ_QUESTIONS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO quiz_questions
        (question, option_1, option_2, option_3, option_4, answer)
        VALUES (?, ?, ?, ?, ?, ?)`,
        item.question, ...item.options, item.answer
      );
    }
  });
}
