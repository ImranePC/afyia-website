const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./api/afyiadb.sqlite');
const app = express();
const PORT = 3001;

const allowedOrigins = ['https://afyia-diagnostics.com'];

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

app.get('/', (req, res) => {
  res.send('hello world');
})

app.get('/hey', (req, res) => {
  res.send('zoubir');
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

app.listen(PORT);

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