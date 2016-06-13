var mkdirp = require('mkdirp');
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
	var promiseInstall = function(fontNameRaw, fontTypes, isSave, isTesting) {
		return install(fontNameRaw, fontTypes, isSave, isTesting).then(function(result) {
			return result;
		}, function(err) {
			return new Error('Font doesn\'t exist');
		});
	};

	describe('Installing single regular font', function() {
		it('should be the success message because given font exists', function() {
			return expect(promiseInstall('Roboto', ['regular'], false, true)).to.eventually.be.an('string');
		});

		it('should be the success message and font will be saved in deps file because it exists', function() {
			return expect(promiseInstall('pt-sans', ['regular'], true, true)).to.eventually.be.an('string');
		});

		it('should be the error because given font doesn\'t exist', function() {
			return expect(promiseInstall('Fontisnotexist', ['regular'], false, true)).to.eventually.be.an('error');
		});

		it('should be the error because given font is empty', function() {
			return expect(promiseInstall('', [], false, true)).to.eventually.be.an('error');
		});
	});

	describe('Installing font with styles', function() {
		it('should be the success message because given font with styles exists', function() {
			return expect(promiseInstall('Roboto', ['bold', 'italic', 'light'], false, true)).to.eventually.be.an('string');
		});

		it('should be the success message because given font with at least one style exists', function() {
			return expect(promiseInstall('Roboto', ['undefinedstyle', 'medium', 'aaabbbccc', 'light'], true, true)).to.eventually.be.an('string');
		});

		it('should be the error because given font with styles doesn\'t exist', function() {
			return expect(promiseInstall('Roboto', ['undefinedstyle', 'badstyle'], false, true)).to.eventually.be.an('error');
		});

		it('should be the error because given font doesn\'t exist', function() {
			return expect(promiseInstall('Fontisnotexist', ['regular', 'light', 'bold'], false, true)).to.eventually.be.an('error');
		});
	});
});
