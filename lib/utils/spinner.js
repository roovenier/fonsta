var Spinner = require('cli-spinner').Spinner;

module.exports = function(spinnerText) {
	var spinner = new Spinner(spinnerText);
	spinner.setSpinnerString('|/-\\');

	return spinner;
};
