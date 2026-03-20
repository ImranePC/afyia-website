const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./directus/database/afyiadb.sqlite');

function saveMessage(data) {
  if (!data.firstname || !data.lastname || !data.email || !data.message || !data.subject) {
    throw new Error('Missing argument');
  }

  const query = `
    INSERT into direct_message (firstname, lastname, email, message, subject)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [data.firstname, data.lastname, data.email, data.message, data.subject], function (err) {
    if (err) {
      throw new Error('Error while INSERT');
    }

    return true;
  });
}

module.exports = {
  saveMessage,
}
