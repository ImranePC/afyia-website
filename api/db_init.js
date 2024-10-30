const sqlite3 = require('sqite3').verbose();
const db = new sqlite3.Database('mydb.sqlite');

function initDatabase() {
  console.log('Database init:');

  createTable('direct_message', `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT,
    lastname TEXT,
    email TEXT,
    message TEXT,
    subject TEXT
  `);
}

function createTable(name, query) {
  console.log(`Creating: ${name} table`);

  db.run(`
    CREATE TABLE IF NOT EXISTS ${name} (
      ${query}
    )
  `, (err) => {
    if (err) {
      console.error(`Erreur lors de la création de la table ${name} :`, err.message);
    } else {
      console.log(`${name} already exist`);
    }
  });
}

initDatabase();
db.close();

