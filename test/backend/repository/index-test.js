'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var products = {};

var repository = proxyquire('../../../src/backend/repository', {
	'./products': products
});

describe('Repository', () => {

	var _product = {};
	var _key = { user: 'test' };

	beforeEach(() => {

		_product = {
			user: "test",
			slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium"
		};

		products.get = sinon.stub();
		products.get.returns(Promise.resolve([_product]));

		products.save = sinon.stub();
		products.save.returns(Promise.resolve(_product));

	});

	describe('unit tests', () => {

		describe('get()', () => {

			it('calls context.fail() when products.get() fails', done => {
				products.get.returns(Promise.reject(new Error()));
				repository.get(_key, {
					fail: err => done()
				});
			});

			it('calls context.fail() with correct parameters', done => {
				var error = new Error('products.get()');
				products.get.returns(Promise.reject(error));
				repository.get(_key, {
					fail: err => {
						expect(err).to.deep.equal(error);
						done();
					}
				});
			});

			it('calls context.succeed() when products.get() completes', done => {
				repository.get(_key, {
					succeed: result => done()
				});
			});

			it('calls context.succeed() with correct parameters', done => {
				repository.get(_key, {
					succeed: result => {
						expect(result.length).to.equal(1);
						expect(result[0]).to.deep.equal(_product);
						done();
					}
				});
			});

			it('calls products.get() once', done => {
				repository.get(_key, {
					succeed: result => {
						expect(products.get.calledOnce).to.be.true;
						done();
					}
				});
			});

			it('calls products.get() with correct parameters', done => {
				repository.get(_key, {
					succeed: result => {
						var user = products.get.args[0][0];
						expect(user).to.deep.equal(_key.user);
						done();
					}
				});
			});

		});

		describe('save()', () => {

			it('calls context.fail() when products.save() fails', done => {
				products.save.returns(Promise.reject(new Error()));
				repository.save(_product, {
					fail: err => done()
				});
			});

			it('calls context.fail() with correct parameters', done => {
				var error = new Error('products.get()');
				products.save.returns(Promise.reject(error));
				repository.save(_product, {
					fail: err => {
						expect(err).to.deep.equal(error);
						done();
					}
				});
			});

			it('calls context.succeed() when products.save() completes', done => {
				repository.save(_product, {
					succeed: result => done()
				});
			});

			it('calls context.succeed() with correct parameters', done => {
				repository.save(_product, {
					succeed: result => {
						expect(result).to.deep.equal(_product);
						done();
					}
				});
			});

			it('calls products.save() once', done => {
				repository.save(_product, {
					succeed: result => {
						expect(products.save.calledOnce).to.be.true;
						done();
					}
				});
			});

			it('calls products.save() with correct parameters', done => {
				repository.save(_product, {
					succeed: result => {
						var product = products.save.args[0][0];
						expect(product).to.deep.equal(_product);
						done();
					}
				});
			});

		});

	});

});