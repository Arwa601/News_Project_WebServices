module.exports = {
    validateArticleSOAP: function (article) {
        if (!article || !article.title ) {
            return 'Title is required for an article.';
        }
        if (article.title.length > 100) {
            return 'Title must be less than 100 characters.';
        }

        if (article.content.length > 1000) {
            return 'Content must be less than 1000 characters.';
        }
        return null;
    }
};
