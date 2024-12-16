
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');  // Mettez à jour le chemin vers votre typeDefs
const resolvers = require('./resolvers');  // Mettez à jour le chemin vers votre resolvers

const startApolloServer = async () => {
  const app = express(); // Création de l'application Express
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Attendre que le serveur Apollo démarre
  await server.start();

  // Appliquer Apollo Server comme middleware pour l'application Express
  server.applyMiddleware({ app });

  // Démarrer le serveur Express sur le port 4000
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

// Démarrer le serveur
startApolloServer().catch((err) => {
  console.error('Error starting Apollo Server:', err);
});
