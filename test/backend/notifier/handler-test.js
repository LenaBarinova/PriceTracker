'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var repository = {};

var hander = proxyquire('../../../src/backend/notifier/handler', {
	'../repository/price': repository
});

describe('NotifierHandler', () => {

	var _original = {};
	var _updated = {};
	var _event = {};

	beforeEach(() => {

		_original = {
			name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
			stores: [
				{
					name: "Amazon",
					latestPrice: { amount: 548.95, currency: 'USD' }
				},
				{
					name: "Backcountry",
					latestPrice: { amount: 548.95, currency: 'USD' }
				},
				{
					name: "REI",
					latestPrice: { amount: 548.95, currency: 'USD' }
				}
			]
		};

		_updated = JSON.parse(JSON.stringify(_original));

		_event = {
			updated: _updated,
			original: _original
		};

		repository.notify = sinon.stub();
		repository.notify.returns(Promise.resolve(_event));

	});

	describe('unit tests', () => {

		describe('on()', () => {

			it('fails when no updated product provided', done => {
				hander.on({}).catch(err => done());
			});

			it('succeeds when updated product does not have latestPrice', done => {
				_event.updated.stores = [{ name: "Amazon" }];
				hander.on(_event).then(result => done());
			});

			it('does not call repository.notify() when no original product provided', done => {
				delete _event.original;
				hander.on(_event).then(() => {
					expect(repository.notify.called).to.be.false;
					done();
				});
			});

			it('does not call repository.notify() when updated product same as original', done => {
				_event.updated = _original;
				hander.on(_event).then(() => {
					expect(repository.notify.called).to.be.false;
					done();
				});
			});

			it('does not call repository.notify() when updated price increased', done => {
				_event.updated.stores[1].latestPrice = { amount: 600.00, currency: 'USD' };
				hander.on(_event).then(() => {
					expect(repository.notify.called).to.be.false;
					done();
				});
			});

			it('calls repository.notify() once when price dropped', done => {
				_event.updated.stores[1].latestPrice = { amount: 500.00, currency: 'USD' };
				hander.on(_event).then(() => {
					expect(repository.notify.calledOnce).to.be.true;
					done();
				});
			});

			it('calls repository.notify() with correct parameters', done => {
				_event.updated.stores[1].latestPrice = { amount: 500.00, currency: 'USD' };
				hander.on(_event).then(() => {
					var update = repository.notify.args[0][0];
					expect(update).to.deep.equal({
						product: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
						price: { amount: 500.00, currency: 'USD' },
						store: "Backcountry"
					});
					done();
				});
			});

		});

	});

});