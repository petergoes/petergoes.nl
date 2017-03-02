const gulp = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const { paths } = require('./config');

gulp.task('scripts:build', scripts);
gulp.task('scripts:watch', watch);

function scripts() {
	const config = {
		entry: paths.source.js.entry,
		plugins: [
			babel({
				exclude: paths.node_modules
			})
		],
	};

	return rollup.rollup(config)
		.then(function (bundle) {
			bundle.write({
				format: "umd",
				dest: paths.dist.js.bundle,
				sourceMap: true
			});
		});
}

function watch() {
	return gulp.watch([paths.source.js.all], ['scripts:build']);
}
