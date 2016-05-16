var colors = require('colors');
var request = require('request');

var helpers = require('../utils/helpers');

module.exports = function(fontNameRaw) {
	console.log('Looking for font '.grey + fontNameRaw.grey + '...'.grey);

	request(helpers.api.show + fontNameRaw, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body !== '{}') {
				body = JSON.parse(body);

				console.log(body[0].family_name.blue + ' available styles:');

				body.map(function(font) {
					console.log(' • ' + font.style_name);
				});
			} else {
				console.log('Error: font '.red + fontNameRaw.blue + ' doesn\'t exist'.red);
			}
		}
	});
};
