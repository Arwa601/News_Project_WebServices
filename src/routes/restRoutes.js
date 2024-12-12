// routes/api.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const validationMiddleware = require('../middlewares/restMiddleware');

const router = express.Router();
const dataPath = path.join(__dirname, '../_news_data.json');

let data;
try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
    data = { articles: [] };
}

router.get('/articles', (req, res) => {
    res.json(data.articles);
});

router.post('/articles', validationMiddleware.validateArticle, (req, res) => {
    const newArticle = req.body;
    data.articles.push(newArticle);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(201).json(newArticle);
});

router.put('/articles/:id', validationMiddleware.validateArticle, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    const updatedArticle = req.body;
    data.articles[id] = updatedArticle;
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.json(updatedArticle);
});

router.delete('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    data.articles.splice(id, 1);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(204).send();
});

module.exports = router;
