require('dotenv').config({ path: './api/.env' });
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const globalRoutes = require('./src/routes/global.routes');
const adminRoutes = require('./src/routes/admin.routes');
const newsRoutes = require('./src/routes/news.routes');
const authRoutes = require('./src/routes/auth.routes');

// const setup
const app = express();
const PORT = process.env.PORT;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
});
const ENV = process.env.NODE_ENV;
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
// end const setup

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use('/', globalRoutes);
app.use('/', adminRoutes);
app.use('/', newsRoutes);
app.use('/', authRoutes);
app.use('/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    extensions: ['png', 'jpg', 'jpeg', 'gif'],
  })
);

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
