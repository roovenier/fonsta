var helpers = require('./utils/helpers');

var config = {};
try {
	config = require(helpers.paths.config);
} catch(e) {}

module.exports = function(isTesting, options) {
	options = options || {};

	return {
		tmpDir: helpers.rootPath + (options.tmpDir || config.tmpDir || '/tmp/fonts'),
		fontsDir: (isTesting === false) ? helpers.rootPath + (options.fontsDir || config.fontsDir || '/assets/fonts') : helpers.rootPath + '/test/assets/fonts',
		cssDir: (isTesting === false) ? helpers.rootPath + (options.cssDir || config.cssDir || '/assets/css') : helpers.rootPath + '/test/assets/css',
		cssFile: options.cssFile || config.cssFile || 'fonts.css',
		deps: (isTesting === false) ? helpers.rootPath + 'fonsta.deps.json' : helpers.rootPath + '/test/assets/fonsta.deps.json'
	};
};
