var helpers = require('./utils/helpers');

var deps = {};
try {
	deps = require(helpers.paths.deps);
} catch(e) {}

module.exports = deps;
