const babel = require('rollup-plugin-babel');
const defer = require('promise-defer');
const gulp = require('gulp');
const path = require('path');
const recursiveReadDir = require('recursive-readdir');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { paths } = require('./config');

gulp.task('vendor:build', vendor);

function vendor() {
	const getVendorFilesDefer = defer();
	recursiveReadDir('./src/vendor', (err, files) => {
		if (err) { throw new Error(err); }
		getVendorFilesDefer.resolve(files);
	});

	return getVendorFilesDefer.promise
		.then(files => files.filter(file => path.extname(file) === '.js'))
		.then(parseJsFiles);
}

function parseJsFiles(files) {
	return Promise.all(files.map(file => {
		const config = {
			entry: path.join(file),
			plugins: [
				resolve({
					jsnext: true,
					main: true,
					browser: true,
				}),
				commonjs(),
				babel({
					exclude: 'node_modules/**',
				})
			],
		};

		return rollup.rollup(config)
			.then(function (bundle) {
				bundle.write({
					format: "umd",
					dest: path.join('./dist/vendor', path.basename(file)),
					sourceMap: false
				});
			});
	}));
}
