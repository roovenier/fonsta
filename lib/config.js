var helpers = require('./utils/helpers');

var config = {};
try {
	config = require(helpers.paths.config);
} catch(e) {}

module.exports = function(isTesting) {
	return {
		tmpDir: helpers.rootPath + (config.tmpDir || '/tmp/fonts'),
		fontsDir: (isTesting === false) ? helpers.rootPath + (config.fontsDir || '/assets/fonts') : helpers.rootPath + '/test/assets/fonts',
		cssDir: (isTesting === false) ? helpers.rootPath + (config.cssDir || '/assets/css') : helpers.rootPath + '/test/assets/css',
		cssFile: config.cssFile || 'fonts.css',
		deps: (isTesting === false) ? helpers.rootPath + 'fonsta.deps.json' : helpers.rootPath + '/test/assets/fonsta.deps.json'
	};
};
