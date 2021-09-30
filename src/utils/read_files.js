var fs = require('fs')
var path = require('path');

exports.get_files = function(dirname){
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

exports.get_line = function(filename, line_no) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
 
    if(+line_no > lines.length){
        return null;
    }
 
    return lines[line_no-1].replace(/(^\s+|\s+$)/g, '');
}

exports.get_lines = function(filename, line_start, line_end) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
 
    number_of_lines = line_end - line_start;
    if(+number_of_lines > lines.length){
        return null;
    }
 
    aux_lines = '';
    for (var line_no = line_start; line_no <= line_end; line_no++) {
        aux_lines += lines[line_no-1].replace(/(^\s+|\s+$)/g, '');
    }

    return aux_lines;
}