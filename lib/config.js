var helpers = require('./utils/helpers');

var config = {};
try {
	config = require(helpers.paths.config);
} catch(e) {}

exports.tmpDir = helpers.rootPath + (config.tmpDir || '/tmp/fonts');
exports.fontsDir = helpers.rootPath + (config.fontsDir || '/assets/fonts');
exports.cssDir = helpers.rootPath + (config.cssDir || '/assets/css');
exports.cssFile = config.cssFile || 'fonts.css';
