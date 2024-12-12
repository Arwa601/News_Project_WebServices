// middlewares/validationMiddleware.js
module.exports.validateArticle = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    next();
};
