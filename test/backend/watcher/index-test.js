'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var handler = {};

var watcher = proxyquire('../../../src/backend/watcher', {
	'./handler': handler
});

describe('Watcher', () => {

	var _product = {};

	beforeEach(() => {

		_product = {
			user: "test",
			slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium"
		};

		handler.on = sinon.stub();
		handler.on.returns(Promise.resolve([_product]));

	});

	describe('unit tests', () => {

		describe('handle()', () => {

			it('calls context.fail() when handler.on() fails', done => {
				handler.on.returns(Promise.reject(new Error()));
				watcher.handle(null, {
					fail: err => done()
				});
			});

			it('calls context.fail() with correct parameters', done => {
				var error = new Error('handler.on()');
				handler.on.returns(Promise.reject(error));
				watcher.handle(null, {
					fail: err => {
						expect(err).to.deep.equal(error);
						done();
					}
				});
			});

			it('calls context.succeed() when handler.on() completes', done => {
				watcher.handle(null, {
					succeed: result => done()
				});
			});

			it('calls context.succeed() with correct parameters', done => {
				watcher.handle(null, {
					succeed: result => {
						expect(result.length).to.equal(1);
						expect(result[0]).to.deep.equal(_product);
						done();
					}
				});
			});

			it('calls handler.on() once', done => {
				watcher.handle(null, {
					succeed: result => {
						expect(handler.on.calledOnce).to.be.true;
						done();
					}
				});
			});

			it('calls handler.on() with correct parameters', done => {
				watcher.handle(null, {
					succeed: result => {
						var event = handler.on.args[0][0];
						expect(event).to.deep.equal({ user: 'barinov' });
						done();
					}
				});
			});

		});

	});

});