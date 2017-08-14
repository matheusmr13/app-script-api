const JUMP_LINE = '\n';
const FORMAT_CHAR = '\t';

class MetaImport {
	constructor() {
		this.imports = {}
	}

	addImport(fullObjectPath) {
		console.info('full path')
		console.info(fullObjectPath)

		const fullObjectPathParts = fullObjectPath.split('.');
		const fromObj = fullObjectPathParts[0];
		const importObj = fullObjectPathParts[1];

		console.info('IMPORT ', importObj, ' FROM ', fromObj);

		const fromImport = this.imports[fromObj] || {};

		if (importObj) {
			const allImportsFromObject = fromImport.modules || new Set();
			allImportsFromObject.add(importObj);
			fromImport.modules = allImportsFromObject
		} else {
			fromImport.default = true;
		}

		this.imports[fromObj] = fromImport
	}

	buildImportsSameFile() {
		return Object
			.keys(this.imports)
			.map(from => {
				const othersImport = this.imports[from].modules ? `{ ${Array.from(this.imports[from].modules).join(', ')} }` : '';
				const defaultImport = this.imports[from].default ? `${from}` : '';
				const imports = [defaultImport, othersImport].filter(a => a).join(', ')

				return `import ${imports} from '${from}';`
			})
			.join(JUMP_LINE)
	}

	buildImportsSameFolder() {
		return Object
			.keys(this.imports)
			.map(from => {
				let imports = '';

				if (this.imports[from].default) {
					imports += `import ${from} from '${from}';`
				}

				if (this.imports[from].modules) {
					if (this.imports[from].default) {
						imports += JUMP_LINE;
					}
					imports += Array.from(this.imports[from].modules).map(mod => {
						return `import ${mod} from '${from}/${mod}';`
					}).join(JUMP_LINE)
				}

				return imports;
			})
			.join(JUMP_LINE)
	}
}

module.exports = MetaImport;