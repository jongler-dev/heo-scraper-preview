const puppeteer = require('puppeteer');

const HOME_URL = 'https://www.heo.com/uk/en';
const PRODUCT_URL = (productId) => `${HOME_URL}/product/${productId}`;

const self = {
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

    self.browser = await puppeteer.launch(options);
    self.page = await self.browser.newPage();

    if (params.useCookies) {
      await self._loginWithCookies(params.username, params.password);
    } else {
      await self._login(params.username, params.password);
    }
  },

  async term() {
    await self.browser?.close();
  },

  // mainly for testing
  async resetCookies() {
    self.cookies = [];
  },

  async _loginWithCookies(username, password) {
    // if cookies are available then set them to page and we are logged in
    if (self.cookies.length > 0) {
      await self.page.setCookie(...self.cookies);
      return;
    }

    await self.page.goto(HOME_URL, { waitUntil: 'networkidle2' });

    await self.submitLoginCredentials(username, password);

    self.cookies = await self.page.cookies();
  },

  async _login(username, password) {
    await self.page.goto(HOME_URL, { waitUntil: 'networkidle2' });

    // already logged-in
    const loginText = await self.page.$eval('p.log', (data) => data.innerText);
    if (loginText === 'Logout') {
      console.log('already logged-in');
      return;
    }

    await self.submitLoginCredentials(username, password);
  },

  async submitLoginCredentials(username, password) {
    // perform login
    await self.page.click('div.login-top');
    await self.page.waitForSelector('div.cbox > input');

    // hack: pressing backspace before email/password values are typed
    // see https://github.com/puppeteer/puppeteer/issues/1648#issuecomment-881521529
    await self.page.click('input[ng-model="user.email"]', { delay: 100 });
    await self.page.keyboard.press('Backspace');
    await self.page.type('input[ng-model="user.email"]', username, {
      delay: 50,
    });

    await self.page.click('input[ng-model="user.password"]', { delay: 100 });
    await self.page.keyboard.press('Backspace');
    await self.page.type('input[ng-model="user.password"]', password, {
      delay: 50,
    });

    await self.page.click('div.cbox > input');
    await self.page.waitForSelector('p.log');
    // await self.page.waitForNavigation({ waitUntil: 'networkidle0' });
    await self.page.waitForTimeout(2000); // just in case :-)

    // verify successful log-in
    const loginText = await self.page.$eval('p.log', (data) => data.innerText);
    if (loginText !== 'Logout') {
      throw new Error('Login failed');
    }
  },

  // the function assumes the user is logged in
  async getProductById(productId) {
    return self.getProductByUrl(PRODUCT_URL(productId));
  },

  // the function assumes the user is logged in
  async getProductByUrl(url) {
    try {
      await self.page.goto(url, { waitUntil: 'networkidle2' });

      const data = await self.page.evaluate(() => {
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
        const gtin_ean = document.querySelector(
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
          gtin_ean,
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

module.exports = self;
