var program = require('commander');
var colors = require('colors');
var Promise = require('es6-promise').Promise;

var Spinner = require('../utils/spinner');

var Spinner = require('../utils/spinner');

var install = require('../commands/install');
var show = require('../commands/show');
var uninstall = require('../commands/uninstall');
var deps = require('../deps')(false);

program
	.version('1.0.0')
	.option('-s, --save', 'Save into json file')

program
	.command('show [font]')
	.alias('s')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];

			var spinner = Spinner('Looking for font '.grey + fontNameRaw.grey + ' %s '.grey);
			spinner.start();

			show(fontNameRaw).then(function(result) {
				spinner.stop();
				console.log('\n' + result[0].family_name.blue + ' available styles:');

				result.map(function(font) {
					console.log(' • ' + font.style_name);
				});
			}, function(err) {
				spinner.stop();
				console.log('\n' + err.message);
			});
		} else {
			console.log('Error:'.bgRed.white + ' font has not been given'.red);
		}
	});

program
	.command('install [font]')
	.alias('i')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];
			var fontTypes = (font.indexOf(':') > -1) ? font.split(':').pop().split(',') : ['regular'];

			var spinner = Spinner('Looking for font '.grey + fontNameRaw.grey + ' %s '.grey);
			spinner.start();

			install(fontNameRaw, fontTypes, program.save, false).then(function(result) {
				spinner.stop();
				console.log(result);
			}, function(err) {
				spinner.stop();
				console.log('\n' + err.message);
			});
		} else {
			Object.keys(deps).reduce(function(prom, font, fontIndex) {
				return prom.then(function() {
					return new Promise(function(resolve, reject) {
						var spinner = Spinner('Installing font '.grey + font + ' from dependencies'.grey + ' %s '.grey);
						spinner.start();

						install(font, deps[font], false, false).then(function(result) {
							spinner.stop();
							console.log(result);
							resolve();
						}, function(err) {
							spinner.stop();
							console.log('\n' + err.message);
							resolve();
						});
					});
				});
			}, Promise.resolve());
		}
	});

program
	.command('uninstall [font]')
	.alias('un')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];
			var fontTypes = (font.indexOf(':') > -1) ? font.split(':').pop().split(',') : [];

			var spinner = Spinner('Searching for an installed '.grey + fontNameRaw.grey + ' font'.grey + ' %s '.grey);
			spinner.start();

			setTimeout(function() {
				uninstall(fontNameRaw, fontTypes, program.save, false).then(function(result) {
					spinner.stop();
					console.log(result);
				}, function(err) {
					spinner.stop();
					console.log('\n' + err.message);
				});
			}, 1000);
		} else {
			console.log('Error:'.bgRed.white + ' font has not been given'.red);
		}
	});

program
	.command('*')
	.action(function() {
		console.log('Error:'.bgRed.white + ' unknown command has been given'.red);
	});

program.parse(process.argv);
