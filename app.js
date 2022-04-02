//
// usage script example
//
const heo = require('./lib/scraper/heo.js');
require('dotenv-safe').config();

(async () => {
  console.log('scraping in progress...');
  console.time('scrape item');

  const headless = true;

  await heo.init({
    username: process.env.HEO_USERNAME,
    password: process.env.HEO_PASSWORD,
    useCookies: true,
    headless,
  });

  const data = await heo.getProductById('OTT46388');
  console.dir(data);

  await heo.term();

  console.timeEnd('scrape item');
})();
