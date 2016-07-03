var rimraf = require('rimraf');
var fs = require('fs-extra');

module.exports = function (dir, callback) {
	var checkAndRetry = function (e) {
		fs.lstat(dir, function (err, stats) {
			if (err) {
				if (err.code === 'ENOENT') return callback();
				return callback(e);
			}

			fs.chmod(dir, 0777, function(err) {
				if (err) return callback(err);
				rimraf(dir, callback);
			});
		});
	};

	if (process.platform === 'win32') {
		checkAndRetry();
	} else {
		rimraf(dir, checkAndRetry);
	}
};
