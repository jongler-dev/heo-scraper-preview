//
// usage script example
//
import 'dotenv/config';

import { heo } from './lib/scraper/heo.js';

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
