var fs = require('fs-extra');
var colors = require('colors');

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');

var deps = require('../deps');

var removedCounter = 0;
var resultMsg = '';

module.exports = function(fontNameRaw, fontStyles, isSave, isTesting) {
	var config = require('../config')(isTesting);

	return new Promise(function(resolve, reject) {
		var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));
		var targetPath = config.fontsDir + '/' + fontName;

		if(helpers.isFontExists(targetPath)) {
			if(fontStyles.length === 0) {
				if(isSave) {
					delete deps[fontNameRaw];
					fs.writeJson(config.deps, deps, function (err) {});
				}

				rimraf(targetPath, function(e) {
					resolve('\n' + fontName.blue + ' has been removed'.green);
				});
			} else {
				fontStyles.map(function(fontStyle) {
					fontStyle = fontStyle.toLowerCase();
					var fontStyleFull = helpers.toTitleCase(fontName + ' ' + fontStyle);

					if(helpers.isFontExists(targetPath + '/' + fontStyleFull)) {
						removedCounter += 1;

						rimraf(targetPath + '/' + fontStyleFull, function(e) {
							if(helpers.getDirectories(targetPath).length === 0) {
								rimraf(targetPath, function(e) {});
							}
						});

						if(isSave) {
							var index = deps[fontNameRaw].indexOf(fontStyle);
							deps[fontNameRaw].splice(index, 1);

							if(deps[fontNameRaw].length === 0) {
								delete deps[fontNameRaw];
							}
						}

						resultMsg += '\n' + fontName.blue + ' with the style '.green + fontStyle.blue + ' has been removed'.green;
					}
				});

				fs.writeJson(config.deps, deps, function (err) {});

				if(!removedCounter) {
					reject(new Error('Error:'.bgRed.white + ' given font styles have not found'.red));
				}

				resolve(resultMsg);
			}
		} else {
			reject(new Error('Error:'.bgRed.white + ' font '.red + fontNameRaw.blue + ' is not installed'.red));
		}
	});
};
