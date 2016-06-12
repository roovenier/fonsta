module.exports = function(isTesting) {
	var config = require('./config')(isTesting);
	var deps = {};
	
	try {
		deps = require(config.deps);
	} catch(e) {}

	return deps;
}
