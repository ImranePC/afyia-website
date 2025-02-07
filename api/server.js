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

app.post('/send-message', (req, res) => {
  const { body } = req;

  console.log(body);
  const data = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    message: body.message,
    subject: body.subject
  }

  try{
    saveMessage(res, data);
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

function saveMessage(res, data) {
  console.log(data);
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