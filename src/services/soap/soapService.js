const express = require('express');
const soap = require('soap');
const fs = require('fs');
const path = require('path');
const validationMiddleware = require('../../middlewares/soapMiddleware');
const dataPath = path.join(__dirname, '../../data/processed/news_data.json');


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

const service = {
    NewsService: {
        NewsPort: {
          
            getArticles: (args, callback) => {
                callback(null, { articles: data.articles });
            },
            addArticle: (args, callback) => {
                const newArticle = args.article;
            
                // Check if the article contains all necessary fields
                if (!newArticle.title || !newArticle.content) {
                    return callback({ faultCode: 'Client', faultString: 'Missing title or content' });
                }
            
                // Optional description field - set default if missing
                if (!newArticle.description) {
                    newArticle.description = 'No description provided';
                }
            
                const validationError = validationMiddleware.validateArticleSOAP(newArticle);
            
                if (validationError) {
                    return callback({ faultCode: 'Client', faultString: validationError });
                }
            
                console.log(newArticle);
                data.articles.push(newArticle);
                writeDataToFile(data);
                console.log(data);
                callback(null, { success: true, article: newArticle });
            },
            

            updateArticle: (args, callback) => {
                const requestInfo = args.ArticleRequest?.RequestInfo;
                const articleData = args.ArticleRequest?.article;
        
                if (!requestInfo || !requestInfo.id) {
                    return callback({
                        faultCode: 'Client',
                        faultString: 'Missing or invalid article ID',
                    });
                }
        
                if (!data || !Array.isArray(data.articles)) {
                    return callback({
                        faultCode: 'Server',
                        faultString: 'Data is not properly structured',
                    });
                }
        
                const id = requestInfo.id;
                const existingArticle = data.articles.find((article) => article.source?.id === id);
        
                if (!existingArticle) {
                    return callback({
                        faultCode: 'Client',
                        faultString: `Article with ID '${id}' not found`,
                    });
                }
        
                try {
                    Object.assign(existingArticle, articleData);
                    writeDataToFile(data);
        
                    callback(null, {
                        status: 'Article updated',
                        article: existingArticle,
                    });
                } catch (err) {
                    callback({
                        faultCode: 'Server',
                        faultString: `Server error: ${err.message}`,
                    });
                }
            },
        
            deleteArticle: (args, callback) => {
                const requestInfo = args.RequestInfo;
                console.log('Arguments reçus :', args);
                if (!requestInfo || !requestInfo.id) {
                    return callback({
                        faultCode: 'Client',
                        faultString: 'Missing or invalid article ID',
                    });
                }
            
                const id = requestInfo.id;
                console.log("ID reçu dans la requête : ", id);

            
                if (!data || !Array.isArray(data.articles)) {
                    return callback({
                        faultCode: 'Server',
                        faultString: 'Data is not properly structured',
                    });
                }
            
                const articleIndex = data.articles.findIndex((article) => article.source && article.source.id === id);
            
                if (articleIndex === -1) {
                    return callback({
                        faultCode: 'Client',
                        faultString: `Article with source ID '${id}' not found`,
                    });
                }
            
                try {
                    data.articles.splice(articleIndex, 1);
                    writeDataToFile(data);
            
                    callback(null, { success: true });
                } catch (err) {
                    callback({
                        faultCode: 'Server',
                        faultString: `Server error: ${err.message}`,
                    });
                }
            },
            
            getArticlesBySourceId: (args, callback) => {
                const sourceId = args.sourceId;
        
                if (!data || !Array.isArray(data.articles)) {
                    return callback({
                        faultCode: 'Server',
                        faultString: 'Data is not properly structured',
                    });
                }
        
                const articles = data.articles.filter((article) => article.source?.id === sourceId);
        
                if (articles.length === 0) {
                    return callback({
                        faultCode: 'Client',
                        faultString: `No articles found for source ID '${sourceId}'`,
                    });
                }
        
                callback(null, { articles });
            },
        
            getArticlesBySourceName: (args, callback) => {
                const sourceName = args.sourceName;
        
                if (!data || !Array.isArray(data.articles)) {
                    return callback({
                        faultCode: 'Server',
                        faultString: 'Data is not properly structured',
                    });
                }
        
                const articles = data.articles.filter((article) => article.source?.name === sourceName);
        
                if (articles.length === 0) {
                    return callback({
                        faultCode: 'Client',
                        faultString: `No articles found for source name '${sourceName}'`,
                    });
                }
        
                callback(null, { articles });
            },
        },
    }
};

const wsdlPath = 'C:\\Users\\Arwa-PC\\Desktop\\Projects\\News_Project_Soc-WebServices\\src\\services\\soap\\news_service.wsdl';
const wsdlContent = fs.readFileSync(wsdlPath, 'utf8');


const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`SOAP server running on http://localhost:${port}`);
});

soap.listen(app, '/newsService', service, wsdlContent, () => {
    console.log(`SOAP server is ready to handle requests.`);
});
