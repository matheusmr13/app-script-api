const fs = require('fs');
const axios = require('axios');
const MetaClass = require('./MetaClass');

const API_JSON_DIR = 'api-json'
const CLASSES_DIR = 'classes'


const processRoot = (obj) => {
	return new Promise((resolve, reject) => {
		const mainObject = obj['1']
		const name = mainObject['1']
		const dirToSave = CLASSES_DIR + '/' + name;
		setupDir(dirToSave);

		processObj(mainObject);

		const props = obj['2']
		props.forEach(item => {
			processObj(item, name)
		});
	});
}

const processObj = (obj, treeName) => {
	return new Promise((resolve, reject) => {
		if (!obj) {
			resolve();
			return;
		}

		const fullName = obj['1'];
		const name = fullName.indexOf('.') > -1 ? obj['1'].split('.')[1] : obj['1'];
		const dirToSave = CLASSES_DIR + '/' + treeName;
		const filePath = dirToSave + '/' + (!treeName ? 'index.js' : name + '.js' )
		let metaClass = 'class ' + name + ' {\n';

		const props = obj['2']
		const funcs = obj['3']
		if (!treeName && props && Array.isArray(props)) {
			props.forEach(item => {
				const propName = item['1']
				metaClass += '\n' + propName + ','
			});
			metaClass += ';\n';
		}

		if (funcs && Array.isArray(funcs)) {
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
		}

		metaClass += '};\n\nexport default ' + name + ';';

		fs.writeFile(filePath, metaClass, function(err) {
			console.log('+->Saved class ' + filePath);
			resolve(name)
		})
	});
}


const loadObject = (objectVersion) => {
	return new Promise((resolve, reject) => {
		const objectName = objectVersion.split('-')[1]
		const fileName = API_JSON_DIR + '/' + objectName + '.json'
		if (fs.existsSync(fileName)) {
			fs.readFile(fileName, 'utf8', (err, data) => {
				resolve({objectName, data: JSON.parse(data)});
			});
		} else {
			axios({
				method: 'get',
				url: 'https://script.google.com/macros/autocomplete/static/' + objectVersion
			}).then(response => {
				fs.writeFile(fileName, JSON.stringify(response.data), (err) => {
					if (err) {
						reject(objectName, err);
						return;
					}
					resolve({objectName, data: response.data, newFile: true});
				}); 
			}).catch((err) => {
				reject(objectName, err);
			});
		}
	});
}

const setupDir = (dir) => {
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
}

const processVersions = (versions) => {
	return versions
		.filter(v => v.indexOf('https://script.google.com/macros/autocomplete/static/') > -1 && v.indexOf('Api.js') === -1)
		.map(url => url.replace('https://script.google.com/macros/autocomplete/static/', ''))
}

fs.readFile('versions-test.json', 'utf8', function (err, data) {
	setupDir(API_JSON_DIR)
	setupDir(CLASSES_DIR)

	var versions = processVersions(JSON.parse(data));
	const creatingFiles = [];
	const processingFiles = [];
	console.log('+> Process started');
	versions.forEach(version => {
		const loadFilePromise = loadObject(version)
		creatingFiles.push(loadFilePromise)

		loadFilePromise.then(({objectName, data, newFile}) => {
			console.log('+-> File ' + objectName + ' ' + (newFile ? 'saved' : 'loaded'));
			processingFiles.push(processRoot(data));
		}).catch((objectName, err) => {
			console.error('+-----------> File ' + objectName + ' with error', err)
		});
	})

	Promise.all(creatingFiles).then(() => {
		console.log('+--> All files generated and loaded!');
		console.log('+>Generating classes')
		Promise.all(processingFiles).then(() => {
			console.log('All processed saved!');
		}).catch((err) => {
			console.error(err)
		})
	}).catch((err) => {
		console.error(err)
	})
});
