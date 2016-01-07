'use strict';

var expect = require('chai').expect;
var _ = require('lodash');

var appStore = require('../../src/frontend/stores/app-store');
var productActions = require('../../src/frontend/actions/product-actions');

describe('Products for beautiful view', () => {

	var _products = {};

	before(() => {

		_products = [{
			user: 'test',
			slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium",
			name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
			stores: [
				{
					name: "Amazon",
					latestPrice: { amount: 12, currency: 'USD' },
					initialPrice: { amount: 14, currency: 'USD' }
				},
				{
					name: "Levis",
					latestPrice: { amount: 13, currency: 'USD' },
					initialPrice: { amount: 11, currency: 'USD' }
				},
				{
					name: "Backcountry",
					latestPrice: { amount: 130.7, currency: 'USD' },
					initialPrice: { amount: 130.7, currency: 'USD' }
				},
				{
					name: "REI",
					initialPrice: { amount: 14, currency: 'USD' }
				},
				{
					name: "CampSaver",
					latestPrice: { amount: 100, currency: 'USD' }
				},
				{
					name: "Nordstorm"
				}]
		}];

		productActions.updateProducts(_products);

	});

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	it('app store returns expected amount of products', () => {
		expect(appStore.getProducts()).to.have.length(1);
	});

	it('initialPrice.amount exists', () => {
		appStore.getProducts().forEach(product => {
			product.stores.forEach(store => {
				expect(store.initialPrice.amount).to.exist;
			});
		});
	});

	it('initialPrice.amount is a number', () => {
		appStore.getProducts().forEach(product => {
			product.stores.forEach(store => {
				expect(isNumeric(store.initialPrice.amount)).to.equal(true);
			});
		});
	});

	it('latestPrice.amount exists', () => {
		appStore.getProducts().forEach(product => {
			product.stores.forEach(store => {
				expect(store.latestPrice.amount).to.exist;
			});
		});
	});

	it('latestPrice.amuont is a number', () => {
		appStore.getProducts().forEach(product => {
			product.stores.forEach(store => {
				expect(isNumeric(store.latestPrice.amount)).to.equal(true);
			});
		});
	});

	it('stores are sorted by latest price', () => {
		appStore.getProducts().map(product => {
			let latestPrices = _.pluck(product.stores, 'latestPrice.amount');
			expect(latestPrices).to.eql([12, 13, 100, 130.7, Number.MAX_VALUE, Number.MAX_VALUE]);
		});
	});

	it('priceChangeNumeric exists', () => {
		appStore.getProducts().forEach(product => {
			product.stores.forEach(store => {
				expect(store.priceChangeNumeric).to.exist;
			});
		});
	});

	it('priceChangePercentage exists', () => {
		appStore.getProducts().forEach(product => {
			product.stores.forEach(store => {
				expect(store.priceChangePercentage).to.exist;
			});
		});
	});

	it('priceChangeNumeric calculated correctly', () => {
		appStore.getProducts().map(product => {
			let priceChanges = _.pluck(product.stores, 'priceChangeNumeric');
			expect(priceChanges).to.eql([-2, 2, 0, 0, Number.MAX_VALUE, 0]);
		});
	});

	it('priceChangePercentage calculated correctly', () => {
		appStore.getProducts().map(product => {
			let priceChanges = _.pluck(product.stores, 'priceChangePercentage');
			expect(priceChanges).to.eql([-14, 18, 0, 0, 0, 0]);
		});
	});

});