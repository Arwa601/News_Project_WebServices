const fs = require('fs');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('897c2b6893254ec181d0c3fba3049a73');

// Fetch articles from all fields
newsapi.v2.topHeadlines({
  language: 'en',  // Fetch articles in English
  country: 'us'    // Fetch articles for the US (can be adjusted for other countries)
}).then(response => {
  if (response.status === 'ok') {
    // Save the response data to a JSON file
    const filePath = './news_data.json'; // Specify the path to save the JSON file

    fs.writeFile(filePath, JSON.stringify(response, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Data successfully saved to', filePath);
      }
    });
  } else {
    console.error('Failed to fetch data from the News API:', response);
  }
}).catch(err => {
  console.error('An error occurred:', err);
});
