var Promise = require('bluebird');
var _ = require('lodash');
var AWS = require('aws-sdk');
var sns = new AWS.SNS();

var TOPIC_ARN = 'arn:aws:sns:us-west-2:405156847191:price-changed';

module.exports = {

	notify: function (event) {
		return new Promise(function (resolve, reject) {
			if (!event || !event.product || !event.price || !event.store) {
				return reject(new Error('Product name, price and store should be provided'));
			}

			var price = event.price.amount.toLocaleString('en-US', { style: 'currency', currency: event.price.currency });
			var topicParams = {
				TopicArn: TOPIC_ARN,
				Subject: 'Price changed for ' + event.product,
				Message: 'Price for ' + event.product + ' changed to ' + price + ' at ' + event.store
			};
			sns.publish(topicParams, function (err) {
				if (err) reject(err);
				else resolve(event);
			});
		});
	}

};