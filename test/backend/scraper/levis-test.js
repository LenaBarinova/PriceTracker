'use strict';

var expect = require('chai').expect;

var scraper = require('../../../src/backend/scraper/levis');

describe('LevisScraper', () => {

	const URL = 'http://www.levi.com/US/en_US/womens-jeans/p/195530010';

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

		const AMOUNT = 30;
		const METADATA = { value: "19553001002632" };

		describe('getPrice()', () => {

			it('returns price above $30', done => {
				scraper.getPrice(URL, METADATA).then(price => {
					expect(price.amount).to.be.above(AMOUNT);
					done();
				});
			});

		});

	});

});