const express = require('express');
const { processAndSaveNews } = require('../data/processed/dataService');

const router = express.Router();

router.get('/news', async (req, res) => {
  try {
    await processAndSaveNews();
    res.sendFile(`${__dirname}/../data/processed/news.json`);
  } catch (error) {
    res.status(500).send('Erreur lors du traitement des données.');
  }
});

module.exports = router;
