const express = require('express');
const router = express.Router();
const RestService = require('../services/rest/restService');

router.get('/', async (req, res) => {
    try {
        const articles = await RestService.getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const article = await RestService.getArticleById(parseInt(req.params.id));
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
     
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({
                error: 'Missing required fields',
                requiredFields: ['title', 'content']
            });
        }

        const newArticle = await RestService.createArticle(req.body);
        res.status(201).json({
            message: 'Article created successfully',
            article: newArticle,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedArticle = await RestService.updateArticle(parseInt(req.params.id), req.body);
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const success = await RestService.deleteArticle(parseInt(req.params.id));
        if (!success) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
