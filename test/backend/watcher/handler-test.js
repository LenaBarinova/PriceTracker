'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var realRepository = require('../../../src/backend/repository/products');

var repository = {};
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var scraper = {};
var repository = {};

var handler = proxyquire('../../../src/backend/watcher/handler', {
	'../scraper': scraper,
	'../repository/products': repository
});

describe('WatcherHandler', () => {

	const USER = 'test';
	const INITIAL_PRICE = { amount: 549.00, currency: 'USD' };
	const LATEST_PRICE = { amount: 548.95, currency: 'USD' };
	const EVENT = { user: USER };

	var _product;

	beforeEach(() => {

		_product = {
			user: USER,
			slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium",
			name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
			imageUrl: "https://s3-us-west-2.amazonaws.com/price-tracker-images/barinov/arcteryx-beta-ar-jacket-mens-phoenix-medium.jpg",
			added: "2015-10-31T21:24:26+00:00",
			stores: [
				{
					name: "Amazon",
					url: "http://www.amazon.com/gp/product/B00Q7Y3R08"
				},
				{
					name: "Backcountry",
					url: "http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M"
				},
				{
					name: "REI",
					url: "http://www.rei.com/product/855418/arcteryx-beta-ar-jacket-mens",
					metadata: {
						value: "8554180057"
					}
				},
				{
					name: "CampSaver",
					url: "http://www.campsaver.com/beta-ar-jacket-men-s",
					metadata: {
						value: "219875"
					}
				}
			]
		};

		scraper.getPrice = sinon.stub();
		scraper.getPrice.returns(Promise.resolve(LATEST_PRICE));

		repository.list = sinon.stub();
		repository.list.returns(Promise.resolve([_product]));

		repository.save = sinon.stub();
		repository.save.returns(Promise.resolve(_product));

	});

	describe('unit tests', () => {

		describe('on()', () => {

			it('returns correct product', done => {
				handler.on(EVENT).then(products => {
					expect(products.length).to.equal(1);
					expect(products[0]).to.equal(_product);
					done();
				});
			});

			it('sets correct latest price', done => {
				handler.on(EVENT).then(products => {
					products[0].stores.forEach(s => {
						expect(s.latestPrice).to.equal(LATEST_PRICE);
					});
					done();
				});
			});

			it('sets correct initial price for new product', done => {
				handler.on(EVENT).then(products => {
					products[0].stores.forEach(s => {
						expect(s.initialPrice).to.equal(LATEST_PRICE);
					});
					done();
				});
			});

			it('does not override initial price for existing product', done => {
				_product.stores.forEach(s => {
					s.initialPrice = INITIAL_PRICE;
				});
				repository.list.returns(Promise.resolve([_product]));
				repository.save.returns(Promise.resolve(_product));

				handler.on(EVENT).then(products => {
					products[0].stores.forEach(s => {
						expect(s.initialPrice).to.equal(INITIAL_PRICE);
					});
					done();
				});
			});

			it('calls repository.list() once', done => {
				handler.on(EVENT).then(products => {
					expect(repository.list.calledOnce).to.be.true;
					done();
				});
			});

			it('calls repository.list() with correct parameters', done => {
				handler.on(EVENT).then(products => {
					var user = repository.list.args[0][0];
					expect(user).to.equal(EVENT.user);
					done();
				});
			});

			it('does not call repository.save() when product same as original', done => {
				_product.stores.forEach(s => {
					s.initialPrice = INITIAL_PRICE;
					s.latestPrice = LATEST_PRICE;
				});
				repository.list.returns(Promise.resolve([_product]));
				repository.save.returns(Promise.resolve(_product));

				handler.on(EVENT).then(products => {
					expect(repository.save.called).to.be.false;
					done();
				});
			});

			it('calls repository.save() once when price updated', done => {
				handler.on(EVENT).then(products => {
					var product = repository.save.args[0][0];
					expect(product).to.deep.equal(_product);
					done();
				});
			});

			it('calls repository.save() with corect parameters', done => {
				handler.on(EVENT).then(products => {
					expect(repository.save.calledOnce).to.be.true;
					done();
				});
			});

		});

	});

});