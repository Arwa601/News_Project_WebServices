const express = require('express');
const fs = require('fs');
const path = require('path');
const validationMiddleware = require('../middlewares/restMiddleware');

const router = express.Router();
const dataPath = path.join(__dirname, '../_news_data.json');

let data;
// Lecture des données du fichier JSON
try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
    data = { status: "ok", totalResults: 0, articles: [] };
}

// Route pour récupérer tous les articles
router.get('/articles', (req, res) => {
    res.json(data);
});

// Route pour récupérer un article par ID
router.get('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    res.json(data.articles[id]);
});

// Route pour ajouter un nouvel article
router.post('/articles', validationMiddleware.validateArticle, (req, res) => {
    const newArticle = req.body;
    data.articles.push(newArticle);
    data.totalResults = data.articles.length; // Mettre à jour le total
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); // Indentation pour un JSON lisible
    res.status(201).json(newArticle);
});

// Route pour mettre à jour un article existant
router.put('/articles/:id', validationMiddleware.validateArticle, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    const updatedArticle = req.body;
    data.articles[id] = updatedArticle;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json(updatedArticle);
});

// Route pour supprimer un article
router.delete('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    data.articles.splice(id, 1);
    data.totalResults = data.articles.length; // Mettre à jour le total
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.status(204).send();
});

module.exports = router;
