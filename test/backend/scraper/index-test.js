'use strict';

var expect = require('chai').expect;
var _ = require('lodash');

var repository = require('../../../src/backend/repository/products');
var scraper = require('../../../src/backend/scraper');

/*
describe('Scraper', () => {

	describe('integration tests', () => {

		const USER = 'barinov';

		it('can scrape all products for user ' + USER, done => {
			repository.get(USER).then(products => {
				var promises = [];
				var stores = _(products).map(p => p.stores).flattenDeep().value();
				stores.forEach(store => promises.push(scraper.getPrice(store.url, store.metadata)));
				Promise.all(promises).then(prices => {
					var regex = /\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)?/;
					prices.forEach(price => {
						expect(regex.exec(price)).to.exist;
					});
					done();
				});
			});
		});

	});

});
*/