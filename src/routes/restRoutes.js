const express = require('express');
const router = express.Router();
const restService = require('../services/rest/rest');
//nous ne devons pas installer un module spécifique comme rest, 
//car le framework Express lui-même suffit à exposer des services REST.
//il suffit Express pour gérer les requêtes HTTP
const fs = require('fs');
const path = require('path');
const validationMiddleware = require('../middlewares/restMiddleware');
const dataPath = path.join(__dirname, '../data/processed/news_data.json');

let data;
try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
    console.error('Error reading data file', error);
    data = { articles: [] };
}

const writeDataToFile = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data), 'utf8');
    } catch (error) {
        console.error('Error writing to file', error);
    }
};

router.get('/articles', (req, res) => {
    res.json(data.articles);
});

router.post('/articles', validationMiddleware.validateArticle, (req, res) => {
    const newArticle = req.body;
    data.articles.push(newArticle);
    writeDataToFile(data);
    res.status(201).json(newArticle);
});

router.put('/articles/:id', validationMiddleware.validateArticle, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    const updatedArticle = req.body;
    data.articles[id] = updatedArticle;
    writeDataToFile(data);
    res.json(updatedArticle);
});

router.delete('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0 || id >= data.articles.length) {
        return res.status(404).json({ error: 'Article not found' });
    }
    data.articles.splice(id, 1);
    writeDataToFile(data);
    res.status(204).send();
});

module.exports = router;
