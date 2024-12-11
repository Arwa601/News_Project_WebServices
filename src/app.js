const express = require('express');
const restRoutes = require('./routes/restRoutes');
const graphqlRoutes = require('./routes/graphqlRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api', restRoutes);
// GraphQL (exemple d'implémentation basique)
app.use('/graphql', graphqlRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur!');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
