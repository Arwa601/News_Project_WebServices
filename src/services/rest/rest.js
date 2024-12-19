const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../config/swaggerConfig'); // Ici nous utilisons swaggerSpec
const fs = require('fs').promises;
const restMiddleware = require('../../middlewares/restMiddleware');
const articlesRoute=require('../../routes/articles');
const cors = require('cors'); 
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

app.use(cors()); 
app.use(express.json());
app.use('/api/articles', articlesRoute); 

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'processed', 'news_data.json');
async function verifyDataFile() {
    try {
        await fs.access(DATA_FILE);
        const data = await fs.readFile(DATA_FILE, 'utf8');
        console.log('Data file verified at:', DATA_FILE);
        console.log('Initial data:', data.substring(0, 100) + '...');
    } catch (error) {
        console.error('Data file verification failed:', error.message);
        console.log('Expected file path:', DATA_FILE);
        process.exit(1); 
    }
}

async function startServer() {
    await verifyDataFile();
    
    app.use('/api/articles', restMiddleware);
    app.use(express.static(path.join(__dirname, '..', 'public')));
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Data file location: ${DATA_FILE}`);
        console.log('you find swagger documentation at http://localhost:3001/api-docs');
    });
}

startServer().catch(console.error);
