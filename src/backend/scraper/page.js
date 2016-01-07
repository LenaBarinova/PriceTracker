var Promise = require('bluebird');
var request = require('request');
var cheerio = require('cheerio');

module.exports = {

	getContent: function (url) {
		return new Promise(function (resolve, reject) {
			if (!url) {
				return reject(new Error('URL should be provided'));
			}

			var options = {
				url: url,
				headers: { 'User-Agent': 'Price Tracker Bot' },
				timeout: 60000
			};

			request(options, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					resolve(cheerio.load(body));
				} else {
					error = error || 'Unexpected status code ' + response.statusCode;
					reject(new Error(url + '. ' + error));
				}
			});
		});
	}

};