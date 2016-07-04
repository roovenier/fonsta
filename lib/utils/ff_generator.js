var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var css_generator = require("node-font-face-generator");

module.exports = function(fontType, formatsArr, isTesting) {
	var config = require('../config')(isTesting);

	return new Promise(function(resolve, reject) {
		var fontConfig = {};

		fontConfig[fontType] = {
			fontFamily: fontType,
			fontStyle: 'normal',
			fontWeight: 'normal',
			formats: formatsArr,
		};

		var localeToUrlKeys = {
			en: 'english',
			es: 'spanish',
			fr: 'french',
			ru: 'russian',
			ro: 'romanian',
			bg: 'bulgarian',
			jp: 'japanese'
		};

		css_generator.setup({
			fonts: fontConfig,
			localeToUrlKeys: localeToUrlKeys
		});

		var css = css_generator.get_font_css({
			ua: 'all',
			locale: 'all',
			fonts: [fontType]
		}, function(err, css) {
			if (err) {
				reject(err);
			} else if (css) {
				mkdirp(config.cssDir, function(err) {
					if(err) {
						reject(err);
					}

					fs.appendFile(config.cssDir + '/' + config.cssFile, css.substring(css.indexOf('*/') + 3), resolve);
				});
			}
		});
	});
}
