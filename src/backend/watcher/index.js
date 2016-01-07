var handler = require('./handler');

module.exports = {

	handle: function (event, context) {
		return handler.on({ user: 'barinov' }).then(function (products) {
			context.succeed(products);
		}).catch(function (err) {
			context.fail(err);
		});
	}

};