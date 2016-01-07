var Promise = require('bluebird');
var scraper = require('../scraper');
var repository = require('../repository/products');

module.exports = {

	on: function (event) {
		return repository.get(event.user, null).then(function (products) {
			var productUpdates = [];
			products.forEach(function (product) {
				var original = JSON.stringify(product);

				var storeUpdates = [];
				product.stores.forEach(function (store) {
					storeUpdates.push(scraper.getPrice(store.url, store.metadata).then(function (price) {
						store.initialPrice = store.initialPrice || price;
						store.latestPrice = price;
					}).catch(function (err) {
						console.log(err);
						return err;
					}));
				});

				productUpdates.push(Promise.all(storeUpdates).then(function () {
					if (JSON.stringify(product) === original) {
						return Promise.resolve();
					} else {
						return repository.save(product).catch(function (err) {
							console.log(err);
							return err;
						});
					}
				}));
			});

			return Promise.all(productUpdates);
		});
	}

};