var helpers = require('./helpers');

var deps = require(helpers.rootPath + 'fontsta.deps.json');
deps.dependencies = deps.dependencies || {};

module.exports = deps;
