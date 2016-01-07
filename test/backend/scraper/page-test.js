'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var realPage = require('../../../src/backend/scraper/page');

var request = sinon.stub();
var cheerio = { };
var page = proxyquire('../../../src/backend/scraper/page', {
	'request': request,
	'cheerio': cheerio
});

describe('Page', () => {

	const URL = 'http://aws.amazon.com';

	describe('unit tests', () => {

		const BODY = '<body></body>';

		beforeEach(() => {
			cheerio.load = sinon.mock();
		});

		describe('getContent()', () => {

			it('fails when no url provided', done => {
				page.getContent().catch(err => {
					done();
				});
			});

			it('fails when error returned from request', done => {
				request.callsArgWith(1, new Error(), null, BODY);
				page.getContent(URL).catch(err => {
					done();
				});
			});

			it('fails when response status code 500', done => {
				request.callsArgWith(1, null, { statusCode: 500 }, BODY);
				page.getContent(URL).catch(err => {
					done();
				});
			});

			it('succeeds when response status code 200', done => {
				request.callsArgWith(1, null, { statusCode: 200 }, BODY);
				page.getContent(URL).then($ => {
					done();
				});
			});

			it('calls cheerio.load() once', done => {
				var expectation = cheerio.load.once();
				request.callsArgWith(1, null, { statusCode: 200 }, BODY);
				page.getContent(URL).then($ => {
					expectation.verify();
					done();
				});
			});

			it('calls cheerio.load() with body', done => {
				var expectation = cheerio.load.withArgs(BODY);
				request.callsArgWith(1, null, { statusCode: 200 }, BODY);
				page.getContent(URL).then($ => {
					expectation.verify();
					done();
				});
			});

		});

	});

	describe('integration tests', () => {

		describe('getContent()', () => {

			it('returns non-empty page content', done => {
				realPage.getContent(URL).then($ => {
					expect($('body').text()).not.to.be.empty;
					done();
				});
			});

		});

	});

});