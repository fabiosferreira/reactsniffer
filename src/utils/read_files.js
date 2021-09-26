var fs = require('fs')
var path = require('path');

module.exports = function(dirname){
    return walk(dirname);
}

var walk = function(dir) {
    var files = [];

    if (fs.existsSync(dir)){
        var allFiles = fs.readdirSync(dir);
        allFiles.forEach(function(file) {
            file = path.join(dir, file);
            var stat = fs.statSync(file);
            // Is a directory
            if (stat && stat.isDirectory()) { 
                // Recurse into a subdirectory
                files = files.concat(walk(file));
            } else { 
                // Filtering js files          
                if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx"))
                    files.push(file);
            }
        });
    }else{
        console.log("\x1B[31mNo such file or directory: ", dir);
        process.exit(1);
    }
    return files;
}