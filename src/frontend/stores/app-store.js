(function(){
  "use strict";

	let Dispatcher = require('../dispatcher/dispatcher');
	let ActionTypes = require('../constants/action-types');
	let EventEmitter = require('events').EventEmitter;
	let _ = require('lodash');

	let CHANGE_EVENT = 'change';

	let _products = [];

	let AppStore = Object.assign({}, EventEmitter.prototype, {

		addChangeListener(callback) {
			this.on(CHANGE_EVENT, callback);
		},

		removeChangeListener(callback) {
			this.removeListener(CHANGE_EVENT, callback);
		},

		emitChange() {
			this.emit(CHANGE_EVENT);
		},

		getProducts() {
			return _products;
		}
	});

	let _updateProducts = function(products) {
			_products = products;

			_products.forEach(product => {
				product.stores.forEach(store => {

					store.latestPrice = store.latestPrice || { amount: Number.MAX_VALUE, currency: 'USD' };
					store.initialPrice = store.initialPrice || store.latestPrice;

					store.priceChangeNumeric = store.latestPrice.amount - store.initialPrice.amount;
					store.priceChangePercentage = (store.initialPrice.amount === 0 || store.latestPrice.amount === Number.MAX_VALUE || store.initialPrice.amount === Number.MAX_VALUE || store.priceChangeNumeric === 0) ? 0 : Math.round(store.priceChangeNumeric * 100 / store.initialPrice.amount);
				});

				product.stores = _.sortBy(product.stores, 'latestPrice.amount');
			});
	};

	Dispatcher.register(function(action){

		switch(action.actionType) {
			case ActionTypes.INITIALIZE:
				AppStore.emitChange();
				break;
			case ActionTypes.PRODUCTS_LOADED:
				_updateProducts(action.data.products);
				AppStore.emitChange();
				break;
			default:
		}

	});

	module.exports = AppStore;

})();