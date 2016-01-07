'use strict';

var Promise = require('bluebird');

module.exports = function () {
	
	var fn = function (resolve, reject) {
		fn._resolve = resolve;
		fn._reject = reject;
	};

	fn.succeed = function (result) {
		this._resolve(result);
	};

	fn.fail = function (err) {
		this._reject(err);
	};
	
	return {
		succeed: function(result) {
			fn.succeed(result);
		},
		fail: function(err) {
			fn.fail(err);
		},
		done: function(err, result) {
			if (err) this.fail(err);
			else this.succeed(result);
		},
		promise: new Promise(fn)
	};
	
};