const fs = require('fs');
const axios = require('axios');

const API_JSON_DIR = 'api-json'
const CLASSES_DIR = 'classes'


const processObj = (obj, treeName) => {
	if (!obj) {
		return;
	}
	const name = obj['1'];
	const dirToSave = CLASSES_DIR + '/' + name;
	const filePath = dirToSave + '/' + (!treeName ? 'index.js' : name + '.js' )
	let metaClass = 'class ' + name + '\n';

	if (!treeName) {
		setupDir(dirToSave);
	}

	const props = obj['2']
	const funcs = obj['3']
	if (!treeName && props && Array.isArray(props)) {
		props.forEach(item => {
			processObj(item, name)
		});
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
			metaClass += funcName + '(' + strParams + '): ' + resultType + ' {\n//TODO Implement\n}\n';
		})
	}

	metaClass += 'export default ' + name;
	fs.writeFile(name, metaClass, function(err) {
	})
}


const loadObject = (objectVersion) => {
	return new Promise((resolve, reject) => {
		const objectName = objectVersion.split('-')[1]
		const fileName = 'API_JSON_DIR/' + objectName + '.json'
		if (fs.existsSync(fileName)) {
			fs.readFile(fileName, 'utf8', (err, data) => {
				resolve(objectName, data, false);
			});
		} else {
			axios({
				method: 'get',
				url: 'https://script.google.com/macros/autocomplete/static/' + objectVersion
			}).then(a => {
				fs.writeFile(fileName, JSON.stringify(a.data), function(err) {
					if (err) {
						reject(objectName, err);
					}
					resolve(objectName, a.data, true);
				}); 
			});
		}
	});
}

const setupDir = (dir) => {
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
}

fs.readFile('versions.json', 'utf8', function (err, data) {
	setupDir(API_JSON_DIR)
	setupDir(CLASSES_DIR)

	var versions = JSON.parse(data);
	const creatingFiles = [];
	const processingFiles = [];
	console.log('+> Process started');
	versions.forEach(version => {
		const loadFilePromise = loadObject(version)
		creatingFiles.push(loadFilePromise)

		loadFilePromise.then((objectName, data, newFile) => {
			processingFiles.push(processObj(data));
			console.log('+-> File ' + objectName + ' ' + (newFile ? 'saved' : 'loaded'));
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
