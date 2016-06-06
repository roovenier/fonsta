var program = require('commander');
var colors = require('colors');

var pe = require('../utils/pretty-error');

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

			console.log('Looking for font '.grey + fontNameRaw.grey + '...'.grey);

			show(fontNameRaw).then(function(result) {
				console.log(result[0].family_name.blue + ' available styles:');
				result.map(function(font) {
					console.log(' • ' + font.style_name);
				});
			}, function(err) {
				console.log(pe.render(err));
			});
		} else {
			console.log(pe.render(new Error('font has not been given'.red)));
		}
	});

program
	.command('install [font]')
	.alias('i')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];
			var fontTypes = (font.indexOf(':') > -1) ? font.split(':').pop().split(',') : ['regular'];

			install(fontNameRaw, fontTypes, program.save);
		} else {
			Object.keys(deps).forEach(function(key) {
				install(key, deps[key], false);
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
		console.log('Error: unknown command was given'.red);
	});

program.parse(process.argv);
