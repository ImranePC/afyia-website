const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
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

router.get('/check-auth', authController.authMiddleware, (req, res) => {
  res.json({ authenticated: true });
})

module.exports = router;