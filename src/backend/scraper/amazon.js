var Promise = require('bluebird');
var page = require('./page');
var money = require('./money');

module.exports = {

	getPrice: function(url, metadata) {
		return page.getContent(url).then(function($) {
			var price = $('.olpOfferPrice').first().text();
			return money(price);
		});
	}

};