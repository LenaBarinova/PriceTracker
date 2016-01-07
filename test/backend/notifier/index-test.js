'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var handler = {};

var notifier = proxyquire('../../../src/backend/notifier', {
	'./handler': handler
});

describe('Notifier', () => {

	var _original = {};
	var _updated = {};
	var _records = {};
	var _notification = {};

	beforeEach(() => {

		_original = {
			"user": {
        "S": "test"
			},
			"slug": {
        "S": "arcteryx-beta-ar-jacket-mens-phoenix-medium"
			},
			"name": {
        "S": "Arc'teryx Beta AR Jacket Men's Phoenix Medium"
			},
			"added": {
        "S": "2015-10-31T21:24:26+00:00"
			},
			"imageUrl": {
        "S": "https://s3-us-west-2.amazonaws.com/price-tracker-images/barinov/arcteryx-beta-ar-jacket-mens-phoenix-medium.jpg"
			},
			"stores": {
        "L": [
					{
						"M": {
							"initialPrice": {
								"M": {
									"amount": {
										"N": "548.96"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"latestPrice": {
								"M": {
									"amount": {
										"N": "548.95"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"name": {
								"S": "Amazon"
							},
							"url": {
								"S": "http://www.amazon.com/gp/product/B00Q7Y3R08"
							}
						}
					},
					{
						"M": {
							"initialPrice": {
								"M": {
									"amount": {
										"N": "548.95"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"latestPrice": {
								"M": {
									"amount": {
										"N": "548.95"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"name": {
								"S": "Backcountry"
							},
							"url": {
								"S": "http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M"
							}
						}
					},
					{
						"M": {
							"initialPrice": {
								"M": {
									"amount": {
										"N": "549"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"latestPrice": {
								"M": {
									"amount": {
										"N": "549"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"metadata": {
								"M": {
									"value": {
										"S": "8554180057"
									}
								}
							},
							"name": {
								"S": "REI"
							},
							"url": {
								"S": "http://www.rei.com/product/855418/arcteryx-beta-ar-jacket-mens"
							}
						}
					}
        ]
			}
		};

		_updated = {
			"user": {
        "S": "test"
			},
			"slug": {
        "S": "arcteryx-beta-ar-jacket-mens-phoenix-medium"
			},
			"name": {
        "S": "Arc'teryx Beta AR Jacket Men's Phoenix Medium"
			},
			"added": {
        "S": "2015-10-31T21:24:26+00:00"
			},
			"imageUrl": {
        "S": "https://s3-us-west-2.amazonaws.com/price-tracker-images/barinov/arcteryx-beta-ar-jacket-mens-phoenix-medium.jpg"
			},
			"stores": {
        "L": [
					{
						"M": {
							"initialPrice": {
								"M": {
									"amount": {
										"N": "548.96"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"latestPrice": {
								"M": {
									"amount": {
										"N": "548.95"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"name": {
								"S": "Amazon"
							},
							"url": {
								"S": "http://www.amazon.com/gp/product/B00Q7Y3R08"
							}
						}
					},
					{
						"M": {
							"initialPrice": {
								"M": {
									"amount": {
										"N": "548.95"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"latestPrice": {
								"M": {
									"amount": {
										"N": "500"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"name": {
								"S": "Backcountry"
							},
							"url": {
								"S": "http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M"
							}
						}
					},
					{
						"M": {
							"initialPrice": {
								"M": {
									"amount": {
										"N": "549"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"latestPrice": {
								"M": {
									"amount": {
										"N": "549"
									},
									"currency": {
										"S": "USD"
									}
								}
							},
							"metadata": {
								"M": {
									"value": {
										"S": "8554180057"
									}
								}
							},
							"name": {
								"S": "REI"
							},
							"url": {
								"S": "http://www.rei.com/product/855418/arcteryx-beta-ar-jacket-mens"
							}
						}
					}
        ]
			}
		};

		_records = {
			Records: [
				{
					eventID: "1",
					eventName: "INSERT",
					eventVersion: "1.0",
					eventSource: "aws:dynamodb",
					awsRegion: "us-east-1",
					dynamodb: {
						Keys: { user: "test", slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium" },
						NewImage: _updated,
						SequenceNumber: "111",
						SizeBytes: 26,
						StreamViewType: "NEW_AND_OLD_IMAGES"
					},
					eventSourceARN: "stream-ARN"
				},
				{
					eventID: "2",
					eventName: "MODIFY",
					eventVersion: "1.0",
					eventSource: "aws:dynamodb",
					awsRegion: "us-east-1",
					dynamodb: {
						Keys: { user: "test", slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium" },
						NewImage: _updated,
						OldImage: _original,
						SequenceNumber: "222",
						SizeBytes: 59,
						StreamViewType: "NEW_AND_OLD_IMAGES"
					},
					eventSourceARN: "stream-ARN"
				},
				{
					eventID: "3",
					eventName: "REMOVE",
					eventVersion: "1.0",
					eventSource: "aws:dynamodb",
					awsRegion: "us-east-1",
					dynamodb: {
						Keys: { user: "test", slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium" },
						OldImage: _original,
						SequenceNumber: "333",
						SizeBytes: 26,
						StreamViewType: "NEW_AND_OLD_IMAGES"
					},
					eventSourceARN: "stream-ARN"
				}
			]
		};

		_notification = {
			updated: {
				user: "test",
				slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium",
				name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
				added: "2015-10-31T21:24:26+00:00",
				imageUrl: "https://s3-us-west-2.amazonaws.com/price-tracker-images/barinov/arcteryx-beta-ar-jacket-mens-phoenix-medium.jpg",
				stores:
				[
					{
						initialPrice: { amount: 548.96, currency: 'USD' },
						latestPrice: { amount: 548.95, currency: 'USD' },
						name: "Amazon",
						url: "http://www.amazon.com/gp/product/B00Q7Y3R08"
					},
					{
						initialPrice: { amount: 548.95, currency: 'USD' },
						latestPrice: { amount: 500.00, currency: 'USD' },
						name: "Backcountry",
						url: "http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M"
					},
					{
						initialPrice: { amount: 549.00, currency: 'USD' },
						latestPrice: { amount: 549.00, currency: 'USD' },
						metadata: {
							value: "8554180057"
						},
						name: "REI",
						url: "http://www.rei.com/product/855418/arcteryx-beta-ar-jacket-mens"
					}
				]
			},
			original: {
				user: "test",
				slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium",
				name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
				added: "2015-10-31T21:24:26+00:00",
				imageUrl: "https://s3-us-west-2.amazonaws.com/price-tracker-images/barinov/arcteryx-beta-ar-jacket-mens-phoenix-medium.jpg",
				stores:
				[
					{
						initialPrice: { amount: 548.96, currency: 'USD' },
						latestPrice: { amount: 548.95, currency: 'USD' },
						name: "Amazon",
						url: "http://www.amazon.com/gp/product/B00Q7Y3R08"
					},
					{
						initialPrice: { amount: 548.95, currency: 'USD' },
						latestPrice: { amount: 548.95, currency: 'USD' },
						name: "Backcountry",
						url: "http://www.backcountry.com/arcteryx-beta-ar-jacket-mens?skid=ARC3653-PHO-M"
					},
					{
						initialPrice: { amount: 549.00, currency: 'USD' },
						latestPrice: { amount: 549.00, currency: 'USD' },
						metadata: {
							value: "8554180057"
						},
						name: "REI",
						url: "http://www.rei.com/product/855418/arcteryx-beta-ar-jacket-mens"
					}
				]
			}
		};

		handler.on = sinon.stub();
		handler.on.returns(Promise.resolve(_notification));

	});

	describe('unit tests', () => {

		describe('handle()', () => {

			it('calls context.fail() when event is not provided', done => {
				notifier.handle(null, {
					fail: err => done()
				});
			});

			it('calls context.fail() when handler.on() fails', done => {
				handler.on.returns(Promise.reject(new Error()));
				notifier.handle(_records, {
					fail: err => done()
				});
			});

			it('calls context.fail() with correct parameters', done => {
				var error = new Error('handler.on()');
				handler.on.returns(Promise.reject(error));
				notifier.handle(_records, {
					fail: err => {
						expect(err).to.deep.equal(error);
						done();
					}
				});
			});

			it('calls context.succeed() when handler.on() completes', done => {
				notifier.handle(_records, {
					succeed: result => done()
				});
			});

			it('calls context.succeed() with correct parameters', done => {
				notifier.handle(_records, {
					succeed: result => {
						expect(result.length).to.equal(1);
						expect(result[0]).to.deep.equal(_notification);
						done();
					}
				});
			});

			it('calls handler.on() once', done => {
				notifier.handle(_records, {
					succeed: result => {
						expect(handler.on.calledOnce).to.be.true;
						done();
					}
				});
			});

			it('calls handler.on() with correct parameters', done => {
				notifier.handle(_records, {
					succeed: result => {
						var notification = handler.on.args[0][0];
						expect(notification).to.deep.equal(_notification);
						done();
					}
				});
			});

		});

	});

});