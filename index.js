var install = require('./lib/install');
var show = require('./lib/show');

var commandName = process.argv.slice(2)[0];
var fontNameArg = process.argv.slice(3)[0];
var fontNameRaw = fontNameArg.split(':')[0];
var fontTypes = (fontNameArg.indexOf(':') > -1) ? fontNameArg.split(':').pop().split(',') : ['regular'];

if((commandName === 'install' || commandName === 'i') && fontNameRaw) {
	install(fontNameRaw, fontTypes);
} else if ((commandName === 'show' || commandName === 's') && fontNameRaw) {
	show(fontNameRaw);
} else {
	console.log('Unknown command given!');
}
