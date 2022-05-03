import puppeteer from 'puppeteer';

import { HOME_URL as homeUrl, getUrlBySrcType } from './heo-urls.js';

export const heo = {
  browser: null,
  page: null,
  cookies: [],

  // mandatory params: username, password
  // optional params: headless, useCookies
  async init(params) {
    if (!params?.username || !params?.password) {
      throw new Error('Username/Password missing');
    }

    const options = {};
    if (params.headless !== undefined) {
      options.headless = params.headless;
    }

    this.browser = await puppeteer.launch(options);
    this.page = await this.browser.newPage();

    if (params.useCookies) {
      await this._loginWithCookies(params.username, params.password);
    } else {
      await this._login(params.username, params.password);
    }
  },

  async term() {
    await this.browser?.close();
  },

  // mainly for testing
  async resetCookies() {
    this.cookies = [];
  },

  async _loginWithCookies(username, password) {
    // if cookies are available then set them to page and we are logged in
    if (this.cookies.length > 0) {
      await this.page.setCookie(...this.cookies);
      return;
    }

    await this.page.goto(homeUrl, { waitUntil: 'networkidle2' });

    await this.submitLoginCredentials(username, password);

    this.cookies = await this.page.cookies();
  },

  async _login(username, password) {
    await this.page.goto(homeUrl, { waitUntil: 'networkidle2' });

    // already logged-in
    const loginText = await this.page.$eval('p.log', (data) => data.innerText);
    if (loginText === 'Logout') {
      console.log('already logged-in');
      return;
    }

    await this.submitLoginCredentials(username, password);
  },

  async submitLoginCredentials(username, password) {
    // perform login
    await this.page.click('div.login-top');
    await this.page.waitForSelector('div.cbox > input');

    // hack: pressing backspace before email/password values are typed
    // see https://github.com/puppeteer/puppeteer/issues/1648#issuecomment-881521529
    await this.page.click('input[ng-model="user.email"]', { delay: 100 });
    await this.page.keyboard.press('Backspace');
    await this.page.type('input[ng-model="user.email"]', username, {
      delay: 50,
    });

    await this.page.click('input[ng-model="user.password"]', { delay: 100 });
    await this.page.keyboard.press('Backspace');
    await this.page.type('input[ng-model="user.password"]', password, {
      delay: 50,
    });

    await this.page.click('div.cbox > input');
    await this.page.waitForSelector('p.log');
    // await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000); // just in case :-)

    // verify successful log-in
    const loginText = await this.page.$eval('p.log', (data) => data.innerText);
    if (loginText !== 'Logout') {
      throw new Error('Login failed');
    }
  },

  // the function assumes the user is logged in
  async getProductById(productId) {
    const url = getUrlBySrcType('product', productId);
    return this.getProductByUrl(url);
  },

  // the function assumes the user is logged in
  async getProductByUrl(url) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2' });

      const data = await this.page.evaluate(() => {
        // public product data (does not require login)
        const itemCode = document.querySelector('span.blue').innerText;
        const title = document.querySelector('div.v-align > h1').innerText;
        const category = document.querySelector('div.v-align > h2').innerText;
        const description = document.querySelector('div.v-align > p').innerText;
        const stockStatus = document.querySelector('p.ng-scope').innerText;

        // private product data (requires login)
        const price = document.querySelector('p.total-price').innerText;
        const basePrice = document.querySelector('span.prx').innerText;
        const weight = document.querySelector(
          'div.info-detail > p:nth-child(4)'
        ).innerText;
        const caseQuantity = document.querySelector(
          'div.info-detail > p:nth-child(6)'
        ).innerText;
        const gtinEan = document.querySelector(
          'div.info-detail > p:nth-child(8)'
        ).innerText;
        const packaging = document.querySelector(
          'div.info-detail > p:nth-child(10)'
        ).innerText;
        const srp = document.querySelector(
          'div.info-detail > div:nth-child(11) > p:nth-child(2)'
        ).innerText;
        const producer = document.querySelector(
          'p.inline > a:nth-child(2)'
        ).innerText;
        const theme = document.querySelector(
          'p.inline > a:nth-child(3)'
        ).innerText;
        const productType = document.querySelector(
          'div.breadcrump > p.b-cat > a:nth-child(1)'
        ).innerText;
        const imagesUrl = document.querySelector(
          'div.button-image > a.button'
        ).href;

        return {
          itemCode,
          title,
          category,
          producer,
          theme,
          productType,
          description,
          stockStatus,
          price,
          basePrice,
          weight,
          caseQuantity,
          gtinEan,
          packaging,
          srp,
          imagesUrl,
        };
      });

      return { url, ...data };
    } catch (err) {
      console.error(`Failed getting item. Url: ${url}, ${err}`);
      return err;
    }
  },
};
