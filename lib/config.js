var helpers = require('./helpers');

var config = {};
try {
	config = require(helpers.rootPath + 'fontsta.config.json');
} catch(e) {}
exports.tmpDir = config.tmpDir || helpers.rootPath + '/tmp/fonts';
exports.fontsDir = config.fontsDir || helpers.rootPath + '/assets/fonts';
exports.cssDir = config.cssDir || helpers.rootPath + '/assets/css';
exports.cssFile = config.cssFile || 'fonts.css';
