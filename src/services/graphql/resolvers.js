const { PubSub } = require('graphql-subscriptions');
const path = require('path');
const fs = require('fs');
const pubsub = new PubSub();
const dataPath = path.join(__dirname, '../../data/processed/news_data.json');
let data = require(dataPath);

const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data), 'utf8');
  } catch (error) {
    console.error('Error writing to file', error);
  }
};

const resolvers = {
  Query: {
    getArticles: () => {
      return data.articles;
    },

    getArticleBySourceId: (parent, args) => {
      if (!data || !Array.isArray(data.articles)) {
        throw new Error('Data is not properly structured');
      }

      const articlesBySource = data.articles.filter(article => {
        if (article && article.source && article.source.id) {
          return article.source.id === args.sourceId;
        }
        return false;
      });

      if (articlesBySource.length === 0) {
        throw new Error('No articles found for the given source ID');
      }

      return articlesBySource;
    },

    getArticleBySourceName: (parent, args) => {
      if (!data || !Array.isArray(data.articles)) {
        throw new Error('Data is not properly structured');
      }

      const articlesBySource = data.articles.filter(article => {
        if (article && article.source && article.source.name) {
          return article.source.name === args.sourceName;
        }
        return false;
      });

      if (articlesBySource.length === 0) {
        throw new Error('No articles found for the given source name');
      }

      return articlesBySource;
    },
  },

  Mutation: {
    addArticle: (parent, { article }) => {
      const newArticle = {
        source: article.source,
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        content: article.content,
      };

      data.articles.push(newArticle);
      writeDataToFile(data);

      pubsub.publish('ARTICLE_ADDED', { articleAdded: newArticle });

      return {
        success: true,
        article: newArticle,
        message: 'Article added successfully',
      };
    },

    updateArticle: (parent, { title, article }) => {
      const existingArticle = data.articles.find(a => a.title === title);
      if (!existingArticle) throw new Error('Article not found');

      existingArticle.source = article.source || existingArticle.source;
      existingArticle.author = article.author || existingArticle.author;
      existingArticle.title = article.title || existingArticle.title;
      existingArticle.description = article.description || existingArticle.description;
      existingArticle.url = article.url || existingArticle.url;
      existingArticle.urlToImage = article.urlToImage || existingArticle.urlToImage;
      existingArticle.publishedAt = article.publishedAt || existingArticle.publishedAt;
      existingArticle.content = article.content || existingArticle.content;

      writeDataToFile(data);

      return {
        success: true,
        article: existingArticle,
        message: 'Article updated successfully',
      };
    },

    deleteArticle: (parent, { title }) => {
      console.log('Data file path:', dataPath);

      const index = data.articles.findIndex(a => a.title === title);
      if (index === -1) {
        throw new Error('Article not found');
      }
      data.articles.splice(index, 1);

      try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      } catch (error) {
        throw new Error('Error writing data to file');
      }
      return {
        success: true,
        message: 'Article deleted successfully',
      };
    },
  },

  Subscription: {
    articleAdded: {
      subscribe: () => pubsub.asyncIterator(['ARTICLE_ADDED']),
    },
  },
};

module.exports = resolvers;

//Une subscription est une fonctionnalité de GraphQL qui permet d'établir une connexion en temps réel entre 
// le client et le serveur. Contrairement aux requêtes (Query) et mutations (Mutation), 
// qui sont des opérations ponctuelles, une subscription reste ouverte et notifie le client 
// lorsqu'un certain événement se produit sur le serveur.
//En d'autres termes, les subscriptions sont utilisées pour envoyer des données en temps réel 
// depuis le serveur au client lorsqu'un événement spécifique se produit, comme l'ajout,
//  la mise à jour ou la suppression d'un article.