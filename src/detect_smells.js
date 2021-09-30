const dom_elements = require('./utils/dom_elements');
const read_files = require('./utils/read_files');

module.exports = function(ast) {
	functions = [];
	components = [];
	imports = [];

	for(var [key, value] of Object.entries(ast['program']['body'])){
		component = {
			'file': ast['url'].substring(ast['url'].lastIndexOf('/')+1),
			'file_url': ast['url'],
			'properties' : [], 
			'forceUpdate' : [],
			'uncontrolled' : [],
			'classProperties' : [],
			'classMethods' : [],
			'JSXOutsideRender' : [],
			'propsInitialState' : [],
			'dom_manipulation' : [],
			'functions': []
		};
		
		recursive_search(value, component,components,functions);
	}

	ast['functions'] = functions;
	// ast['imports'] = imports;
	ast['components'] = components;
	return ast;
}

function get_line(filename, line_no) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
 
    if(+line_no > lines.length){
      	return null;
    }
 
    return lines[line_no-1].replace(/\s/g,'');
}

function check_props_initial_state(item, params){
	aux = false;
	for(var [key, value] of Object.entries(item)){
		if(key == 'type' && item['expression'] && item['expression']['left'] && item['expression']['right']){
			if (item['expression']['left']['property'] && item['expression']['left']['property']['name'] == "state" &&
				item['expression']['right']['properties']){

				for (const prop of item['expression']['right']['properties']) {
					if (prop['value']['object'] && params.includes(prop['value']['object']['name'])){
						aux= true;
					}
				}
			}
		}
	}
	return aux;
}

// function recursive_search(data,match,parent_key,parent_value,component,components,attributes,functions,is_input){
function recursive_search(item,component,components,functions){

	if (!item){
		//return component
		console.log("Null");
	}

	for(var [key, value] of Object.entries(item)){
		
		// check value is null
		if (!value)
			continue;
		else if (key == 'type'){
			// Looking for Class and Function components
			if ((value == "ClassDeclaration" || value == "FunctionDeclaration") && item['id'] && item['id']['name'][0] == item['id']['name'][0].toUpperCase()){
			
				component['type'] = item['type']
				component['name'] = item['id']['name']
				component['char'] = item['end'] - item['start'] + 1
				component['loc'] = item['loc']['end']['line'] - item['loc']['start']['line'] + 1

				if (value == "ClassDeclaration" && item['superClass'] && 'name' in item['superClass'] && 
					item['superClass']['name'] != 'PureComponent' && item['superClass']['name'] != 'Component'){
					component['superClass'] = item['superClass']['name']
				}

				components.push(component);
			} 
			// Looking for ArrowFunctions Components
			else if (value == 'VariableDeclaration' && item['declarations'][0]['init'] && item['declarations'][0]['init']['type'] == 'ArrowFunctionExpression' 
				&& item['declarations'][0]['id']['name'][0] == item['declarations'][0]['id']['name'][0].toUpperCase()){
				
				arrowFunction = item['declarations'][0]['init']
			
				component['type'] = arrowFunction['type']
				component['name'] = item['declarations'][0]['id']['name']
				component['char'] = arrowFunction['end'] - arrowFunction['start'] + 1
				component['loc'] = arrowFunction['loc']['end']['line'] - arrowFunction['loc']['start']['line'] + 1

				components.push(component);
			}
			//Check whether there are functions that are not components neither class methods
			else if ((value == "FunctionDeclaration" || (value == 'VariableDeclaration' && item['declarations'][0]['init'] && item['declarations'][0]['init']['type'] == 'ArrowFunctionExpression'))){
				if (value == "FunctionDeclaration"){
					if (item['id'])
						functionName = item['id']['name'];
					else 
						functionName = "Noname";
				}
				else{
					functionName = item['declarations'][0]['id']['name'];
				}

				if (!('name' in component))
					functions.push(functionName);
				else
					component['functions'].push(functionName);
			}
			else if (value == "ClassProperty"){
				if (item['value'] && item['value']['type'] == 'ArrowFunctionExpression')
					component['classMethods'].push(item['key']['name'])
				else
					component['classProperties'].push(item['key']['name'])
			}
			else if (value == "ClassMethod"){
				// Cheking props in initial state
				if (item['kind'] == 'constructor'){
					params = [];
					for (const param of item['params']) {
						params.push(param['name']);
					}

					for (const expression of item['body']['body']) {
						if (check_props_initial_state(expression,params)){
							propsInitialState = {}
							propsInitialState['line_start'] = expression['loc']['start']['line'];
							propsInitialState['line_end'] = expression['loc']['end']['line'];
							propsInitialState['line'] = read_files.get_lines(component['file_url'],propsInitialState['line_start'],propsInitialState['line_end']);

							component['propsInitialState'].push(propsInitialState);
						}
					}
					

				}
				else if (item['key']['name'] != 'render')
					component['classMethods'].push(item['key']['name']);
			}

			else if (value == "ObjectProperty"){
				if ('name' in item['key']){
					if (!component['properties'].includes(item['key']['name']))
						component['properties'].push(item['key']['name']);
					return;
				}

			}

			// Checking JSX Outside the Render Method
			else if (value == "JSXElement"){
				component['JSXOutsideRender'] = component['classMethods'];
			// Verrifying the number of imports
			}else if (value == "ImportSpecifier" || value == "ImportDefaultSpecifier"){
				imports.push(item['local']['name']);
			}
		}
		else if (key == 'property' && !component['properties'].includes(value['name'])){
			if ((item['object']['name'] && item['object']['name'] == "props") || 
				(item['object']['property'] && item['object']['property']['name'] && item['object']['property']['name'] == "props"))
				component['properties'].push(value['name']);

		}	
		// Check for forceUpdate and directy dom manipulation
		else if (key == 'callee'){
			if (value['property'] && value['property']['name']){
				if (value['property']['name'] == "forceUpdate" || value['property']['name'] == "reload"){ 
					// console.log(component['file_url']);
					// console.log(component['name']);
					
					forceUpdate = {}
					forceUpdate['line_number'] = value['loc']['start']['line'];
					forceUpdate['line'] = read_files.get_line(component['file_url'],forceUpdate['line_number']);
					
					component['forceUpdate'].push(forceUpdate);
				}
				else if (value['object']['name'] && (value['object']['name'] == "document" || value['object']['name'] == "element"))					
					if (dom_elements().includes(value['property']['name'])){
						dom_manipulation = {}
						dom_manipulation['line_number'] = value['loc']['start']['line'];
						dom_manipulation['line'] = read_files.get_line(component['file_url'],dom_manipulation['line_number']);
						
						component['dom_manipulation'].push(dom_manipulation);
					}
			}
		}	
		else if (key == 'name' && value['name'] == 'input'){
			var attr_ref = false;
			var attr_value = false;

			//Check whether the input has attributes
			if (item['attributes']){
				for (var [k, attr] of Object.entries(item['attributes'])){
					if (attr['name'] && attr['name']['type'] == 'JSXIdentifier')
						if (attr['name']['name'] == 'ref')
							attr_ref=true;
						else if (attr['name']['name'] == 'value')
							attr_value=true;
				}

				if (attr_ref && !attr_value){
					uncontrolled = {}
					uncontrolled['line_number'] = value['loc']['start']['line'];
					uncontrolled['line'] = read_files.get_line(component['file_url'],uncontrolled['line_number']);
					
					component['uncontrolled'].push(uncontrolled);
				}
			}
		}
		else if (typeof value === 'object'){
			recursive_search(value,component,components,functions);
		}
		
	}
}