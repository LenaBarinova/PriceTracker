var Promise = require('bluebird');
var page = require('./page');
var money = require('./money');

module.exports = {

	getPrice: function(url, metadata) {
		return page.getContent(url).then(function($) {
			var price = $('.price-range .price-sale').text() || $('.price-range .price-retail').text() || $('.product-pricing__retail').text();
			return money(price);
		});
	}

};