const babelParser = require('@babel/parser');

module.exports = function(source_code) {
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
			// 'flow',
			'typescript',
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

// console.log(JSON.stringify(ast));


