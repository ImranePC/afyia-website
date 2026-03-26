const express = require('express');
const router = express.Router();
const productsController = require('../controller/products.controller');

router.get('/categories', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await productsController.getCategories(language);
    res.json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';
  const pathogens = req.query.pathogen ? [req.query.pathogen] : [];
  const technologies = req.query.technology ? [req.query.technology] : []

  try {
    data = await productsController.getProducts(language, pathogens, technologies);
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/pathogens', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await productsController.getPathogens(language);
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/technologies', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await productsController.getTechnologies(language);
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/featured', async (req, res) => {
  const language = req.get('x-app-lang') ?? 'fr';

  try {
    data = await productsController.getFeaturedProducts(language);
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
