const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const gulp = require('gulp');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const rollup = require('rollup');
const { paths } = require('./config');

gulp.task('scripts:build', scripts);
gulp.task('scripts:watch', watch);

function scripts() {
	const config = {
		entry: paths.source.js.entry,
		plugins: [
			resolve({
				jsnext: true,
				main: true,
				browser: true,
			}),
			commonjs(),
			babel({
				exclude: paths.node_modules
			}),
			uglify()
		],
	};

	return rollup.rollup(config)
		.then(function (bundle) {
			bundle.write({
				format: "iife",
				dest: paths.dist.js.bundle,
				sourceMap: true
			});
		});
}

function watch() {
	return gulp.watch([paths.source.js.all], ['scripts:build']);
}
