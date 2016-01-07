var url = require('url');
var amazon = require('./amazon');
var backcountry = require('./backcountry');
var rei = require('./rei');
var campsaver = require('./campsaver');
var moosejaw = require('./moosejaw');
var levis = require('./levis');

module.exports = {

	getScraper: function(uri) {
		var domain = url.parse(uri).hostname;
		switch(domain) {
			case 'www.amazon.com': return amazon;
			case 'www.backcountry.com': return backcountry;
			case 'www.rei.com': return rei;
			case 'www.campsaver.com': return campsaver;
			case 'www.moosejaw.com': return moosejaw;
			case 'www.levi.com': return levis;
			default: throw new Error('Unsupported domain: ' + domain);
		}
	}

};