'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var sns = {};

var event = proxyquire('../../../src/backend/repository/price', {
	'aws-sdk': { SNS: function () { return sns; } }
});

describe('PriceRepository', () => {

	var _event = {};

	beforeEach(() => {

		_event = {
			product: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
			store: "Amazon",
			price: {
				amount: 548.95,
				currency: "USD"
			}
		};

		sns.publish = sinon.stub();

	});

	describe('unit tests', () => {

		describe('notify()', () => {

			it('does not call sns.publish() when no event provided', done => {
				event.notify().catch(err => {
					expect(sns.publish.called).to.be.false;
					done();
				});
			});

			it('does not call sns.publish() when no product provided', done => {
				delete _event.product;
				event.notify(_event).catch(err => {
					expect(sns.publish.called).to.be.false;
					done();
				});
			});

			it('does not call sns.publish() when no price provided', done => {
				delete _event.price;
				event.notify(_event).catch(err => {
					expect(sns.publish.called).to.be.false;
					done();
				});
			});

			it('does not call sns.publish() when no store provided', done => {
				delete _event.store;
				event.notify(_event).catch(err => {
					expect(sns.publish.called).to.be.false;
					done();
				});
			});

			it('fails when sns.publish() fails', done => {
				sns.publish.callsArgWith(1, new Error());
				event.notify(_event).catch(err => {
					done();
				});
			});

			it('calls sns.publish() once', done => {
				sns.publish.callsArgWith(1);
				event.notify(_event).then(product => {
					expect(sns.publish.calledOnce).to.be.true;
					done();
				});
			});

			it('calls sns.publish() with correct paramenters', done => {
				sns.publish.callsArgWith(1);
				event.notify(_event).then(product => {
					var topicParams = sns.publish.args[0][0];
					expect(topicParams.Subject).to.equal("Price changed for Arc'teryx Beta AR Jacket Men's Phoenix Medium");
					expect(topicParams.Message).to.equal("Price for Arc'teryx Beta AR Jacket Men's Phoenix Medium changed to $548.95 at Amazon");
					done();
				});
			});

		});

	});

});