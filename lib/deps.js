var helpers = require('./utils/helpers');

var deps = {};
try {
	deps = require(helpers.paths.deps);
} catch(e) {}

deps.dependencies = deps.dependencies || {};

module.exports = deps;
