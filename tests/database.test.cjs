const assert = require('node:assert/strict');
const { readFileSync, mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const { DatabaseSync } = require('node:sqlite');

const root = join(__dirname, '..');
const context = vm.createContext({});
for (const path of ['src/data.js', 'src/ecoTips.js']) {
  vm.runInContext(readFileSync(join(root, path), 'utf8').replace(/export /g, ''), context);
}
vm.runInContext(readFileSync(join(root, 'src/database.js'), 'utf8')
  .replace(/^import .*;\r?\n/gm, '').replace('export async function', 'async function'), context);

function adapter(sql) {
  return {
    execAsync: async statement => sql.exec(statement),
    runAsync: async (statement, ...params) => sql.prepare(statement).run(...params),
    getAllAsync: async (statement, ...params) => sql.prepare(statement).all(...params),
    withTransactionAsync: async operation => {
      sql.exec('BEGIN');
      try { await operation(); sql.exec('COMMIT'); }
      catch (error) { sql.exec('ROLLBACK'); throw error; }
    },
  };
}

test('fresh install seeds eight readable tips alongside existing materials and quiz', async () => {
  const sql = new DatabaseSync(':memory:');
  try {
    const db = adapter(sql);
    await context.initializeDatabase(db);
    const tips = await context.getEcoTips(db);
    assert.equal(tips.length, 8);
    assert.equal(new Set(tips.map(tip => tip.id)).size, 8);
    assert.ok(tips.every(tip => tip.title.trim() && tip.body.trim()));
    assert.deepEqual(tips.map(tip => tip.id), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM waste_items').get().n, 20);
    assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM quiz_questions').get().n, 5);
  } finally { sql.close(); }
});

test('upgrade creates tips without losing favorites and reopening preserves local data', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'ecosort-tips-'));
  const path = join(directory, 'test.db');
  let sql = new DatabaseSync(path);
  try {
    // Reproduce the existing released schema, then migrate it with the new initializer.
    sql.exec(`CREATE TABLE waste_items (
      id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL,
      disposal TEXT NOT NULL, preparation TEXT NOT NULL, warning TEXT NOT NULL,
      reuse TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT 0);
      INSERT INTO waste_items VALUES (1, 'My existing bottle', 'Plastic', 'Keep', 'Keep', 'Keep', 'Keep', 1);`);
    await context.initializeDatabase(adapter(sql));
    sql.prepare("UPDATE eco_tips SET body = 'Outdated tip' WHERE id = 1").run();
    await context.initializeDatabase(adapter(sql));
    assert.equal(sql.prepare('SELECT favorite FROM waste_items WHERE id=1').get().favorite, 1);
    assert.equal(sql.prepare('SELECT name FROM waste_items WHERE id=1').get().name, 'My existing bottle');
    assert.notEqual(sql.prepare('SELECT body FROM eco_tips WHERE id=1').get().body, 'Outdated tip');
    sql.close();
    sql = new DatabaseSync(path);
    assert.equal((await context.getEcoTips(adapter(sql))).length, 8);
    assert.equal(sql.prepare('SELECT favorite FROM waste_items WHERE id=1').get().favorite, 1);
  } finally {
    sql.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('tip retrieval exposes empty results and propagates database errors for screen recovery', async () => {
  const sql = new DatabaseSync(':memory:');
  try {
    await context.initializeDatabase(adapter(sql));
    sql.exec('DELETE FROM eco_tips');
    assert.equal((await context.getEcoTips(adapter(sql))).length, 0);
    await assert.rejects(context.getEcoTips({ getAllAsync: async () => { throw new Error('Unavailable'); } }), /Unavailable/);
  } finally { sql.close(); }
});
