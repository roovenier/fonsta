var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

var install = require('../lib/commands/install');
var uninstall = require('../lib/commands/uninstall');

describe('Uninstall font command', function() {
	var promiseUninstall = function() {
		this.install = function() {
			return new Promise(function(resolve, reject) {
				install('roboto', ['regular'], false, true).then(function(res) {
					resolve();
				});
			});
		};
		this.uninstall = function() {
			return new Promise(function(resolve, reject) {
				uninstall('roboto', [], false, true).then(function(res) {
					resolve(res);
				}, function(err) {
					resolve(err);
				});
			});
		};

		return Promise.resolve()
			.then(function() {
				return this.install();
			}.bind(this))
			.then(function() {
				return this.uninstall();
			}.bind(this))
			.then(function(res) {
				return res;
			});
	};

	describe('Uninstall whole font', function() {
		it('should be the success message because given font exists', function() {
			return expect(promiseUninstall()).to.eventually.be.an('string');
		});

		// it('should be the success message and font will be saved in deps file because it exists', function() {
		// 	return expect(promiseInstall('pt-sans', ['regular'], true, true)).to.eventually.be.an('string');
		// });
		//
		// it('should be the error because given font doesn\'t exist', function() {
		// 	return expect(promiseInstall('Fontisnotexist', ['regular'], false, true)).to.eventually.be.an('error');
		// });
		//
		// it('should be the error because given font is empty', function() {
		// 	return expect(promiseInstall('', [], false, true)).to.eventually.be.an('error');
		// });
	});

	// describe('Installing font with styles', function() {
	// 	it('should be the success message because given font with styles exists', function() {
	// 		return expect(promiseInstall('Roboto', ['bold', 'italic', 'light'], false, true)).to.eventually.be.an('string');
	// 	});
	//
	// 	it('should be the success message because given font with at least one style exists', function() {
	// 		return expect(promiseInstall('Roboto', ['undefinedstyle', 'medium', 'aaabbbccc'], true, true)).to.eventually.be.an('string');
	// 	});
	//
	// 	it('should be the error because given font with styles doesn\'t exist', function() {
	// 		return expect(promiseInstall('Roboto', ['undefinedstyle', 'badstyle'], false, true)).to.eventually.be.an('error');
	// 	});
	//
	// 	it('should be the error because given font doesn\'t exist', function() {
	// 		return expect(promiseInstall('Fontisnotexist', ['regular', 'light', 'bold'], false, true)).to.eventually.be.an('error');
	// 	});
	// });
});
