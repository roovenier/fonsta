var fs = require('fs-extra');
var colors = require('colors');

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');

var config = require('../config');
var deps = require('../deps');

module.exports = function(fontNameRaw, fontStyles, isSave) {
	console.log('Searching for an installed '.grey + fontNameRaw.grey + ' font...'.grey);

	var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));
	var targetPath = config.fontsDir + '/' + fontName;

	if(helpers.isFontExists(targetPath)) {
		if(fontStyles.length === 0) {
			rimraf(targetPath, function(e) {});

			if(isSave) {
				delete deps.dependencies[fontNameRaw];
				fs.writeJson(helpers.paths.deps, deps, function (err) {});
			}

			console.log(fontName.blue + ' was removed'.green);
		} else {
			fontStyles.map(function(fontStyle) {
				var fontStyleFull = helpers.toTitleCase(fontName + ' ' + fontStyle);

				if(helpers.isFontExists(targetPath + '/' + fontStyleFull)) {
					rimraf(targetPath + '/' + fontStyleFull, function(e) {
						if(helpers.getDirectories(targetPath).length === 0) {
							rimraf(targetPath, function(e) {});
						}
					});

					if(isSave) {
						var index = deps.dependencies[fontNameRaw].indexOf(fontStyle);
						deps.dependencies[fontNameRaw].splice(index, 1);

						if(deps.dependencies[fontNameRaw].length === 0) {
							delete deps.dependencies[fontNameRaw];
						}
					}

					console.log(fontName.blue + ' with style '.green + fontStyle.blue + ' was removed'.green);
				}
			});

			fs.writeJson(helpers.paths.deps, deps, function (err) {});
		}
	} else {
		console.log('Error: font '.red + fontNameRaw.blue + ' doesn\'t installed'.red);
	}
};
