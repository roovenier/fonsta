var program = require('commander');

var install = require('./lib/commands/install');
var show = require('./lib/commands/show');

program
	.version('0.0.1')
	.option('-s, --save', 'Save to json file')
	.option('i, install [font]', 'Font for installing', '')
	.option('s, show [font]', 'Font for showing', '')
	.parse(process.argv);

if(program.install) {
	var fontNameRaw = program.install.split(':')[0];
	var fontTypes = (program.install.indexOf(':') > -1) ? program.install.split(':').pop().split(',') : ['regular'];
	install(fontNameRaw, fontTypes, program.save);
} else if (program.show) {
	var fontNameRaw = program.show.split(':')[0];
	show(fontNameRaw);
} else {
	console.log('Unknown command given!');
}
