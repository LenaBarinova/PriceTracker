'use strict';

var expect = require('chai').expect;

var money = require('../../../src/backend/scraper/money');

describe('Money', () => {

	describe('unit tests', () => {

		describe('money()', () => {

			it('returns parsed $300.00', () => {
				expect(money('$300.00')).to.be.deep.equal({ amount: 300.00, currency: 'USD' });
			});

			it('fails when no $ symbol not present', () => {
				expect(() => money('300.00')).to.throw();
			});

		});

	});

});