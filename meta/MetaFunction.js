const JUMP_LINE = '\n';
const FORMAT_CHAR = '\t';

class MetaFunction {
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
		const parametersDep = this.parameters
			.map(parameter => parameter.type.replace(/\[\]/g, ''));
		this.dependencies = new Set(typeParts[0] === 'void' ? parametersDep : [typeParts[0].replace(/\[\]/g, '')].concat(parametersDep));
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

module.exports = MetaFunction;