var request = require('request');
var Download = require('download');
var fs = require('fs-extra');
var findRemoveSync = require('find-remove');
var colors = require('colors');
var Promise = require('es6-promise').Promise;

var helpers = require('../utils/helpers');
var rimraf = require('../utils/rimraf');
var ff_generator = require('../utils/ff_generator');

module.exports = function(fontNameRaw, fontStyles, flags, isTesting, options) {
	var config = require('../config')(isTesting, options);
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
							var fontStylesRes = [];
							var dirs = helpers.getDirectories(config.tmpDir + '/' + fontName + '/web fonts');

							deps[fontNameRaw] = deps[fontNameRaw] || [];

							var rootPromise = function() {
								return new Promise(function(resolve, reject) {
									if(!dirs || dirs.length == 0) {
										resolve();
									}

									dirsPromise()
										.then(resolve)
										.catch(reject);
								});
							};

							var dirsPromise = function() {
								return new Promise(function(resolve, reject) {
									dirs.reduce(function(prom, item, dirIndex) {
										return prom.then(function() {

											return new Promise(function(resolve2, reject2) {
												stylesPromise(item)
													.then(function() {
														if(dirIndex === dirs.length - 1) {
															resolve();
														}

														resolve2();
													})
													.catch(reject);
											});

										});
									}, Promise.resolve());
								});
							};

							var stylesPromise = function(item) {
								return new Promise(function(resolve, reject) {
									fontStyles.map(function(fontStyleItem, fontStyleIndex) {
										if(!isStyleFound && fontStylesRes.length > 0) {
											isStyleFound = true;
										}

										fontStyleItem = fontStyleItem.toLowerCase();

										if(item.indexOf(fontNameRaw.replace(/[^\w\s]/gi, '') + '_' + fontStyleItem + '_') > -1) {
											var fontStyle = helpers.toTitleCase(item.split('_').slice(0, -1).join(' '));
											var targetPath = config.fontsDir + '/' + fontName + '/' + fontStyle;

											if(!helpers.isFontExists(targetPath)) {
												fontStylesRes.push(fontStyleItem);

												if(deps[fontNameRaw].indexOf(fontStyleItem) === -1) {
													deps[fontNameRaw].push(fontStyleItem);
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

													if(flags.noCss !== true) {
														ff_generator(fontStyle, formatsArr, isTesting, options)
															.then(resolve)
															.catch(reject);
													} else {
														resolve();
													}
												});
											} else {
												isStylesFound = true;
												resultMsg += '\nWarning:'.bgYellow.white + ' ' + fontName.blue + ' with the style '.yellow + fontStyleItem.blue + ' is already exists'.yellow;

												resolve();
											}
										} else {
											resolve();
										}
									});
								});
							};

							Promise.resolve()
								.then(function() {
									return new Promise(function(resolve, reject) {
										rootPromise()
											.then(resolve)
											.catch(reject);
									});
								})
								.then(function() {
									rimraf(config.tmpDir, function(err) {
										if(err) {
											reject(err);
										}
									});

									if(flags.isSave) {
										fs.writeJson(config.deps, deps, function (err) {
											if(err) {
												reject(err);
											}
										});
									}

									if(fontStylesRes.length > 0) {
										resultMsg += '\n' + fontName.blue + ' has been installed with following styles: '.green + fontStylesRes.join(', ').blue;
									} else if(!isStylesFound) {
										reject(new Error('Error:'.bgRed.white + ' ' + fontName.blue + ' font styles'.red + fontStyles.map(function(item) {return ' ' + item}).join(',').blue + ' have not been found'.red));
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
