const JUMP_LINE = '\n';
const FORMAT_CHAR = '\t';

const MetaImport = require('./MetaImport');
const MetaFunction = require('./MetaFunction');

class MetaClass {
	constructor() {
		this.properties = [];
		this.functions = [];
		this.className = '';
	}

	buildImports() {
		const imports = new MetaImport();
		this.functions
			.map(func => func.dependencies)
			.forEach(deps => deps.forEach(dep  => imports.addImport(dep)))
		let builder = imports.buildImportsSameFolder();
		if (builder) {
			builder += `${JUMP_LINE}${JUMP_LINE}`;
		}
		return builder;
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
		metaClass += this.buildFunctions();
		metaClass += this.buildEndClass();
		return metaClass;
	}
}

module.exports = {
	MetaClass,
	MetaFunction
}
