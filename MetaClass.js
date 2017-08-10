const JUMP_LINE = '\n';

class Function {
	constructor() {

	}
}

class MetaClass {
	constructor() {
		this.properties = [];
		this.functions = [];
		this.className = '';
	}

	buildImports() {
		let builder = '';
		return builder;
	}

	buildClass() {
		let builder = '';
		builder += `class ${this.className} {'`;
		builder += JUMP_LINE;
		return builder;
	}

	buildProperties() {
		let builder = '';
		this.properties.forEach(propertie => {
			builder += propertie.name + ',' + JUMP_LINE;
		});
		builder += ';';
		builder += JUMP_LINE;
		return builder;
	}

	buildFunctions() {
		let builder = '';
		funcs.forEach(func => {
			const funcName = func['1']
			const resultType = func['2']
			const params = func['3']

			let strParams = ''
			if (params) {
				params.forEach(param => {
					strParams += param['1'] + ': ' + param['2'] + ', '
				})
				strParams = strParams.substring(0, strParams.length - 2)
			}
			metaClass += '\tstatic ' + funcName + '(' + strParams + '): ' + resultType + ' {\n\t\t//TODO Implement\n\t}\n';
		})
		return builder;
	}

	buildEndClass() {
		let builder = '';
		builder += '};'
		builder += JUMP_LINE;
		builder += `export default ${this.className};`;
		return builder;
	}

	build() {
		let metaClass = '';
		metaClass += buildImports();
		metaClass += buildClass();
		metaClass += buildProperties();
		metaClass += buildFunctions();
		metaClass += buildEndClass();
		return metaClass;
	}
}

export default MetaClass