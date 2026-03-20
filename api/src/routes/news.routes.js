const express = require('express');
const router = express.Router();
const path = require('path');
const newsController = require('../controller/news.controller');


router.get('/news', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await newsController.getNews(language);
    res.json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

router.get('/news/:id', async (req, res) => {
  const params = req.params;
  const language = req.get('x-app-lang');

  try {
    data = await newsController.getNewsById(params.id, language);
    res.json(data[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

router.post('/newsletter/save', async (req, res) => {
  const { email } = req.body;

  try {
    await newsController.saveNewsletterEmail(email);
  } catch(err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
    });

    return;
  }

  res.status(201).json({ message: 'Done' });
});

module.exports = router;
