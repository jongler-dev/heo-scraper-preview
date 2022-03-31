# heo-scraper-preview

A package for basic scraping of [Heo.com](https://www.heo.com) B2B e-commerce website.
Scraping is done by a Node.js script with [puppeteer](https://www.npmjs.com/package/puppeteer).

This is a **preview** of the my full website scraper and a product tracker project, is scrapes the [Heo.com](https://www.heo.com) B2B e-commerce site and updates my client's B2C e-commerce site with any product data in case it was changed.
Please contact me for further details about this project, collaboration, etc.

## Overview

There is an even leaner version of this repo: [scraping-heo-v1](https://github.com/jongler-dev/exercises/tree/master/scraping-heo-v1).
This version is better since it uses:

1. a better repo file structure.
2. unit tests, using [Mocha.js](https://www.npmjs.com/package/mocha) test framework and [Chai.js](https://www.npmjs.com/package/chai) assertion library.
3. environment variables support, using [dotenv-safe](https://www.npmjs.com/package/dotenv-safe).
4. the browser's cookies for faster processing time in case running sequential calls, removing the need to re-login every time.
5. static code analysis with [eslint](https://www.npmjs.com/package/eslint).

## Usage

```
npm install
cp .env.sample .env
# enter your heo.com credetials to .env.
npm start
```

## Testing

```
npm test
```

## Static code analysis

```
npm run lint
```
