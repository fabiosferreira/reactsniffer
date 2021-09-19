const filter_react_files = require('./src/filter_react_files');

var dirname = __dirname + "/" +process.argv.slice(2);

react_files = filter_react_files(dirname);

for(var [key, value] of Object.entries(react_files)){
	console.log(value['url']);
}

