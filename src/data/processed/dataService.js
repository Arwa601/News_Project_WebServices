const fs = require('fs');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('897c2b6893254ec181d0c3fba3049a73');


newsapi.v2.topHeadlines({
  language: 'en',  
  country: 'us'    
}).then(response => {
  if (response.status === 'ok') {
    
    const filePath = './news_data.json'; 

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
