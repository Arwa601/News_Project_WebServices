const express = require('express');
const apiRoutes = require('./routes/restRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});