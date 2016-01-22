var products = require('./products');

module.exports = {

	get: function (event, context) {
		return products.get(event.user, event.slug).then(function (products) {
			context.succeed(products);
		}).catch(function (err) {
			context.fail(err);
		});
	},

	list: function (event, context) {
		return products.list(event.user, event.showPurchased).then(function (products) {
			context.succeed(products);
		}).catch(function (err) {
			context.fail(err);
		});
	},

	save: function (event, context) {
		return products.save(event).then(function (product) {
			context.succeed(product);
		}).catch(function (err) {
			context.fail(err);
		});
	}

};