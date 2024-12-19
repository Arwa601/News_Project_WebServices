const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
// Définition de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API REST pour la gestion des articles',
  },
  servers: [
    {
      url: 'http://localhost:3001/api', 
      description: 'Serveur local',
    },
  ],
  components: {
    schemas: {
      Article: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          title: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
};

// Options SwaggerJSDoc
const options = {
  swaggerDefinition, 
  apis: [path.join(__dirname, 'src/routes/*.js')],
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
