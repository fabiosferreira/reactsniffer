#!/usr/bin/env node

const filter_react_files = require('./src/filter_react_files');
const detect_smells = require('./src/detect_smells');
const compute_thresholds = require('./src/compute_thresholds');

var dirname = process.cwd() + "/" +process.argv.slice(2);

ast_react_files = filter_react_files(dirname);

output_files = []
all_components = []

for(var [key, value] of Object.entries(ast_react_files)){
	out = {}

	out['File'] = value['url'].substring(value['url'].lastIndexOf('/'));
	out['LOC'] = value['number_of_lines'];
	file_components = detect_smells(value)['components'];
	out['N_Components'] = file_components.length;
	out['N_Functions'] = value['functions'].length;
	out['N_Imports'] = value['imports'].length;

	output_files.push(out);

	for (const component of file_components){
		all_components.push(component);
	}
}

output_components = []

thresholds = compute_thresholds(all_components, output_files);
for (const file of output_files){
	if(file['LOC'] > thresholds['LOC_File'] || file['N_Components'] > file['N_Components'] || 
		file['N_Functions'] > file['N_Functions'] || file['N_Imports'] > file['N_Imports'])
		file['LF'] = 'Y';
	else
		file['LF'] = 'N';
	
}

for (const component of all_components){
	out_component = {}
	out_component['Component'] = component['name'];
	if (component['loc'] > thresholds['LOC_Component'] || component['properties'].length > thresholds['N_props'] ||
		component['classProperties'].length > thresholds['NA'] || 
		(component['classMethods'].length+component['functions'].length) > thresholds['NM'])
		out_component['LC'] = 'Y'
	else
		out_component['LC'] = 'N'

	if (component['properties'].length > thresholds['N_props']){
		out_component['TP'] = 'Y';
	}
	else 
		out_component['TP'] = 'N'

	if (component.hasOwnProperty('superClass')){
		out_component['IIC'] = 'Y';
	}
	else 
		out_component['IIC'] = 'N'

	out_component['PIS'] = component['propsInitialState'];
	out_component['DOM'] = component['dom_manipulation'];
	out_component['JSX'] = component['JSXOutsideRender'].length;
	out_component['FU'] = component['forceUpdate'] + component['reload'];
	out_component['Unc.'] = component['uncontrolled'];
	

	out_component['File'] = component['file'];


	output_components.push(out_component);
}

console.table(output_files);
console.table(output_components);
console.log("Code smells (LC: Large component, TP:Too many props, IIC: Inheritance insteadof Composition; PIS: props in Initial State, DOM: Directly DOM manipulations, JSX: JSX outsider the render method,  FU: Force update, UC: Uncontrolled component, LF: Large file)");
// console.log(thresholds);
// console.log(ast);
// console.log(ast_generator(sourceCode));


//const sourceCode = fs.readFileSync(__dirname + "/" + filename, "utf-8");

//console.log(ast(sourceCode));