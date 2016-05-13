var helpers = require('./helpers');

var deps = require(helpers.paths.deps);
deps.dependencies = deps.dependencies || {};

module.exports = deps;
