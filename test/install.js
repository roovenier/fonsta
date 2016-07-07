var mkdirp = require('mkdirp');
var objectAssign = require('object-assign');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var install = require('../lib/commands/install');

var rimraf = require('../lib/utils/rimraf');
var helpers = require('../lib/utils/helpers');

beforeEach(function(done) {
	rimraf(helpers.paths.testAssets, function() {
		mkdirp(helpers.paths.testAssets, done);
	});
});

describe('Install font command', function() {
	var promiseInstall = function(fontNameRaw, fontTypes, flags, isTesting) {
		return install(fontNameRaw, fontTypes, flags, isTesting).then(function(result) {
			return result;
		}, function(err) {
			return new Error('Font doesn\'t exist');
		});
	};

	var flags = {
		isSave: false,
		noCss: false
	};

	describe('Installing single regular font', function() {
		it('should be the success message because given font exists', function() {
			var thisFlags = objectAssign({}, flags, {
				noCss: true
			});
			return expect(promiseInstall('Roboto', ['regular'], thisFlags, true)).to.eventually.be.an('string');
		});

		it('should be the success message and font will be saved in deps file because it exists', function() {
			var thisFlags = objectAssign({}, flags, {
				isSave: true
			});
			return expect(promiseInstall('pt-sans', ['regular'], thisFlags, true)).to.eventually.be.an('string');
		});

		it('should be the error because given font doesn\'t exist', function() {
			return expect(promiseInstall('Fontisnotexist', ['regular'], flags, true)).to.eventually.be.an('error');
		});

		it('should be the error because given font is empty', function() {
			return expect(promiseInstall('', [], flags, true)).to.eventually.be.an('error');
		});
	});

	describe('Installing font with styles', function() {
		it('should be the success message because given font with styles exists', function() {
			return expect(promiseInstall('Roboto', ['bold', 'italic', 'light'], flags, true)).to.eventually.be.an('string');
		});

		it('should be the success message because given font with at least one style exists', function() {
			var thisFlags = objectAssign({}, flags, {
				isSave: true,
				noCss: true
			});
			return expect(promiseInstall('Roboto', ['undefinedstyle', 'medium', 'aaabbbccc', 'light'], thisFlags, true)).to.eventually.be.an('string');
		});

		it('should be the error because given font with styles doesn\'t exist', function() {
			return expect(promiseInstall('Roboto', ['undefinedstyle', 'badstyle'], flags, true)).to.eventually.be.an('error');
		});

		it('should be the error because given font doesn\'t exist', function() {
			return expect(promiseInstall('Fontisnotexist', ['regular', 'light', 'bold'], flags, true)).to.eventually.be.an('error');
		});
	});
});
