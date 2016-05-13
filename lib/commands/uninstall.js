var fs = require('fs-extra');
var rimraf = require('rimraf');

var helpers = require('../helpers');
var config = require('../config');
var deps = require('../deps');

module.exports = function(fontNameRaw, fontTypes, isSave) {
	var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));
	var targetPath = config.fontsDir + '/' + fontName;

	if(helpers.isFontExists(targetPath)) {
		if(fontTypes.length === 0) {
			rimraf(targetPath, {}, function() {});
			if(isSave) {
				delete deps.dependencies[fontNameRaw];
				fs.writeJson(helpers.paths.deps, deps, function (err) {});
			}
			console.log(fontName + ' was succefuly removed!');
		} else {
			fontTypes.map(function(fontType) {
				var fontTypeFull = helpers.toTitleCase(fontName + ' ' + fontType);
				rimraf(targetPath + '/' + fontTypeFull, {}, function() {
					if(helpers.getDirectories(targetPath).length === 0) {
						rimraf(targetPath, {}, function() {});
					}
				});
				if(isSave) {
					var index = deps.dependencies[fontNameRaw].indexOf(fontType);
					deps.dependencies[fontNameRaw].splice(index, 1);
					if(deps.dependencies[fontNameRaw].length === 0) {
						delete deps.dependencies[fontNameRaw];
					}
				}
				console.log(fontTypeFull + ' was succefuly removed!');
			});
			fs.writeJson(helpers.paths.deps, deps, function (err) {});
		}
	} else {
		console.log('Sorry, font `' + fontNameRaw + '` doesn\'t installed');
	}
};
