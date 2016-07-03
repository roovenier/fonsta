var fs = require('fs');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

var install = require('../lib/commands/install');
var uninstall = require('../lib/commands/uninstall');

var rimraf = require('../lib/utils/rimraf');
var helpers = require('../lib/utils/helpers');

beforeEach(function(done) {
	rimraf(helpers.paths.testAssets, function() {
		fs.mkdir(helpers.paths.testAssets, 0744, done);
	});
});

describe('Uninstall font command', function() {
	var promiseUninstall = function(installFont, uninstallFont) {
		this.install = function() {
			return new Promise(function(resolve, reject) {
				install(installFont.font, installFont.fontStyles, false, true).then(function(res) {
					resolve();
				});
			});
		};

		this.uninstall = function() {
			return new Promise(function(resolve, reject) {
				uninstall(uninstallFont.font, uninstallFont.fontStyles, false, true).then(function(res) {
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

	describe('Uninstalling whole font', function() {
		var installFont = {font: 'roboto', fontStyles: ['regular']};

		it('should be the success message because given font exists', function() {
			var uninstallFont = {font: 'roboto', fontStyles: []};
			return expect(promiseUninstall(installFont, uninstallFont)).to.eventually.be.an('string');
		});

		it('should be the error because given font doesn\'t exist', function() {
			var uninstallFont = {font: 'pt-sans', fontStyles: []};
			return expect(promiseUninstall(installFont, uninstallFont)).to.eventually.be.an('error');
		});
	});

	describe('Uninstalling font with styles', function() {
		var installFont = {font: 'roboto', fontStyles: ['regular', 'bold', 'light', 'medium']};

		it('should be the success message because given font with styles exists', function() {
			var uninstallFont = {font: 'roboto', fontStyles: ['regular', 'light', 'medium']};
			return expect(promiseUninstall(installFont, uninstallFont)).to.eventually.be.an('string');
		});

		it('should be the success message because given font with at least one style exists', function() {
			var uninstallFont = {font: 'roboto', fontStyles: ['undefinedstyle', 'light', 'badstyle']};
			return expect(promiseUninstall(installFont, uninstallFont)).to.eventually.be.an('string');
		});

		it('should be the error because given font with styles doesn\'t exist', function() {
			var uninstallFont = {font: 'roboto', fontStyles: ['undefinedstyle', 'badstyle']};
			return expect(promiseUninstall(installFont, uninstallFont)).to.eventually.be.an('error');
		});

		it('should be the error because given font doesn\'t exist', function() {
			var uninstallFont = {font: 'pt-sans', fontStyles: ['regular', 'light', 'medium']};
			return expect(promiseUninstall(installFont, uninstallFont)).to.eventually.be.an('error');
		});
	});
});
