const express = require('express');
const soap = require('soap');
const path = require('path');
const apiRoutes = require('../src/routes/restRoutes');
const soapRoutes = require('../src/routes/soapRoutes');
const graphqlRoutes = require('../src/routes/graphqlRoutes'); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Routes REST
app.use('/api/rest', apiRoutes);

// Routes SOAP
app.use('/api/soap', soapRoutes);

// Routes GraphQL (à développer)
app.use('/api/graphql', graphqlRoutes);  // Assurez-vous que ce fichier soit développé

// Lancer le serveur sur le port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`links to service endpoints:
        SOAP: http://localhost:3000/api/soap?WSDL
        REST: http://localhost:3000/api/rest 
        `

    );
});
