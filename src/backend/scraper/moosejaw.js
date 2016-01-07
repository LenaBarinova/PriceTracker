var Promise = require('bluebird');
var page = require('./page');
var money = require('./money');

module.exports = {

	getPrice: function(url, metadata) {
		if (typeof metadata !== 'object' || !metadata.value) {
			return Promise.reject(new Error('Metadata with value should be provided'));
		}

		return page.getContent(url).then(function($) {
			var regex = new RegExp('itemPriceSkuQuantityList\\[' + metadata.value + '\\] = (?:.+):(?:.+):(.+):(?:.+):(?:.+);');
			var text = $('html').text();
			var price = regex.exec(text)[1];
			return money(price);
		});
	}

};