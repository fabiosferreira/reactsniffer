var dir = require('node-dir');

// var files = dir.files(__dirname, {sync:true});
// console.log(files);

// const fs = require('fs');

var dirname = __dirname + "/" +process.argv.slice(2);

var files = dir.files(dirname, {sync:true});
console.log(files);

dir.files(dirname, function(err, files) {
  if (err) throw err;
  
  files.forEach(function(filepath) {
    // actionOnFile(null, filepath);
    if (filepath.endsWith(".js") || filepath.endsWith(".jsx") || filepath.endsWith(".ts") || filepath.endsWith(".tsx")){
    	console.log(filepath);
    }
  })
});