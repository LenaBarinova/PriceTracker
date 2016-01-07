module.exports = function (value) {

	if (!value) return null;
	if (value.indexOf('$') === -1) throw new Error('At the moment USD is the only supported currency');
	return {
		amount: Number(value.replace('$', '')),
		currency: 'USD'
	};

};