var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

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

		it('should be an array because given font exists', function() {
			return expect(promiseShow('Roboto')).to.eventually.be.an('array');
		});

		it('should be the error because given font doesn\'t exist', function() {
			return expect(promiseShow('fontisnotexist')).to.eventually.be.an('error');
		});
	});
});
