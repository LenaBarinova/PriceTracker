(function(){
  "use strict";

	let ProductActions = require('../actions/product-actions');

	let Api = {
		getProducts() {
			let products;
			$.getJSON('https://6xnxlvr8v8.execute-api.us-west-2.amazonaws.com/dev/products', function (data) {
				products = data;
				ProductActions.updateProducts(data);
			});
			return products;
		}
	};

	module.exports = Api;
})();