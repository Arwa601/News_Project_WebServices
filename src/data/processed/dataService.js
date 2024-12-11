const { fetchNews, filterArticles, saveNewsToFile } = require('./dataUtils');

async function processAndSaveNews() {
  const articles = await fetchNews();
  const filteredArticles = filterArticles(articles);
  saveNewsToFile(filteredArticles);
}

module.exports = {
  processAndSaveNews,
};
