'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var realRepository = require('../../../src/backend/repository/products');

var dynamodb = {};
var moment = sinon.stub();
var slug = sinon.stub();

var repository = proxyquire('../../../src/backend/repository/products', {
	'aws-sdk': { DynamoDB: { DocumentClient: function () { return dynamodb; } } },
	'moment': { utc: function () { return { format: moment }; } },
	'slug': slug
});

describe('ProductRepository', () => {

	const USER = 'test';
	const SLUG = 'arcteryx-beta-ar-jacket-mens-phoenix-medium';
  const ADDED = '2015-10-31T21:24:26+00:00';
  const SHOW_PURCHASED = true;
	var _product = {};

	beforeEach(() => {

		_product = {
			user: USER,
			slug: SLUG,
			name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
			imageUrl: "https://s3-us-west-2.amazonaws.com/price-tracker-images/barinov/arcteryx-beta-ar-jacket-mens-phoenix-medium.jpg",
			added: ADDED,
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

		dynamodb.get = sinon.stub();
		dynamodb.query = sinon.stub();
		dynamodb.put = sinon.stub();
		moment.utc = function () {
			return { format: sinon.stub() };
		};
	});

	describe('unit tests', () => {

		describe('get(user)', () => {

			it('fails when no user provided', done => {
				repository.get().catch(err => {
					done();
				});
			});

			it('calls dynamodb.query() once', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER).then(products => {
					expect(dynamodb.query.calledOnce).to.be.true;
					done();
				});
			});

			it('fails when dynamodb.query() fails', done => {
				dynamodb.query.callsArgWith(1, new Error(), { Items: [_product] });
				repository.get(USER).catch(err => {
					done();
				});
			});

			it('calls dynamodb.query() with correct parameters', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER).then(products => {
					var queryParams = dynamodb.query.args[0][0];
					expect(queryParams).to.deep.equal({
						TableName: 'products',
						KeyConditionExpression: '#hashkey = :value',
						ExpressionAttributeNames: { '#hashkey': 'user' },
						ExpressionAttributeValues: { ':value': USER },
						FilterExpression: 'attribute_not_exists(purchase)'
					});
					done();
				});
			});

			it('calls dynamodb.query() with correct parameters given user and showPurchased undefined', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER, undefined, undefined).then(products => {
					var queryParams = dynamodb.query.args[0][0];
					expect(queryParams).to.deep.equal({
						TableName: 'products',
						KeyConditionExpression: '#hashkey = :value',
						ExpressionAttributeNames: { '#hashkey': 'user' },
						ExpressionAttributeValues: { ':value': USER },
						FilterExpression: 'attribute_not_exists(purchase)'
					});
					done();
				});
			});

			it('returns correct products', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER).then(products => {
					expect(products.length).to.equal(1);
					expect(products[0]).to.deep.equal(_product);
					done();
				});
			});

		});

		describe('get(user, slug)', () => {

			it('calls dynamodb.get() once', done => {
				dynamodb.get.callsArgWith(1, null, { Item: _product });
				repository.get(USER, SLUG).then(products => {
					expect(dynamodb.get.calledOnce).to.be.true;
					done();
				});
			});

			it('fails when dynamodb.get() fails', done => {
				dynamodb.get.callsArgWith(1, new Error(), { Item: _product });
				repository.get(USER, SLUG).catch(err => {
					done();
				});
			});

			it('calls dynamodb.get() with correct parameters', done => {
				dynamodb.get.callsArgWith(1, null, { Item: _product });
				repository.get(USER, SLUG).then(product => {
					var getParams = dynamodb.get.args[0][0];
					expect(getParams).to.deep.equal({
						TableName: 'products',
						Key: { user: USER, 'slug': SLUG }
					});
					done();
				});
			});

			it('calls dynamodb.get() with correct parameters showPurchased included', done => {
				dynamodb.get.callsArgWith(1, null, { Item: _product });
				repository.get(USER, SLUG, SHOW_PURCHASED).then(product => {
					var getParams = dynamodb.get.args[0][0];
					expect(getParams).to.deep.equal({
						TableName: 'products',
						Key: { user: USER, 'slug': SLUG }
					});
					done();
				});
			});

			it('returns correct product', done => {
				dynamodb.get.callsArgWith(1, null, { Item: _product });
				repository.get(USER, SLUG).then(product => {
					expect(product).to.deep.equal(_product);
					done();
				});
			});

		});

		describe('get(user, undefined, showPurchased)', () => {

			it('calls dynamodb.query() once', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER, undefined, SHOW_PURCHASED).then(products => {
					expect(dynamodb.query.calledOnce).to.be.true;
					done();
				});
			});

			it('calls dynamodb.query() with correct parameters when !showPurchased', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER, undefined, !SHOW_PURCHASED).then(products => {
					var queryParams = dynamodb.query.args[0][0];
					expect(queryParams).to.deep.equal({
						TableName: 'products',
						KeyConditionExpression: '#hashkey = :value',
						ExpressionAttributeNames: { '#hashkey': 'user' },
						ExpressionAttributeValues: { ':value': USER },
						FilterExpression: 'attribute_not_exists(purchase)'
					});
					done();
				});
			});

			it('calls dynamodb.query() with correct parameters when showPurchased included', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER, undefined, SHOW_PURCHASED).then(products => {
					var queryParams = dynamodb.query.args[0][0];
					expect(queryParams).to.deep.equal({
						TableName: 'products',
						KeyConditionExpression: '#hashkey = :value',
						ExpressionAttributeNames: { '#hashkey': 'user' },
						ExpressionAttributeValues: { ':value': USER }
					});
					done();
				});
			});

			it('returns correct products', done => {
				dynamodb.query.callsArgWith(1, null, { Items: [_product] });
				repository.get(USER, undefined, SHOW_PURCHASED).then(products => {
					expect(products.length).to.equal(1);
					expect(products[0]).to.deep.equal(_product);
					done();
				});
			});

		});

		describe('save()', () => {

			it('fails when no product provided', done => {
				repository.save().catch(err => {
					done();
				});
			});

			it('fails when product without name provided', done => {
				delete _product.name;
				repository.save(_product).catch(err => {
					done();
				});
			});

			it('generates slug if one does not exist', done => {
				delete _product.slug;
				slug.returns(SLUG);
				dynamodb.put.callsArgWith(1, null, { Item: _product });
				repository.save(_product).then(product => {
					expect(slug.calledOnce).to.be.true;
					expect(product.slug).to.equal(SLUG);
					done();
				});
			});

			it('generates added timestamp if one does not exist', done => {
				delete _product.added;
				moment.returns(ADDED);
				dynamodb.put.callsArgWith(1, null, { Item: _product });
				repository.save(_product).then(product => {
					expect(moment.calledOnce).to.be.true;
					expect(product.added).to.equal(ADDED);
					done();
				});
			});
/*
			it('removes initialPrice if it is empty', done => {
				_product.initialPrice = '';
				dynamodb.put.callsArgWith(1, null, { Item: _product });
				repository.save(_product).then(product => {
					expect(_product.initialPrice).to.be.undefined;
					done();
				});
			});

			it('removes latestPrice if it is empty', done => {
				_product.latestPrice = '';
				dynamodb.put.callsArgWith(1, null, { Item: _product });
				repository.save(_product).then(product => {
					expect(_product.latestPrice).to.be.undefined;
					done();
				});
			});
*/
			it('fails when dynamodb.put() fails', done => {
				dynamodb.put.callsArgWith(1, new Error(), { Item: _product });
				repository.save(_product).catch(err => {
					done();
				});
			});

			it('calls dynamodb.put() with correct parameters', done => {
				dynamodb.put.callsArgWith(1, null, { Item: _product });
				repository.save(_product).then(product => {
					var putParams = dynamodb.put.args[0][0];
					expect(putParams).to.deep.equal({
						TableName: 'products',
						Item: _product
					});
					done();
				});
			});

			it('returns correct product', done => {
				dynamodb.put.callsArgWith(1, null, { Item: _product });
				repository.save(_product).then(product => {
					expect(product).to.deep.equal(_product);
					done();
				});
			});

		});

	});

	describe('integration tests', () => {

		describe('get(user)', () => {

			it('returns existing objects', done => {
				realRepository.get(USER).then(products => {
					expect(products.length).to.equal(1);
					done();
				});
			});

		});

		describe('get(user,slug)', () => {

			it('returns existing object', done => {
				realRepository.get(USER, _product.slug).then(product => {
					expect(product).to.deep.equal(_product);
					done();
				});
			});

		});

		describe('get(user,undefined,showPurchased)', () => {

			it('returns existing objects', done => {
				realRepository.get(USER, undefined, SHOW_PURCHASED).then(products => {
					expect(products.length).to.equal(2);
					done();
				});
			});

		});

		describe('get(user,undefined,!showPurchased)', () => {

			it('returns existing objects', done => {
				realRepository.get(USER, undefined, !SHOW_PURCHASED).then(products => {
					expect(products.length).to.equal(1);
					done();
				});
			});

		});

		describe('save()', () => {

			it('persists product', done => {
				realRepository.save(_product).then(product => {
					expect(product).to.deep.equal(_product);
					done();
				});
			});

		});

	});

});