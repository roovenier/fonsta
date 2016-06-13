var fs = require('fs-extra');
var colors = require('colors');

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');

module.exports = function(fontNameRaw, fontStyles, isSave, isTesting) {
	var config = require('../config')(isTesting);
	var deps = require('../deps')(isTesting);

	var removedCounter = 0;
	var resultMsg = '';

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
				var uninstallingPromise = new Promise(function(resolve2, reject2) {

					fontStyles.reduce(function(prom, fontStyle, fontStyleIndex) {
						return prom.then(function() {
							return new Promise(function(resolve3, reject3) {
								fontStyle = fontStyle.toLowerCase();
								var fontStyleFull = helpers.toTitleCase(fontName + ' ' + fontStyle);

								if(helpers.isFontExists(targetPath + '/' + fontStyleFull)) {
									removedCounter += 1;

									rimraf(targetPath + '/' + fontStyleFull, function(e) {
										if(helpers.getDirectories(targetPath).length === 0) {
											rimraf(targetPath, function(e) {});
										}

										if(isSave) {
											var index = deps[fontNameRaw].indexOf(fontStyle);
											deps[fontNameRaw].splice(index, 1);

											if(deps[fontNameRaw].length === 0) {
												delete deps[fontNameRaw];
											}
										}

										resultMsg += '\n' + fontName.blue + ' with the style '.green + fontStyle.blue + ' has been removed'.green;

										if(fontStyleIndex === fontStyles.length - 1) {
											resolve2();
										} else {
											resolve3();
										}
									});
								} else {
									if(fontStyleIndex === fontStyles.length - 1) {
										resolve2();
									} else {
										resolve3();
									}
								}
							});
						});
					}, Promise.resolve());
				});

				uninstallingPromise.then(function() {
					fs.writeJson(config.deps, deps, function (err) {});

					if(!removedCounter) {
						reject(new Error('Error:'.bgRed.white + ' given font styles have not found'.red));
					}

					resolve(resultMsg);
				});
			}
		} else {
			reject(new Error('Error:'.bgRed.white + ' font '.red + fontNameRaw.blue + ' is not installed'.red));
		}
	});
};
