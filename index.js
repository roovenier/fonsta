var program = require('commander');

var install = require('./lib/commands/install');
var show = require('./lib/commands/show');
var uninstall = require('./lib/commands/uninstall');

program
	.version('0.0.1')
	.option('-s, --save', 'Save to json file')

program
	.command('show [font]')
	.alias('s')
	.action(function(font) {
		var fontNameRaw = font.split(':')[0];
		show(fontNameRaw);
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
			var helpers = require('./lib/helpers');
			var fontstaFonts = require(helpers.rootPath + 'fontsta.json');
			Object.keys(fontstaFonts.dependencies).forEach(function(key) {
				install(key, fontstaFonts.dependencies[key], false);
			});
		}
	});

program
	.command('uninstall [font]')
	.alias('un')
	.action(function(font) {
		var fontNameRaw = font.split(':')[0];
		var fontTypes = (font.indexOf(':') > -1) ? font.split(':').pop().split(',') : [];
		uninstall(fontNameRaw, fontTypes, program.save);
	});

program
	.command('*')
	.action(function() {
		console.log('Unknown command given!');
	});

program.parse(process.argv);
