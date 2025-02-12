require('dotenv').config({ path: './api/.env' });
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');

const app = express();
const db = new sqlite3.Database('./api/afyiadb.sqlite');
const PORT = process.env.PORT;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const ENV = process.env.NODE_ENV;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Unauthorized request'));
    }
  }
};

app.use(express.json());
app.use(cors());
app.use(limiter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/', (req, res) => {
  res.send('hello world');
})

app.get('/news', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await getNews(language);
    res.json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

app.get('/news/:id', async (req, res) => {
  const params = req.params;
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await getNewsById(params.id, language);
    res.json(data[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/send-message', (req, res) => {
  const body = req.body;

  const data = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    message: body.message,
    subject: body.subject
  }

  try {
    saveMessage(data);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error, please check logs'
    });

    return;
  }

  res.status(201).json({
    message: 'Done'
  });
});

if (ENV === 'production') {
  const privateKey  = fs.readFileSync(process.env.SSL_KEY, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');
  const credentials = {
    key: privateKey,
    cert: certificate,
  };

  https.createServer(credentials, app).listen(PORT, () => {
    console.log('HTTPS: Server listening on port ' + PORT);
  });
} else {
  app.listen(PORT, () => {
    console.log('HTTP : Server listening on port ' + PORT);
  });
}

function saveMessage(data) {
  if (!data.firstname || !data.lastname || !data.email || !data.message || !data.subject) {
    throw new Error('Missing argument');
  }

  const query = `
    INSERT into direct_message (firstname, lastname, email, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [data.firstname, data.lastname, data.email, data.message], function (err) {
    if (err) {
      throw new Error('Error while INSERT');
    }

    return true;
  });
}

async function getNews(language) {
  const textLimit = 100;
  const contentI18n = language === 'fr' ? 'content_fr' : 'content_en';
  const titleI18n = language === 'fr' ? 'title_fr' : 'title_en';

  const query = `SELECT id,
    ${titleI18n} as title,
    CASE
      WHEN LENGTH(${contentI18n}) > ${textLimit}
      THEN SUBSTRING(${contentI18n}, 1, ${textLimit}) || '...'
      ELSE ${contentI18n}
    END as content,
    image_url
  FROM news ORDER BY published_at DESC`;

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

async function getNewsById(id, language) {
  const contentI18n = language === 'fr' ? 'content_fr' : 'content_en';
  const titleI18n = language === 'fr' ? 'title_fr' : 'title_en';

  const query = `
    SELECT id, ${titleI18n} as title, ${contentI18n} as content, published_at, image_url, banner_url
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