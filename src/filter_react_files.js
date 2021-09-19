const fs = require('fs');
const dir = require('node-dir');
const ast_generator = require('./generate_ast');

module.exports = function(dirname) {
	
	var files = dir.files(dirname, {sync:true});

	const react_files = [];
	files.forEach(function(filepath) {
	    // Filtering js files
	    if (filepath.endsWith(".js") || filepath.endsWith(".jsx") || filepath.endsWith(".ts") || filepath.endsWith(".tsx")){
	    	sourceCode = fs.readFileSync(filepath, "utf-8");

	    	// Generating ast representation of the source code
	    	ast = JSON.parse(ast_generator(sourceCode));

			//Filtering react files
			if (ast.hasOwnProperty('program') && ast['program'].hasOwnProperty('body')){
				for(var [key, body] of Object.entries(ast['program']['body'])){
					if (body.hasOwnProperty('specifiers')){
						for(var [key, specifiers] of Object.entries(body['specifiers'])){
							if (specifiers['type'] == "ImportDefaultSpecifier" && specifiers['local']['name'] == 'React'){								
								var dict = {};
								dict[filepath] = ast;
								ast['url'] = filepath;
								react_files.push(ast);
							}
						}
					}else if (body.hasOwnProperty('declarations')){
						
						for(var [key, declarations] of Object.entries(body['declarations'])){
							if (declarations['type'] == "VariableDeclarator" && declarations.hasOwnProperty('id') 
								&& declarations['id'].hasOwnProperty('name') && declarations['id']['name'] == 'React'){
								var dict = {};
								dict[filepath] = ast;
								ast['url'] = filepath;
								react_files.push(ast);
							}
						}
					}
				}
			}	
		}
	})

	return react_files;
}