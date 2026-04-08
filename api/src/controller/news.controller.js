const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./directus/database/afyiadb.sqlite');
const LANGUAGES = ['fr', 'en'];

function removeNews(data) {
  const query = `
    DELETE from news WHERE id = ?
  `;

  const inputs = [Number(data.id)];

  return new Promise((resolve, reject) => {
    db.run(query, inputs, function (err) {
      if (err) {
        return reject(new Error('Error while DELETE news'));
      }

      resolve({ changes: this.changes })
    })
  })
}

async function createNews(data) {
  const query = `
    INSERT into news VALUES (null, ?, ?, ?, ?, ?, ?, ?)
  `;

  const inputs = [
    data.title.en,
    data.title.fr,
    data.content.en,
    data.content.fr,
    data.publishedAt,
    data.imageUrl,
    data.bannerUrl,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, inputs, function (err) {
      if (err) {
        reject(new Error('Error while INSERT news'));
      }

      resolve(this.lastID);
    });
  })
}

async function updateNews(data) {
  if (!data.id) {
    throw new Error('Missing news id');
  }

  const query = `
    UPDATE news
    SET title_en = ?,
      title_fr = ?,
      content_en = ?,
      content_fr = ?,
      published_at = ?,
      image_url = ?,
      banner_url = ?
    WHERE news.id = ?
  `;

  const inputs = [
    data.title.en,
    data.title.fr,
    data.content.en,
    data.content.fr,
    data.publishedAt,
    data.imageUrl,
    data.bannerUrl,
    data.id,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, inputs, (err) => {
      if (err) {
        console.error(err);
        reject(new Error('Error while fetching news'));
      } else {
        resolve({ changes: this.changes });
      }
    })
  });
}

async function getNewsById(id, language) {
  let contentI18n;
  let titleI18n;

  if (['fr', 'en'].includes(language)) {
    contentI18n = `content_${language}`;
    titleI18n = `title_${language}`;
  } else {
    // Fetch all language
    contentI18n = `content_fr, content_en`;
    titleI18n = `title_fr, title_en`;
  }

  const query = `
    SELECT id, ${titleI18n}, ${contentI18n}, published_at, image_file, banner_file
    FROM news
    WHERE id = ${id}
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(new Error('Error while fetching news'));
      } else {
        resolve(rows);
      }
    })
  });
}

async function getNews(language) {
  const textLimit = 100;
  const directusEnabled = true;
  let contentI18n;
  let titleI18n;

  if (LANGUAGES.includes(language)) {
    contentI18n = `content_${language}`;
    titleI18n = `title_${language}`;
  }

  const query = `SELECT
    news.id,
    ${titleI18n},
    CASE
      WHEN LENGTH(${contentI18n}) > ${textLimit}
      THEN SUBSTRING(${contentI18n}, 1, ${textLimit}) || '...'
      ELSE ${contentI18n}
    END as ${contentI18n},
    image_file,
    directus_files.type
    FROM news
    LEFT JOIN directus_files ON news.image_file = directus_files.id
    ORDER BY published_at DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(new Error('Error while fetching news'));
      } else {
        resolve(rows);
      }
    });
  });
}

async function saveNewsletterEmail(email) {
  if (!email) {
    throw new Error('Missing argument');
  }

  const query = `INSERT OR IGNORE INTO newsletter_email (email) VALUES (?)`;

  return new Promise((resolve, reject) => {
    db.run(query, [email], function (err) {
      if (err) {
        console.error(err.message);
        reject(new Error('Error while INSERT to newsletter_email'));
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = {
  removeNews,
  createNews,
  updateNews,
  getNewsById,
  getNews,
  saveNewsletterEmail,
  LANGUAGES,
}