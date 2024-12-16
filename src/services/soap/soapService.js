const express = require('express');
const soap = require('soap');
const fs = require('fs');
const path = require('path');
const validationMiddleware = require('../../middlewares/soapMiddleware');
const { console } = require('inspector');
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

const service = {
    NewsService: {
        NewsPort: {
          
            getArticles: (args, callback) => {
                callback(null, { articles: data.articles });
            },

            getArticleById: (args, callback) => {
                const id = args.id; 
                const article = Object.values(data.articles).find(
                    (article) => article.source?.id === id
                );
                if (!article) {
                    return callback({
                        faultCode: 'Client',
                        faultString: `Article with ID '${id}' not found`
                    });
                }
            
                callback(null, { article });
            },   

    
            addArticle: (args, callback) => {
                const newArticle = args.article;
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

                if (!articleData || !articleData.title || !articleData.content) {
                    return callback({
                        faultCode: 'Client',
                        faultString: 'Missing or invalid article data (title or content)',
                    });
                }

                const id = requestInfo.id;

                if (!data.articles[id]) {
                    return callback({
                        faultCode: 'Client',
                        faultString: 'Article not found',
                    });
                }

                try {
                    data.articles[id] = {
                        title: articleData.title,
                        content: articleData.content,
                    };

                    writeDataToFile(data);

                    callback(null, {
                        status: 'Article updated',
                        article: data.articles[id],
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
                
                if (!requestInfo || !requestInfo.id) {
                    return callback({
                        faultCode: 'Client',
                        faultString: 'Missing or invalid article ID',
                    });
                }
            
                const id = parseInt(requestInfo.id, 10);
            
                if (isNaN(id) || id < 0 || id >= data.articles.length) {
                    return callback({
                        faultCode: 'Client',
                        faultString: `Article with ID '${id}' not found`,
                    });
                }
            
                try {
                    data.articles.splice(id, 1);
                    writeDataToFile(data);
            
                    callback(null, { success: true });
                } catch (err) {
                    callback({
                        faultCode: 'Server',
                        faultString: `Server error: ${err.message}`,
                    });
                }
            }
            
        }
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
