const soap = require('soap');
const fs = require('fs');
const path = require('path');
const wsdl = path.join(__dirname, 'news_service.wsdl');

// Charger les données
const dataPath = path.join(__dirname, '../_news_data.json');
let data;
try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
    data = { status: "ok", totalResults: 0, articles: [] };
}

// Définir les méthodes SOAP
const service = {
    NewsService: {
        NewsPort: {
            // Méthode pour récupérer tous les articles
            getArticles: function (args, callback) {
                callback({ articles: data.articles });
            },

            // Méthode pour récupérer un article par ID
            getArticleById: function (args, callback) {
                const id = parseInt(args.id, 10);
                if (isNaN(id) || id < 0 || id >= data.articles.length) {
                    callback({ error: 'Article not found' });
                } else {
                    callback({ article: data.articles[id] });
                }
            },

            // Méthode pour ajouter un nouvel article
            addArticle: function (args, callback) {
                const newArticle = args.article;
                data.articles.push(newArticle);
                data.totalResults = data.articles.length;
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                callback({ status: 'Article added', article: newArticle });
            },

            // Méthode pour mettre à jour un article existant
            updateArticle: function (args, callback) {
                const id = parseInt(args.id, 10);
                if (isNaN(id) || id < 0 || id >= data.articles.length) {
                    callback({ error: 'Article not found' });
                } else {
                    data.articles[id] = args.article;
                    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                    callback({ status: 'Article updated', article: args.article });
                }
            },

            // Méthode pour supprimer un article
            deleteArticle: function (args, callback) {
                const id = parseInt(args.id, 10);
                if (isNaN(id) || id < 0 || id >= data.articles.length) {
                    callback({ error: 'Article not found' });
                } else {
                    data.articles.splice(id, 1);
                    data.totalResults = data.articles.length;
                    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                    callback({ status: 'Article deleted' });
                }
            }
        }
    }
};

// Créer le serveur SOAP
const createSoapServer = function () {
    const server = soap.listen(app, '/newsService', service, wsdl, () => {
        console.log('SOAP server started');
    });
};

module.exports = createSoapServer;
