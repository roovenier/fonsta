var request = require('request');
var Download = require('download');
var fs = require('fs-extra');
var path = require('path');
var css_generator = require("node-font-face-generator");
var findRemoveSync = require('find-remove');

var fontNameArg = process.argv.slice(3)[0];
var fontNameRaw = fontNameArg.split(':')[0];
var fontTypes = (fontNameArg.indexOf(':') > -1) ? fontNameArg.split(':').pop().split(',') : ['regular'];

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/\s+/g, '');
}

if(fontNameRaw) {
	request('https://www.fontsquirrel.com/api/familyinfo/' + fontNameRaw, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body !== '{}') {
				var fontName = toTitleCase(fontNameRaw.split(/[-_]+/).join(' '));
				new Download({mode: '755', extract: true})
					.get('http://www.fontsquirrel.com/fontfacekit/' + fontNameRaw)
					.dest('tmp/' + fontName)
					.run(function(err, files) {
						var dirs = getDirectories('tmp/' + fontName + '/web fonts');
						var fontNameSlug = fontNameRaw.replace(/[^\w\s]/gi, '');
						dirs.map(function(item) {
							fontTypes.map(function(fontTypeItem) {
								if(item.indexOf(fontNameSlug + '_' + fontTypeItem + '_') > -1) {
									var fontType = toTitleCase(item.split('_').slice(0, -1).join(' '));
									var targetPath = 'fonts/' + fontName + '/' + fontType;
									fs.move('tmp/' + fontName + '/web fonts/' + item, targetPath, function (err) {
										if (err) return console.error(err)
										console.log("success!")
										findRemoveSync(targetPath, {dir: 'specimen_files', extensions: ['.css', '.html']})
										var files = getFiles(targetPath);
										var formatsArr = [];
										files.map(function(file) {
											var path = file.split('/').slice(0, -1).join('/');
											var oldName = file.split('/').pop();
											var ext = oldName.split('-').pop().split('.').pop();
											var newName = toTitleCase(oldName.split('-').slice(0, -1).join(' ')) + '.' + ext;
											fs.rename(path + '/' + oldName, path + '/' + newName, function(err) {
												if ( err ) console.log('ERROR: ' + err);
											});
											var formatObj = {"url": path + '/' + newName};
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
												fs.appendFile('frontend/styles/base.css', css.substring(css.indexOf('*/') + 3), function (err) {});
											} else {
												// this should never ever happen
											}
										});
									})
								}
							});
						});
					});
			}
		}
	});
}
