var Promise = require('bluebird');
var marshaler = require('dynamodb-marshaler');
var handler = require('./handler');

module.exports = {

	handle: function (event, context) {
		if (!event || !event.Records) {
			return context.fail(new Error('Event with records should be provided'));
		}

		var notifications = [];

		event.Records.forEach(function (record) {
			if (record.eventName !== 'MODIFY') return;

			var notification = {
				updated: marshaler.toJS(record.dynamodb.NewImage),
				original: marshaler.toJS(record.dynamodb.OldImage)
			};
			notifications.push(handler.on(notification));
		});

		Promise.all(notifications).then(function(updates) {
			context.succeed(updates);
		}).catch(function(err) {
			context.fail(err);
		});
	}

};