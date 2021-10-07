#!/usr/bin/env node

const filter_react_files = require('./src/filter_react_files');
const detect_smells = require('./src/detect_smells');
const compute_thresholds = require('./src/thresholds');
const csvWriter = require('./src/utils/csv-writer');

var dirname = process.argv.slice(2)[0];

if (!dirname.startsWith('/'))
	dirname = process.cwd() + "/" +process.argv.slice(2);

ast_react_files = filter_react_files(dirname);

all_files = []
all_components = []

for(var [key, value] of Object.entries(ast_react_files)){
	out = {}
	out['id'] = Number(key)+1;
	out['Large File'] = 'N';
	out['File URL'] = value['url'];
	out['File'] = value['url'].substring(value['url'].lastIndexOf('/')+1);
	out['LOC'] = value['number_of_lines'];
	file_components = detect_smells(value)['components'];
	out['N_Components'] = file_components.length;
	out['N_Functions'] = value['functions'].length;
	out['N_Imports'] = value['imports'].length;

	all_files.push(out);

	for (const component of file_components){
		all_components.push(component);
	}
}

const question = "Em uma escala de 1 a 5, como você avalia a severidade desse smell?"+
	"\n1 = smell não é importante e, provavelmente, não será eliminado"+
	"\n5 = smell é muito importante e, provavelmente, será eliminado em breve.";

output_components = []
output_files = []
csv_smells = []

// thresholds = compute_thresholds.compute(all_components, all_files);
thresholds = compute_thresholds.get_empirical_thresholds();

var cont_smells_files = 0; 
for (const file of all_files){
	if(file['LOC'] > thresholds['LOC_File'] || file['N_Components'] > thresholds['N_Components'] || 
		file['N_Functions'] > thresholds['N_Functions'] || file['N_Imports'] > thresholds['N_Imports']){

		file['id'] = ++cont_smells_files;
		file['Large File'] = file['File'];
		delete file['File'];

		file[question] = '';
		file['Observação'] = '';
		output_files.push(file);
	}
}

cont_smells = 0;

function createSmell(file_name, component, smell_name, details){
	smell = {}
	smell['id'] = ++cont_smells;
	smell['file'] = file_name;
	smell['Component'] = component;
	smell['Smell'] = smell_name;
	smell['Details'] = details;

	smell[question] = '';
	smell['Observação'] = '';

	return smell;
}

var number_of_smell_components = 0;
for (const [key,component] of Object.entries(all_components)){
	has_smells = false;

	out_component = {}
	out_component['id'] = number_of_smell_components+1;
	out_component['File'] = component['file'];
	out_component['Component'] = component['name'];
	

	classMethods = component['classMethods'].length+component['functions'].length;
	if (component['loc'] > thresholds['LOC_Component'] || component['properties'].length > thresholds['N_props'] ||
		component['classProperties'].length > thresholds['NA'] || 
		(classMethods) > thresholds['NM']){
		has_smells = true;
		details = "LOC: "+component['loc']+ "; Number of props: "+component['properties'].length+ 
			"; Number of attributes: "+component['classProperties'].length +
			"; Number of methods: "+classMethods;
		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Large Component", details));
		out_component['LC'] = 'Y';		
	}else
		out_component['LC'] = 'N'

	if (component['properties'].length > thresholds['N_props']){
		has_smells = true;
		details = "Number of props: "+component['properties'].length+"; Props: "+component['properties'];
		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Too many props", details));
		out_component['TP'] = 'Y';
	}
	else 
		out_component['TP'] = 'N'

	if (component.hasOwnProperty('superClass')){
		has_smells = true;
		details = "SuperClass: "+component['superClass'];
		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Inheritance instead of composition", details));
		out_component['IIC'] = 'Y';
	}
	else 
		out_component['IIC'] = 'N'

	if (component['forceUpdate'].length > 0){
		has_smells = true;
		details = '';
		for(var forceUpdate of component['forceUpdate'])
			details += "Line "+forceUpdate['line_number']+": "+forceUpdate['line']+"\n";
		// details = "Line "+component['forceUpdate']['line_number']+": "+component['forceUpdate']['line'];
		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Force Update", details));
		out_component['FU'] = component['forceUpdate'].length;
	}
	else
		out_component['FU'] = 0;

	if (component['dom_manipulation'].length > 0){
		has_smells = true;
		details = '';
		for(var dom_manipulation of component['dom_manipulation'])
			details += "Line "+dom_manipulation['line_number']+": "+dom_manipulation['line']+"\n";
		// details = "Line "+component['dom_manipulation']['line_number']+": "+component['dom_manipulation']['line'];
		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Direct DOM Manipulation", details));
		out_component['DOM'] = component['dom_manipulation'].length;
	}
	else 
		out_component['DOM'] = 0;

	out_component['JSX'] = component['JSXOutsideRender'].length;
	if (out_component['JSX'] > thresholds['NM_JSX']){
		has_smells = true;
		details = "Methods with JSX: "+component['JSXOutsideRender'];
		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"JSX outside the render method", details));
	}

	if (component['uncontrolled'].length > 0){
		has_smells = true;
		details = '';
		for(var uncontrolled of component['uncontrolled'])
			details += "Line "+uncontrolled['line_number']+": "+uncontrolled['line']+"\n";

		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Uncontrolled component", details));
		out_component['Unc.'] = component['uncontrolled'].length;
	}
	else 
		out_component['Unc.'] = 0;

	if (component['propsInitialState'].length > 0){
		has_smells = true;
		details = '';
		for(var propsInitialState of component['propsInitialState'])
			details += "Lines "+propsInitialState['line_start']+" - "+propsInitialState['line_end']+": \n"+propsInitialState['line'];

		csv_smells.push(createSmell(component['file_url'],out_component['Component'],"Props in initial state", details));
		out_component['PIS'] = component['propsInitialState'].length;
	}
	else 
		out_component['PIS'] = 0;


	if (has_smells){
		number_of_smell_components++;
		output_components.push(out_component);
	}	
}

if (output_files.length > 0){
	const output_files_t = output_files.reduce((out, {id, ...x}) => { out[id] = x; return out}, {});
	console.table(output_files_t,['id', 'Large File', 'LOC', 'N_Components', 'N_Functions', 'N_Imports']);
	csvWriter('files_smells.csv', output_files,Object.keys(output_files[0]),"files");
}else
	console.log("There are no Large Files!");


if (output_components.length > 0){
	const output_components_t = output_components.reduce((out, {id, ...x}) => { out[id] = x; return out}, {});
	console.table(output_components_t);

	console.log("Code smells (LC: Large component, TP:Too many props, IIC: Inheritance insteadof Composition; PIS: props in Initial State; DOM: Directly DOM manipulations; JSX: JSX outside the render method; FU: Force update; UC: Uncontrolled component)\n");

	csvWriter('components_smells.csv', csv_smells,Object.keys(csv_smells[0]),"components");
}else
	console.log("There are no components with smells");


