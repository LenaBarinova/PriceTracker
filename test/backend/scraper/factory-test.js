'use strict';

var expect = require('chai').expect;
var proxyquire = require('proxyquire').noCallThru();

var amazonStub = { scraper: 'AmazonScraper' };
var backcountryStub = { scraper: 'BackcountryScraper' };
var reiStub = { scraper: 'REIScraper' };
var campsaverStub = { scraper: 'CampSaverScraper' };
var moosejawStub = { scraper: 'Moosejaw' };
var levisStub = { scraper: 'Levis' };
var factory = proxyquire('../../../src/backend/scraper/factory', {
	'./amazon': amazonStub,
	'./backcountry': backcountryStub,
	'./rei': reiStub,
	'./campsaver': campsaverStub,
	'./moosejaw': moosejawStub,
	'./levis': levisStub
});

describe('ScraperFactory', () => {

	describe('unit tests', () => {

		const AMAZON_URL = 'http://www.amazon.com/gp/offer-listing/B00Q7Y3R08';
		const BACKCOUNTRY_URL = 'http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M';
		const REI_URL = 'http://www.rei.com/product/855418/arcteryx-beta-ar-jacket-mens';
		const CAMPSAVER_URL = 'http://www.campsaver.com/beta-ar-jacket-men-s';
		const MOOSEJAW_URL = 'http://www.moosejaw.com/moosejaw/shop/product_Arcteryx-Men-s-Thorium-AR-Jacket_10220021_10208_10000001_-1_';
		const LEVIS_URL = 'http://www.levi.com/us/en_us/mens-jeans/p/045111341';

		describe('getScraper()', () => {

			it('uses AmazonScraper when domain is www.amazon.com', () => {
				let scraper = factory.getScraper(AMAZON_URL);
				expect(scraper).to.equal(amazonStub);
			});

			it('uses BackcountryScraper when domain is www.backcountry.com', () => {
				let scraper = factory.getScraper(BACKCOUNTRY_URL);
				expect(scraper).to.equal(backcountryStub);
			});

			it('uses REIScraper when domain is www.rei.com', () => {
				let scraper = factory.getScraper(REI_URL);
				expect(scraper).to.equal(reiStub);
			});

			it('uses CampSaverScraper when domain is www.campsaver.com', () => {
				let scraper = factory.getScraper(CAMPSAVER_URL);
				expect(scraper).to.equal(campsaverStub);
			});

			it('uses MoosejawScraper when domain is www.moosejaw.com', () => {
				let scraper = factory.getScraper(MOOSEJAW_URL);
				expect(scraper).to.equal(moosejawStub);
			});

			it('uses LevisScraper when domain is www.levi.com', () => {
				let scraper = factory.getScraper(LEVIS_URL);
				expect(scraper).to.equal(levisStub);
			});

		});

	});

});