var Promise = require('bluebird');
var _ = require('lodash');
var repository = require('../repository/price');

module.exports = {

	on: function (event) {
		var updated = event.updated;
		var original = event.original;

		if (!updated || !updated.name || !updated.stores) {
			return Promise.reject(new Error('Product with name and stores should be provided'));
		}

		if (!original || JSON.stringify(updated) === JSON.stringify(original)) {
			return Promise.resolve();
		}

		if (!original.name || !original.stores) {
			return Promise.reject(new Error('Original product with name and stores should be provided'));
		}

		var originalAmount = _(original.stores).map('latestPrice.amount').min();
		var store = _(updated.stores).min('latestPrice.amount');

		if (store.latestPrice && store.latestPrice.amount < originalAmount) {
			return repository.notify({
				product: updated.name,
				price: store.latestPrice,
				store: store.name
			});
		}

		return Promise.resolve();
	}

};