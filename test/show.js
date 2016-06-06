var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var show = require('../lib/commands/show');

describe('Show font command', function() {
	describe('Existence of a font', function() {
		var promiseShow = function(fontName) {
			return show(fontName).then(function(arr) {
				return arr;
			}, function(err) {
				return new Error('Font doesn\'t exist');
			});
		};

		it('should be an array because given font is exist', function() {
			var fontName = 'Roboto';
			return expect(promiseShow(fontName)).to.eventually.be.an('array');
		});

		it('should be an error because given font isn\'t exist', function() {
			var fontName = 'fontisnotexist';
			return expect(promiseShow(fontName)).to.eventually.be.an('error');
		});
	});
});
