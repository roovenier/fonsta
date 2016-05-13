var fs = require('fs-extra');
var path = require('path');

exports.rootPath = path.normalize(__dirname + '/../');

exports.getDirectories = function(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
};

exports.getFiles = function(dir, files_) {
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
};

exports.toTitleCase = function(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/\s+/g, '');
};

exports.isFontExists = function(fontPath) {
	try {
		fs.statSync(fontPath);
		return true;
	} catch(err) {
		return !(err && err.code === 'ENOENT');
	}
};

exports.api = {
	show: 'https://www.fontsquirrel.com/api/familyinfo/',
	install: 'http://www.fontsquirrel.com/fontfacekit/'
};

exports.paths = {
	deps: exports.rootPath + 'fonsta.deps.json',
	config: exports.rootPath + 'fonsta.config.json'
};
