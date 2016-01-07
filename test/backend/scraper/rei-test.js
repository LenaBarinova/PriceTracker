'use strict';

var expect = require('chai').expect;

var scraper = require('../../../src/backend/scraper/rei');

describe('REIScraper', () => {

	const URL = 'http://www.rei.com/product/887388/arcteryx-beta-ar-jacket-womens';

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

		const AMOUNT = 300;
		const METADATA = { value: "8873880006" };

		describe('getPrice()', () => {

			it('returns price above $300', done => {
				scraper.getPrice(URL, METADATA).then(price => {
					expect(price.amount).to.be.above(AMOUNT);
					done();
				});
			});

		});

	});

});