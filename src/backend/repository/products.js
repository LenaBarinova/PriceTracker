var Promise = require('bluebird');
var AWS = require('aws-sdk');
var moment = require('moment');
var slug = require('slug');

var AWS_REGION = 'us-west-2';
var TABLE_NAME = 'products';

var dynamodb = new AWS.DynamoDB.DocumentClient({ region: AWS_REGION });

module.exports = {

	get: function (user, slug) {
		return new Promise(function (resolve, reject) {
			if (!user || !slug) {
				return reject(new Error('User and slug should be provided'));
			}

			var getParams = {
				TableName: TABLE_NAME,
				Key: { user: user, slug: slug }
			};
			dynamodb.get(getParams, function (err, data) {
				if (err) reject(err);
				else resolve(data.Item);
			});
		});
	},

  list: function (user, showPurchased) {
		return new Promise(function (resolve, reject) {
			if (!user) {
				return reject(new Error('User should be provided'));
			}

			var queryParams = {
				TableName: TABLE_NAME,
				KeyConditionExpression: '#hashkey = :value',
				ExpressionAttributeNames: { '#hashkey': 'user' },
				ExpressionAttributeValues: { ':value': user },
			};
			if (!showPurchased) {
				queryParams.FilterExpression = 'attribute_not_exists(purchase)';
			}
			dynamodb.query(queryParams, function (err, data) {
					if (err) reject(err);
					else resolve(data.Items);
				});
		});
  },

	save: function (product) {
		return new Promise(function (resolve, reject) {
			if (!product || !product.name) {
				return reject(new Error('Product with product name should be provided'));
			}

			product.slug = product.slug || slug(product.name, { lower: true });
			product.added = product.added || moment.utc().format();
/*
			if (!product.initialPrice) delete product.initialPrice;
			if (!product.latestPrice) delete product.latestPrice;
*/
			var putParams = { TableName: TABLE_NAME, Item: product };
			dynamodb.put(putParams, function (err, data) {
				if (err) reject(err);
				else resolve(product);
			});

		});
	}

};