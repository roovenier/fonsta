var request = require('request');
var Download = require('download');
var fs = require('fs-extra');
var css_generator = require("node-font-face-generator");
var findRemoveSync = require('find-remove');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var helpers = require('./helpers');
var config = require(helpers.rootPath + 'fontsta');
config.tmpDir = config.tmpDir || helpers.rootPath + '/tmp/fonts';
config.fontsDir = config.fontsDir || helpers.rootPath + '/assets/fonts';
config.cssDir = config.cssDir || helpers.rootPath + '/assets/css';
config.cssFile = config.cssFile || 'fonts.css';

module.exports = function(fontNameRaw, fontTypes) {
	request('https://www.fontsquirrel.com/api/familyinfo/' + fontNameRaw, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body !== '{}') {
				var fontName = helpers.toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));
				new Download({mode: '755', extract: true})
					.get('http://www.fontsquirrel.com/fontfacekit/' + fontNameRaw)
					.dest(config.tmpDir + '/' + fontName)
					.run(function(err, files) {
						var dirs = helpers.getDirectories(config.tmpDir + '/' + fontName + '/web fonts');
						var fontNameSlug = fontNameRaw.replace(/[^\w\s]/gi, '');
						dirs.map(function(item) {
							fontTypes.map(function(fontTypeItem) {
								if(item.indexOf(fontNameSlug + '_' + fontTypeItem + '_') > -1) {
									var fontType = helpers.toTitleCase(item.split('_').slice(0, -1).join(' '));
									var targetPath = config.fontsDir + '/' + fontName + '/' + fontType;
									if(!helpers.isFontExists(targetPath)) {
										//console.log('/zzzzzzzz');
										fs.move(config.tmpDir + '/' + fontName + '/web fonts/' + item, targetPath, function (err) {
											if (err) return console.error(err)
											console.log("success!")
											findRemoveSync(targetPath, {dir: 'specimen_files', extensions: ['.css', '.html']})
											var files = helpers.getFiles(targetPath);
											//var files = helpers.getFiles(targetPathRel);
											var formatsArr = [];
											files.map(function(file) {
												var path = file.split('/').slice(0, -1).join('/');
												var oldName = file.split('/').pop();
												var ext = oldName.split('-').pop().split('.').pop();
												var newName = helpers.toTitleCase(oldName.split('-').slice(0, -1).join(' ')) + '.' + ext;
												fs.rename(path + '/' + oldName, path + '/' + newName, function(err) {
													if ( err ) console.log('ERROR: ' + err);
												});
												var formatObj = {"url": path.split(helpers.rootPath).pop() + '/' + newName};
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
											var font_config = {};
											font_config[fontType] = {
												"fontFamily": fontType,
												"fontStyle": "normal",
												"fontWeight": "normal",
												"formats": formatsArr,
											};
											var localeToUrlKeys = {
												"en":    "english",   // will match for en, en-US, en-UK, en-CA, ...
												"es":    "spanish",   // will match for es, es-MX, en-AR, en-*
												"fr":     "french",
												"ru":    "russian",
												"ro":    "romanian",
												"bg":    "bulgarian",
												"jp":    "japanese"
											};
											css_generator.setup({
												fonts: font_config,
												localeToUrlKeys: localeToUrlKeys
											});
											var css = css_generator.get_font_css({
												ua: "all",
												locale: "all",
												fonts: [fontType]
											}, function(err, css) {
												if (err) {
													console.log(err);
												} else if (css) {
													mkdirp(config.cssDir, function(err) {
														fs.appendFile(config.cssDir + '/' + config.cssFile, css.substring(css.indexOf('*/') + 3), function (err) {});
													});
												}
											});
										});
									} else {
										console.log('Error! Font ' + fontType + ' is already exists.');
									}
								}
							});
						});
						rimraf(config.tmpDir, {}, function() {});
					});
			}
		}
	});
};
