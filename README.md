# heo-scraper-preview

A package for basic scraping of [Heo.com](https://www.heo.com) B2B e-commerce website.

This is a **preview** of the my full website scraper and a product tracker project, which scrapes the [Heo.com](https://www.heo.com) B2B e-commerce site and updates my client's B2C e-commerce site with any product data in case it was changed.
Please contact me at jongler.dev at gmail.com for further details about this project, collaboration, etc.

## Overview

Scraping is done by a Node.js script with [puppeteer](https://www.npmjs.com/package/puppeteer).

This is indeed a preview of a bigger and more concise project, but it showcases a few cool features:

1. Unit tests, using [Mocha.js](https://www.npmjs.com/package/mocha) test framework and [Chai.js](https://www.npmjs.com/package/chai) assertion library.
2. Environment variables support, using [dotenv-safe](https://www.npmjs.com/package/dotenv-safe).
3. Usage of the browser's cookies for faster processing time in case running sequential calls, removing the need to re-login every time.
4. Static code analysis with [eslint](https://www.npmjs.com/package/eslint).
5. Automatically run git hooks (specifically pre-commit) using [husky](https://www.npmjs.com/package/husky).

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
