'use strict';

var expect = require('chai').expect;

var scraper = require('../../../src/backend/scraper/campsaver');

describe('CampSaverScraper', () => {

	const URL = 'http://www.campsaver.com/beta-ar-jacket-men-s';

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
		const METADATA = { value: "219875" };

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