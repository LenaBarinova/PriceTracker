var factory = require('./factory');

module.exports = {
	
	getPrice: function(url, metadata) {
		return factory.getScraper(url).getPrice(url, metadata);
	}
	
};