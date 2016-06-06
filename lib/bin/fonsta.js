var program = require('commander');
var colors = require('colors');

var Spinner = require('../utils/spinner');

var install = require('../commands/install');
var show = require('../commands/show');
var uninstall = require('../commands/uninstall');
var deps = require('../deps');

program
	.version('1.0.0')
	.option('-s, --save', 'Save into json file')

program
	.command('show [font]')
	.alias('s')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];

			var spinner = Spinner('Looking for font '.grey + fontNameRaw.grey + ' %s'.grey);
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

			var spinner = Spinner('Looking for font '.grey + fontNameRaw.grey + ' %s'.grey);
			spinner.start();

			install(fontNameRaw, fontTypes, program.save).then(function(result) {
				spinner.stop();
				console.log(result);
			}, function(err) {
				spinner.stop();
				console.log('\n' + err.message);
			});
		} else {
			Object.keys(deps).forEach(function(key) {
				var spinner = Spinner('Installing fonts from dependencies'.grey + ' %s'.grey);
				spinner.start();

				install(key, deps[key], false).then(function(result) {
					spinner.stop();
					console.log(result);
				}, function(err) {
					spinner.stop();
					console.log('\n' + err.message);
				});
			});
		}
	});

program
	.command('uninstall [font]')
	.alias('un')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];
			var fontTypes = (font.indexOf(':') > -1) ? font.split(':').pop().split(',') : [];

			uninstall(fontNameRaw, fontTypes, program.save);
		} else {
			console.log('Error: font was not given'.red);
		}
	});

program
	.command('*')
	.action(function() {
		console.log('Error:'.bgRed.white + ' unknown command has been given'.red);
	});

program.parse(process.argv);
