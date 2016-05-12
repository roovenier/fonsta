var install = require('./lib/install');

var actionName = process.argv.slice(2)[0];
var fontNameArg = process.argv.slice(3)[0];
var fontNameRaw = fontNameArg.split(':')[0];
var fontTypes = (fontNameArg.indexOf(':') > -1) ? fontNameArg.split(':').pop().split(',') : ['regular'];

if((actionName === 'install' || actionName === 'i') && fontNameRaw) {
	install(fontNameRaw, fontTypes);
} else {
	console.log('Unknown command given!');
}
