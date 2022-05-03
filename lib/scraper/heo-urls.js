export const HOME_URL = 'https://www.heo.com/uk/en';

const PRODUCT_URL = (productId) => `${HOME_URL}/product/${productId}`; // e.g. 'OTT46388'
const SEARCH_PHRASE_URL = (phrase) => `${HOME_URL}/search/${phrase}`; // any search phrase
const PUBLICATIONS_URL = (time) => `${HOME_URL}/appears/${time}`; // e.g. Today, Yesterday, 1%20Week
const STOCK_ARRIVALS_URL = (time) => `${HOME_URL}/arrivals/${time}`; // e.g. 1%20Day%20ago, /2%20Days%20ago
const THEME_URL = (theme) => `${HOME_URL}/theme/${theme}`; // e.g. Mortal%20Kombat
const PRODUCT_TYPE_URL = (type) => `${HOME_URL}/productType/${type}`; // e.g. Puzzles
const PUBLISHER_URL = (name) => `${HOME_URL}/producer/${name}`; // e.g. Prime%201%20Studio

export const getUrlBySrcType = (srcType, param) => {
  switch (srcType) {
    case 'url':
      return param;
    case 'urlsFile':
      return param;
    case 'product':
      return PRODUCT_URL(param);
    case 'searchPhrase':
      return SEARCH_PHRASE_URL(param);
    case 'publications':
      return PUBLICATIONS_URL(param);
    case 'arrivals':
      return STOCK_ARRIVALS_URL(param);
    case 'theme':
      return THEME_URL(param);
    case 'productType':
      return PRODUCT_TYPE_URL(param);
    case 'publisher':
      return PUBLISHER_URL(param);
    default:
      throw new Error(
        `Error: unexpected source type ${srcType} with param ${param}`
      );
  }
};
