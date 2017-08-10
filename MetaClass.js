const JUMP_LINE = '\n';
const FORMAT_CHAR = '\t';

class Function {
	constructor() {
		this.name = '';
		this.type = '';
		this.parameters = [];
		this.privacy = '';
	}
}

class Propertie {
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
			builder += FORMAT_CHAR + propertie.name + ',' + JUMP_LINE;
		});
		builder += ';';
		builder += JUMP_LINE;
		return builder;
	}

	buildFunctions() {
		let builder = '';
		this.functions.forEach(func => {
			let parametersBuilder = ''
			if (func.parameters) {
				func.parameters.forEach(parameter => {
					parametersBuilder += `${parameter.name}: ${parameter.type}, `;
				});
				parametersBuilder = parametersBuilder.substring(0, parametersBuilder.length - 2)
			}
			metaClass += `${FORMAT_CHAR}static ${func.name} (${parametersBuilder}): ${func.type} {${JUMP_LINE}`;
			metaClass += `${FORMAT_CHAR}${FORMAT_CHAR}//TODO Implement${JUMP_LINE}`;
			metaClass += `${FORMAT_CHAR}}${JUMP_LINE}`;
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

export default MetaClass;
