var request = require('request');
var Download = require('download');
var fs = require('fs-extra');
var findRemoveSync = require('find-remove');
var objectAssign = require('object-assign');
var colors = require('colors');

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');
var ff_generator = require('../utils/ff_generator');

module.exports = function(fontNameRaw, fontTypes, isSave, isTesting) {
	var config = require('../config')(isTesting);
	var deps = require('../deps')(isTesting);

	var isStyleFound = false;
	var isStylesFound = false;
	var resultMsg = '';

	fontNameRaw = fontNameRaw.toLowerCase();

	return new Promise(function(resolve, reject) {
		request(helpers.api.show + fontNameRaw, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if(body !== '{}') {
					var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));

					new Download({mode: '644', extract: true})
						.get(helpers.api.install + fontNameRaw)
						.dest(config.tmpDir + '/' + fontName)
						.run(function(err, files) {
							var fontTypesRes = [];
							var dirs = helpers.getDirectories(config.tmpDir + '/' + fontName + '/web fonts');
							var fontObj = {};
							fontObj[fontNameRaw] = deps[fontNameRaw] || [];
							deps = objectAssign({}, deps, fontObj);

							var installingPromise = function() {
								return new Promise(function(resolve2, reject2) {
									dirs.reduce(function(prom, item, dirIndex) {
										return prom.then(function() {
											return new Promise(function(resolve3, reject3) {
												var fontTypesPromise = new Promise(function(resolve4, reject4) {
													fontTypes.map(function(fontTypeItem, fontTypeIndex) {
														if(!isStyleFound && fontTypesRes.length > 0) {
															isStyleFound = true;
														}

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
																	if (err) reject(err);

																	findRemoveSync(targetPath, {dir: 'specimen_files', extensions: ['.css', '.html']});

																	var files = helpers.getFiles(targetPath);
																	var formatsArr = [];

																	files.map(function(file, fileIndex) {
																		var path = file.split('/').slice(0, -1).join('/');
																		var oldName = file.split('/').pop();
																		var ext = oldName.split('-').pop().split('.').pop();
																		var newName = helpers.toTitleCase(oldName.split('-').slice(0, -1).join(' ')) + '.' + ext;

																		fs.rename(path + '/' + oldName, path + '/' + newName, function(err) {
																			if (err) reject(err);
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

																	ff_generator(fontType, formatsArr, isTesting).then(function() {
																		resolve4();
																	});
																});
															} else {
																isStylesFound = true;
																resultMsg += '\nWarning:'.bgYellow.white + ' ' + fontName.blue + ' with the style '.yellow + fontTypeItem.blue + ' is already exists'.yellow;

																resolve4();
															}
														} else {
															resolve4();
														}
													});
												});

												fontTypesPromise.then(function(r) {
													if(dirIndex === dirs.length - 1) {
														resolve2();
													}
													resolve3();
												});
											});
										});
									}, Promise.resolve());

									if(!dirs || dirs.length == 0) {
										resolve2();
									}
								});
							};

							installingPromise().then(function() {
								rimraf(config.tmpDir, function(e) {});

								if(isSave) {
									fs.writeJson(config.deps, deps, function (err) {});
								}

								if(fontTypesRes.length > 0) {
									resultMsg += '\n' + fontName.blue + ' has been installed with following styles: '.green + fontTypesRes.join(', ').blue;
								} else if(!isStylesFound) {
									reject(new Error('Error:'.bgRed.white + ' ' + fontName.blue + ' font styles'.red + fontTypes.map(function(item) {return ' ' + item}).join(',').blue + ' have not been found'.red));
								}

								setTimeout(function() {
									resolve(resultMsg);
								}, 1000);
							});
						});
				} else {
					reject(new Error('Error:'.bgRed.white + ' font '.red + fontNameRaw.blue + ' doesn\'t exist'.red));
				}
			}
		});
	});
};
