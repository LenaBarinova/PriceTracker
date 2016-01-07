'use strict';

var expect = require('chai').expect;

var scraper = require('../../../src/backend/scraper/amazon');

describe('AmazonScraper', () => {

	describe('integration tests', () => {

		const AMOUNT = 300;
		const URL = 'http://www.amazon.com/gp/offer-listing/B00Q7Y3R08';

		describe('getPrice()', () => {

			it('returns price above $300', done => {
				scraper.getPrice(URL, null).then(price => {
					expect(price.amount).to.be.above(AMOUNT);
					done();
				});
			});

		});

	});

});