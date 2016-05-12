var request = require('request');

module.exports = function(fontNameRaw) {
	request('https://www.fontsquirrel.com/api/familyinfo/' + fontNameRaw, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body !== '{}') {
				body = JSON.parse(body);
				console.log(body[0].family_name + ' available styles:');
				body.map(function(font) {
					console.log(' • ' + font.style_name);
				});
			} else {
				console.log('Sorry, font `' + fontNameRaw + '` doesn\'t exist');
			}
		}
	});
};
