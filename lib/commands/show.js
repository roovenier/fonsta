var colors = require('colors');
var request = require('request');
var Promise = require('es6-promise').Promise;

var helpers = require('../utils/helpers');

module.exports = function(fontNameRaw) {
	return new Promise(function(resolve, reject) {
		request(helpers.api.show + fontNameRaw, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if(body !== '{}') {
					resolve(JSON.parse(body));
				} else {
					reject(new Error('Error:'.bgRed.white + ' font '.red + fontNameRaw.blue + ' doesn\'t exist'.red));
				}
			}
		});
	});
};
