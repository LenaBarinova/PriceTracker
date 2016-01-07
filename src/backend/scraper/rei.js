var Promise = require('bluebird');
var page = require('./page');
var money = require('./money');

module.exports = {

	getPrice: function(url, metadata) {
		if (typeof metadata !== 'object' || !metadata.value) {
			return Promise.reject(new Error('Metadata with value should be provided'));
		}

		return page.getContent(url).then(function($) {
			var regex = /\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)?/;
			var text = $('#product-sku-select option[value="' + metadata.value + '"]').text();
			var price = regex.exec(text)[0];
			return money(price);
		});
	}

};