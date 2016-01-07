'use strict';

var expect = require('chai').expect;

var scraper = require('../../../src/backend/scraper/moosejaw');

describe('MoosejawScraper', () => {

	const URL = 'http://www.moosejaw.com/moosejaw/shop/product_Arcteryx-Men-s-Thorium-AR-Jacket_10220021_10208_10000001_-1_';

	describe('unit tests', () => {

		describe('getPrice()', () => {

			it('fails when metadata value not provided', done => {
				scraper.getPrice(URL, undefined).catch(err => {
					done();
				});
			});

		});

	});

	describe('integration tests', () => {

		const AMOUNT = 200;
		const METADATA = { "value": "435033" };

		describe('getPrice()', () => {

			it('returns price above $200', done => {
				scraper.getPrice(URL, METADATA).then(price => {
					expect(price.amount).to.be.above(AMOUNT);
					done();
				});
			});

		});

	});

});