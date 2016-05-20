var request = require('request');
var Download = require('download');
var fs = require('fs-extra');
var findRemoveSync = require('find-remove');
var objectAssign = require('object-assign');
var colors = require('colors');

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');
var ff_generator = require('../utils/ff_generator');

var config = require('../config');
var deps = require('../deps');

module.exports = function(fontNameRaw, fontTypes, isSave) {
	console.log('Looking for font '.grey + fontNameRaw.grey + '...'.grey);

	request(helpers.api.show  + fontNameRaw, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body !== '{}') {
				console.log('Font found. Downloading...'.grey);

				var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));

				new Download({mode: '644', extract: true})
					.get(helpers.api.install + fontNameRaw)
					.dest(config.tmpDir + '/' + fontName)
					.run(function(err, files) {
						console.log('Downloading is complete. Extracting...'.grey);

						var fontTypesRes = [];
						var dirs = helpers.getDirectories(config.tmpDir + '/' + fontName + '/web fonts');
						var fontObj = {};
						fontObj[fontNameRaw] = deps[fontNameRaw] || [];
						deps = objectAssign({}, deps, fontObj);

						dirs.map(function(item) {
							fontTypes.map(function(fontTypeItem) {
								fontTypeItem = fontTypeItem.toLowerCase();

								if(item.indexOf(fontNameRaw.replace(/[^\w\s]/gi, '') + '_' + fontTypeItem + '_') > -1) {
									var fontType = helpers.toTitleCase(item.split('_').slice(0, -1).join(' '));
									var targetPath = config.fontsDir + '/' + fontName + '/' + fontType;

									if(!helpers.isFontExists(targetPath)) {
										fontTypesRes.push(fontTypeItem);

										if(deps[fontNameRaw].indexOf(fontTypeItem) === -1) {
											deps[fontNameRaw].push(fontTypeItem);
										}

										fs.move(config.tmpDir + '/' + fontName + '/web fonts/' + item, targetPath, function (err) {
											if (err) return console.error(err)

											findRemoveSync(targetPath, {dir: 'specimen_files', extensions: ['.css', '.html']});

											var files = helpers.getFiles(targetPath);
											var formatsArr = [];

											files.map(function(file) {
												var path = file.split('/').slice(0, -1).join('/');
												var oldName = file.split('/').pop();
												var ext = oldName.split('-').pop().split('.').pop();
												var newName = helpers.toTitleCase(oldName.split('-').slice(0, -1).join(' ')) + '.' + ext;

												fs.rename(path + '/' + oldName, path + '/' + newName, function(err) {
													if ( err ) console.log('ERROR: ' + err);
												});

												var formatObj = {
													url: path.split(helpers.rootPath).pop() + '/' + newName
												};

												switch(ext) {
													case 'eot':
														formatObj.type = "embedded-opentype";
														formatsArr.push(formatObj);
														break;
													case 'woff':
														formatObj.type = "woff";
														formatsArr.push(formatObj);
														break;
													case 'ttf':
														formatObj.type = "truetype";
														formatsArr.push(formatObj);
														break;
													case 'svg':
														formatObj.type = "svg";
														formatsArr.push(formatObj);
														break;
												}
											});

											ff_generator(fontType, formatsArr);
										});
									} else {
										console.log('Warning: '.yellow + fontName.blue + ' with the style '.yellow + fontTypeItem.blue + ' already exists'.yellow);
									}
								}
							});
						});

						rimraf(config.tmpDir, function(e) {});

						if(isSave) {
							fs.writeJson(helpers.paths.deps, deps, function (err) {});
						}

						if(fontTypesRes.length > 0) {
							console.log(fontName.blue + ' has been installed with the following styles: '.green + fontTypesRes.join(', ').blue);
						} else {
							console.log(fontName.blue + ' font styles '.red + fontTypes.join(', ').blue + ' not found'.red);
						}
					});
			} else {
				console.log('Error: font '.red + fontNameRaw.blue + ' doesn\'t exist'.red);
			}
		}
	});
};
