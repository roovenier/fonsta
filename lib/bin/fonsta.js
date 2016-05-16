var program = require('commander');
var colors = require('colors');

var install = require('../commands/install');
var show = require('../commands/show');
var uninstall = require('../commands/uninstall');
var deps = require('../deps');

program
	.version('1.0.0')
	.option('-s, --save', 'Save to json file')

program
	.command('show [font]')
	.alias('s')
	.action(function(font) {
		if(font) {
			var fontNameRaw = font.split(':')[0];

			show(fontNameRaw);
		} else {
			console.log('Error: font is not given'.red);
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
			console.log('Error: font is not given'.red);
		}
	});

program
	.command('*')
	.action(function() {
		console.log('Error: unknown command given'.red);
	});

program.parse(process.argv);
