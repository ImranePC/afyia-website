const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../controller/auth.controller');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const imagesDir = path.join(__dirname, '../../uploads/');

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

router.post('/admin/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'Image uploadée avec succès', imageUrl });
});

router.post('/admin/news', async (req, res) => {
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

router.delete('/admin/news/:id', async (req, res) => {
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

router.put('/admin/news', authMiddleware, (req, res) => {
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

router.get('/admin/list-images', authMiddleware, (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Erreur lecture du dossier :', err);
      return res.status(500).json({ error: 'Erreur lors de la lecture du dossier' });
    }

    res.json({ files });
  })
})

module.exports = router;