var program = require('commander');
var colors = require('colors');

var install = require('./lib/commands/install');
var show = require('./lib/commands/show');
var uninstall = require('./lib/commands/uninstall');
var deps = require('./lib/deps');

program
	.version('0.0.1')
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
