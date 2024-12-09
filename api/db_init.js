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

  createTable('news', `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT NOT NULL
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

