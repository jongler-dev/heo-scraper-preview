const { expect } = require('chai');
require('dotenv-safe').config();

const heo = require('../lib/scraper/heo');

const TEST_TIMEOUT_MS = 1 * 60 * 1000;

describe('Heo tests - sanity', () => {
  it('no credentials provided', async () => {
    try {
      await heo.init();
    } catch (err) {
      expect(err.message).to.equal('Username/Password missing');
      await heo.term();
      return;
    }
    await heo.term();
    expect.fail('Should have thrown');
  });

  it('missing username', async () => {
    try {
      await heo.init({ password: 'fake-password' });
    } catch (err) {
      expect(err.message).to.equal('Username/Password missing');
      await heo.term();
      return;
    }
    await heo.term();
    expect.fail('Should have thrown');
  });

  it('missing password', async () => {
    try {
      await heo.init({ username: 'fake-username' });
    } catch (err) {
      expect(err.message).to.equal('Username/Password missing');
      await heo.term();
      return;
    }
    await heo.term();
    expect.fail('Should have thrown');
  });

  it('bad username/password', async function () {
    this.timeout(TEST_TIMEOUT_MS);
    try {
      await heo.init({
        username: 'fake-username',
        password: 'fake-password',
      });
    } catch (err) {
      expect(err.message).to.equal('Login failed');
      await heo.term();
      return;
    }
    await heo.term();
    expect.fail('Should have thrown');
  });

  it('successful login - use credentials, not cookies', async function () {
    this.timeout(TEST_TIMEOUT_MS);
    try {
      await heo.init({
        username: process.env.HEO_USERNAME,
        password: process.env.HEO_PASSWORD,
      });
    } catch (err) {
      expect.fail('Should NOT have thrown');
    } finally {
      await heo.term();
    }
  });

  it('successful login - no cookies available, login and store them', async function () {
    this.timeout(TEST_TIMEOUT_MS);
    try {
      await heo.resetCookies();

      await heo.init({
        username: process.env.HEO_USERNAME,
        password: process.env.HEO_PASSWORD,
        useCookies: true,
      });
    } catch (err) {
      expect.fail('Should NOT have thrown');
    } finally {
      await heo.term();
    }
  });

  it('successful login - cookies available, use them', async function () {
    this.timeout(TEST_TIMEOUT_MS);
    try {
      await heo.init({
        username: process.env.HEO_USERNAME,
        password: process.env.HEO_PASSWORD,
        useCookies: true,
      });
    } catch (err) {
      expect.fail('Should NOT have thrown');
    } finally {
      await heo.term();
    }
  });
});

describe('Heo tests - basic functionality', function () {
  this.timeout(TEST_TIMEOUT_MS);

  beforeEach(async function () {
    await heo.init({
      username: process.env.HEO_USERNAME,
      password: process.env.HEO_PASSWORD,
      useCookies: true,
    });
  });

  afterEach(async function () {
    await heo.term();
  });

  it('Scrape single product', async () => {
    const productId = 'OTT46388';
    const data = await heo.getProductById(productId); // TODO consider picking a random item from homepage?

    expect(data.url).to.contain(productId);
    expect(data.itemCode).to.equal(productId);

    // better to explicitly check every key in data object,
    // as a for loop may not notice a missing or misspelled key
    expect(data.title).to.be.a('string');
    expect(data.category).to.be.a('string');
    expect(data.producer).to.be.a('string');
    expect(data.theme).to.be.a('string');
    expect(data.productType).to.be.a('string');
    expect(data.description).to.be.a('string');
    expect(data.stockStatus).to.be.a('string');
    expect(data.price).to.be.a('string');
    expect(data.basePrice).to.be.a('string');
    expect(data.weight).to.be.a('string');
    expect(data.caseQuantity).to.be.a('string');
    expect(data.gtin_ean).to.be.a('string');
    expect(data.packaging).to.be.a('string');
    expect(data.srp).to.be.a('string');
    expect(data.imagesUrl).to.be.a('string');
  });
});
