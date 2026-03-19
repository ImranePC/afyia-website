require('dotenv').config({ path: './api/.env' });
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// const setup
const app = express();

const db = new sqlite3.Database('./directus/database/afyiadb.sqlite');

const PORT = process.env.PORT;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
});

const ENV = process.env.NODE_ENV;

const LANGUAGES = ['fr', 'en'];

const imagesDir = path.join(__dirname, 'uploads/images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');

    const uniqueName = Date.now() + '-' + safeName + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Unauthorized request'));
    }
  },
  credentials: true,
};

const JWT_SECRET = process.env.JWT_SECRET;
// end const setup

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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
  const language = req.get('x-app-lang');

  try {
    data = await getNewsById(params.id, language);
    res.json(data[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

app.get('/admin/list-images', authMiddleware, (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Erreur lecture du dossier :', err);
      return res.status(500).json({ error: 'Erreur lors de la lecture du dossier' });
    }

    res.json({ files });
  })
})

app.get('/check-auth', authMiddleware, (req, res) => {
  res.json({ authenticated: true });
})

app.put('/admin/news', authMiddleware, (req, res) => {
  const body = req.body;

  const data = {
    id: body.id,
    title: {
      fr: body.title.fr,
      en: body.title.en,
    },
    content: {
      fr: body.content.fr,
      en: body.content.en,
    },
    publishedAt: body.published_at,
    imageUrl: body.image_url,
    bannerUrl: body.banner_url,
  };

  try {
    updateNews(data);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error, please check logs'
    });

    return;
  }

  res.status(201).json({
    message: 'Done',
  })
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

app.post('/admin/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'Image uploadée avec succès', imageUrl });
});

app.post('/admin/news', async (req, res) => {
  const body = req.body;

  const data = {
    title: {
      fr: body.title.fr,
      en: body.title.en,
    },
    content: {
      fr: body.content.fr,
      en: body.content.en,
    },
    imageUrl: body.image_url,
    bannerUrl: body.banner_url,
    publishetAd: body.published_at,
  };

  try {
    newsId = await createNews(data);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error, please check logs'
    });

    return;
  }

  res.status(200).json({
    message: 'OK',
  });
});

app.delete('/admin/news/:id', async (req, res) => {
  const params = req.params;

  const data = {
    id: params.id,
  };

  try {
    removeNews(data);
  } catch {
    res.status(500).json({
      message: 'Internal server error, please check logs'
    });

    return;
  }

  res.status(200).json({
    message: 'OK',
  })
});

app.use('/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    extensions: ['png', 'jpg', 'jpeg', 'gif'],
  })
);

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('log_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: (60 * 60) * 1000,
    })

    return res.json({ message: 'Login OK' });
  }

  res.status(401).json({ message: 'Wrong login' });
});

app.post('/newsletter/save', async (req, res) => {
  const { email } = req.body;

  try {
    await saveNewsletterEmail(email);
  } catch(err) {
    res.status(500).json({
      message: 'Internal server error',
    });

    return;
  }

  res.status(201).json({ message: 'Done' });
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
    image_url,
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
    SELECT id, ${titleI18n}, ${contentI18n}, published_at, image_url, banner_url, image_file, banner_file
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
        console.log(err);
        reject(new Error('Error while fetching news'));
      } else {
        resolve({ changes: this.changes });
      }
    })
  });
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

function authMiddleware(req, res, next) {
  const token = req.cookies.log_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
