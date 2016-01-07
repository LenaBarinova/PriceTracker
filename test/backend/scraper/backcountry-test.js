'use strict';

var expect = require('chai').expect;

var scraper = require('../../../src/backend/scraper/backcountry');

describe('BackcountryScraper', () => {

	describe('integration tests', () => {

		const AMOUNT = 300;
		const URL = 'http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M';

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