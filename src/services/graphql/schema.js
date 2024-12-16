const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type Source {
    id: String
    name: String
  }

  type Article {
    source: Source
    author: String
    title: String
    description: String
    url: String
    urlToImage: String
    publishedAt: String
    content: String
  }

  type Query {
    getArticles: [Article]
    getArticleBySourceId(sourceId: String): [Article]
    getArticleBySourceName(sourceName: String): [Article]

  }
  input SourceInput {
    id: String
    name: String
  }

  input ArticleInput {
    source: SourceInput
    author: String
    title: String
    description: String
    url: String
    urlToImage: String
    publishedAt: String
    content: String
  }

  type Mutation {
    addArticle(article: ArticleInput): ArticleResponse
    updateArticle(title: String, article: ArticleInput): ArticleResponse
    deleteArticle(title: String): DeleteResponse
  }

  type ArticleResponse {
    success: Boolean!
    article: Article
    message: String
  }

  type DeleteResponse {
    success: Boolean!
    message: String
  }

  type Subscription {
    articleAdded: Article!
  }
`;

module.exports = typeDefs;
