var fs = require('fs')
var path = require('path');

module.exports = function(dirname){
    return walk(dirname);
}

var walk = function(dir) {
    var files = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
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
    return files;
}