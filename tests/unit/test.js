const { filterArticles } = require('../../src/data/processed/dataUtils');

describe('Filtrage des articles', () => {
  test('filtre les articles avec les champs nécessaires', () => {
    const articles = [
      { title: 'Test', description: 'Description', urlToImage: 'image.jpg' },
      { title: 'Incomplet', description: null, urlToImage: 'image.jpg' },
    ];
    const result = filterArticles(articles);
    expect(result.length).toBe(1);
  });
});
