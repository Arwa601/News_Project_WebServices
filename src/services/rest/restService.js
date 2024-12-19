const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'processed', 'news_data.json');


console.log('Data file path:', DATA_FILE); // Debug log

class RestService {
    static async readData() {
        try {
            // Check if file exists
            try {
                await fs.access(DATA_FILE);
                console.log('Successfully accessed file at:', DATA_FILE);
            } catch (err) {
                console.error('File access error:', err.message);
                throw new Error(`Cannot access data file at: ${DATA_FILE}`);
            }

            const data = await fs.readFile(DATA_FILE, 'utf8');
            console.log('Read data:', data.substring(0, 100) + '...'); // Debug log
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error.message);
            throw error;
        }
    }

    static async writeData(data) {
        try {
            await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
            console.log('Successfully wrote to file:', DATA_FILE);
        } catch (error) {
            console.error('Error writing file:', error.message);
            throw error;
        }
    }

    static async getAllArticles() {
        const data = await this.readData();
        return data.articles;
    }

    static async getArticleById(id) {
        const data = await this.readData();
        return data.articles[id];
    }

    static async createArticle(article) {
        const data = await this.readData();
        const newArticle = {
            ...article,
            tags: article.tags || [],
            createdAt: new Date().toISOString()
        };
        data.articles.push(newArticle);
        await this.writeData(data);
        return newArticle;
    }

    static async updateArticle(id, updatedArticle) {
        const data = await this.readData();
        if (id >= 0 && id < data.articles.length) {
            data.articles[id] = {
                ...data.articles[id],
                ...updatedArticle,
                tags: updatedArticle.tags || data.articles[id].tags || [],
                updatedAt: new Date().toISOString()
            };
            await this.writeData(data);
            return data.articles[id];
        }
        return null;
    }

    static async deleteArticle(id) {
        const data = await this.readData();
        if (id >= 0 && id < data.articles.length) {
            data.articles.splice(id, 1);
            await this.writeData(data);
            return true;
        }
        return false;
    }
}

module.exports = RestService;