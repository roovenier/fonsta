var PrettyError = require('pretty-error');
var pe = new PrettyError();

pe.appendStyle({
	'pretty-error': {
		marginLeft: 0
	},

	'pretty-error > header': {
		marginTop: 1
	},

	'pretty-error > trace > item': {
		display: 'none'
	},

	'pretty-error > trace > item > footer > addr': {
		display: 'none'
	}
});

module.exports = pe;
