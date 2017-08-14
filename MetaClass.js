const JUMP_LINE = '\n';
const FORMAT_CHAR = '\t';

class Function {
	constructor({
		name = '',
		type = '',
		parameters = [],
		privacy = ''
	}) {
		this.name = name;
		const typeParts = type.split('.');
		this.type = typeParts[typeParts.length - 1];

		this.parameters = parameters;
		this.dependencies = new Set([typeParts[0]].concat(this.parameters.map(parameter => parameter.split('.')[0])))
		this.privacy = privacy;
	}

	buildParameters() {
		return this.parameters
			.map(parameter => `${parameter.name}: ${parameter.type}`)
			.join(', ');
	}

	build() {
		let builder = '';
		const privacyIfExists = this.privacy ? `${this.privacy} ` : '';
		builder += `${FORMAT_CHAR}${privacyIfExists}${this.name} (${this.buildParameters()}): ${this.type} {${JUMP_LINE}`;
		builder += `${FORMAT_CHAR}${FORMAT_CHAR}//TODO Implement${JUMP_LINE}`;
		builder += `${FORMAT_CHAR}}${JUMP_LINE}`;
		return builder;
	}
}

class Propertie {
	constructor() {

	}
}

class MetaImport {
	constructor(fullObjectPath) {
		this.imports = {};
	}

	addImport(fullObjectPath) {
		const fullObjectPathParts = fullObjectPath.split('.');
		const fromObj = fullObjectPathParts[0];
		const importObj = fullObjectPathParts[1];

		const allImportsFromObject = this.imports[fromObj] || [];
		allImportsFromObject.push(importObj);
		this.imports[fromObj] = allImportsFromObject
	}

	build() {
		return Object
			.keys(this.imports)
			.map((from => `import { ${this.imports[from].join(', ')} } from ${from}`))
			.join(JUMP_LINE)
	}
}

class MetaClass {
	constructor() {
		this.properties = [];
		this.functions = [];
		this.className = '';
		this.imports = new MetaImports();
	}

	buildImports() {
		let builder = '';
		// return this.functions
		// 	.map(func => func.dependencies)
		// 	.reduce((prev, cur) => new Set([...prev, ...cur]), new Set())
		// 	.map(import;
	}

	buildClass() {
		let builder = '';
		builder += `class ${this.className} {`;
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
		return this.functions
			.map(func => func.build())
			.reduce((prev, cur) => {
				return `${prev}${JUMP_LINE}${cur}`;
			}, '');
	}

	buildEndClass() {
		let builder = JUMP_LINE;
		builder += '};'
		builder += JUMP_LINE;
		builder += `export default ${this.className};`;
		return builder;
	}

	build() {
		let metaClass = '';
		metaClass += this.buildImports();
		metaClass += this.buildClass();
		// metaClass += this.buildProperties();
		metaClass += this.buildFunctions();
		metaClass += this.buildEndClass();
		return metaClass;
	}
}

module.exports = {
	MetaClass,
	Function,
	Propertie
}
