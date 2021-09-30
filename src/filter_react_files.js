const fs = require('fs');
// const dir = require('node-dir');
const read_files = require('./utils/read_files');
const ast_generator = require('./generate_ast');

module.exports = function(dirname) {
	files = read_files.get_files(dirname);
	
	const react_files = [];
	files.forEach(function(filepath) {
    	sourceCode = fs.readFileSync(filepath, "utf-8");

    	error = false;
    	try {
		    // Generating ast representation of the source code
    		ast = JSON.parse(ast_generator(sourceCode));
		} catch (err) {
		    // handle the error safely
		    error = true;      	
		}
    	
    	if (error){
    		try {
		    	// Generating ast representation of the source code
    			ast = JSON.parse(ast_generator(sourceCode,"flow"));
			} catch (err) {
			    // handle the error safely
			    // console.log("Invalid json passed: ", filepath);        	
			} 
    	}
    	
    	ast['imports'] = [];

		//Filtering react files
		if (ast.hasOwnProperty('program') && ast['program'].hasOwnProperty('body')){

			for(var [key, body] of Object.entries(ast['program']['body'])){
				if (body.hasOwnProperty('specifiers')){
					for(var [key, specifier] of Object.entries(body['specifiers'])){
						if (specifier['type'] == "ImportDefaultSpecifier" && specifier['local']['name'].toLowerCase() == 'react'){								
							ast['url'] = filepath;
							ast['number_of_lines'] = ast['loc']['end']['line'] - ast['loc']['start']['line'] + 1;
						}else if (specifier['type'] == "ImportSpecifier" || specifier['type'] == "ImportDefaultSpecifier"){
							ast['imports'].push(specifier['local']['name']);
						}
					}
				}else if (body.hasOwnProperty('declarations')){
					
					for(var [key, declarations] of Object.entries(body['declarations'])){
						if (declarations['type'] == "VariableDeclarator" && declarations.hasOwnProperty('id') 
							&& declarations['id'].hasOwnProperty('name') && declarations['id']['name'].toLowerCase() == 'react'){
							// var dict = {};
							// dict[filepath] = ast;
							ast['url'] = filepath;
							ast['number_of_lines'] = ast['loc']['end']['line'] - ast['loc']['start']['line'] + 1
						}
					}
				}
			}
			if (ast.hasOwnProperty('url')){
				react_files.push(ast);
			}
		}
	})


	return react_files;
}