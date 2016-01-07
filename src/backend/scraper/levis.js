var Promise = require('bluebird');
var _ = require('lodash');
var page = require('./page');
var money = require('./money');

module.exports = {

	getPrice: function(url, metadata) {
		if (typeof metadata !== 'object' || !metadata.value) {
			return Promise.reject(new Error('Metadata with value should be provided'));
		}

		return page.getContent(url).then(function($) {
			var regex = new RegExp('"' + metadata.value + '":(.+?amount.+?upc.+?}),');
			var text = $('html').text();
			var product = JSON.parse(regex.exec(text)[1]);
			var price = _(product.price).map(function(p) { return money(p.amount); }).min('amount');
			return product.stock > 0 ? price : null;
		});
	}

};