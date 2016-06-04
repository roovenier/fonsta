var fs = require('fs-extra');
var colors = require('colors');

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');

var config = require('../config');
var deps = require('../deps');

var removedCounter = 0;

module.exports = function(fontNameRaw, fontStyles, isSave) {
	console.log('Searching for an installed '.grey + fontNameRaw.grey + ' font...'.grey);

	var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));
	var targetPath = config.fontsDir + '/' + fontName;

	if(helpers.isFontExists(targetPath)) {
		if(fontStyles.length === 0) {
			rimraf(targetPath, function(e) {});

			if(isSave) {
				delete deps[fontNameRaw];
				fs.writeJson(helpers.paths.deps, deps, function (err) {});
			}

			console.log(fontName.blue + ' has been removed'.green);
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

					console.log(fontName.blue + ' with the style '.green + fontStyle.blue + ' has been removed'.green);
				}
			});

			fs.writeJson(helpers.paths.deps, deps, function (err) {});

			if(!removedCounter) {
				console.log('Given font styles was not found'.grey);
			}
		}
	} else {
		console.log('Error: font '.red + fontNameRaw.blue + ' is not installed'.red);
	}
};
