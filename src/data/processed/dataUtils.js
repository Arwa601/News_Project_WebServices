const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function fetchNews() {
  const apiKey = process.env.API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?country=fr&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return [];
  }
}

function filterArticles(articles) {
  return articles.filter(article => article.urlToImage && article.title && article.description);
}

function saveNewsToFile(articles) {
  fs.writeFileSync('./src/data/processed/news.json', JSON.stringify(articles, null, 2));
  console.log("Les articles filtrés ont été sauvegardés.");
}

module.exports = {
  fetchNews,
  filterArticles,
  saveNewsToFile,
};
