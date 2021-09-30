const babelParser = require('@babel/parser');

module.exports = function(source_code, type_checker = 'typescript') {
	const ast = babelParser.parse(source_code, {
		sourceType: 'module',
		plugins: [
			'asyncGenerators',
			'bigInt',
			'classPrivateMethods',
			'classPrivateProperties',
			'classProperties',
			['decorators', {decoratorsBeforeExport: false}],
			'doExpressions',
			'dynamicImport',
			'exportDefaultFrom',
			'exportNamespaceFrom',
			type_checker,
			'flowComments',
			'functionBind',
			'functionSent',
			'importMeta',
			'jsx',
			'logicalAssignment',
			'nullishCoalescingOperator',
			'numericSeparator',
			'objectRestSpread',
			'optionalCatchBinding',
			'optionalChaining',
			['pipelineOperator', {proposal: 'minimal'}],
			'throwExpressions',
			'ts',
			'@babel/plugin-transform-arrow-functions',
			'@babel/preset-react',
			'@babel/plugin-transform-typescript'
			],
	});

	return JSON.stringify(ast);
}



