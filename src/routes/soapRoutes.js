const express = require('express');
const soap = require('soap');
const fs = require('fs');
const path = require('path');
const validationMiddleware = require('../middlewares/soapMiddleware');
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

// Define the SOAP service methods
const service = {
    NewsService: {
        NewsPort: {
            getArticles: (args, callback) => {
                callback(null, { articles: data.articles });
            },

            addArticle: (args, callback) => {
                const newArticle = args.article;
                const validationError = validationMiddleware.validateArticleSOAP(newArticle);

                if (validationError) {
                    return callback({ faultCode: 'Client', faultString: validationError });
                }

                data.articles.push(newArticle);
                writeDataToFile(data);
                callback(null, { success: true, article: newArticle });
            },

            updateArticle: (args, callback) => {
                const id = parseInt(args.id, 10);
                const updatedArticle = args.article;

                if (isNaN(id) || id < 0 || id >= data.articles.length) {
                    return callback({ faultCode: 'Client', faultString: 'Article not found' });
                }

                const validationError = validationMiddleware.validateArticleSOAP(updatedArticle);
                if (validationError) {
                    return callback({ faultCode: 'Client', faultString: validationError });
                }

                data.articles[id] = updatedArticle;
                writeDataToFile(data);
                callback(null, { success: true, article: updatedArticle });
            },

            deleteArticle: (args, callback) => {
                const id = parseInt(args.id, 10);

                if (isNaN(id) || id < 0 || id >= data.articles.length) {
                    return callback({ faultCode: 'Client', faultString: 'Article not found' });
                }

                data.articles.splice(id, 1);
                writeDataToFile(data);
                callback(null, { success: true });
            }
        }
    }
};

// Load the WSDL file
const wsdlPath = path.join(__dirname, '../services/soap/news_service.wsdl');
const wsdlContent = fs.readFileSync(wsdlPath, 'utf8');

// Initialize the SOAP server
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`SOAP server running on http://localhost:${port}`);
});

// Attach the SOAP service
soap.listen(app, '/newsService', service, wsdlContent);
