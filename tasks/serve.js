const gulp = require('gulp');
const gulpConnect = require('gulp-connect');
const { paths } = require('./config.js');

gulp.task('connect', connect);
gulp.task('connect:reload', connectReload);
gulp.task('serve', ['connect', 'watch']);
gulp.task('serve:watch', serveWatch);

function connect() {
	gulpConnect.server({
		root: paths.dist.root,
		livereload: true,
		port: 3000
	});
}

function connectReload() {
	gulp.src(paths.dist.all)
		.pipe(gulpConnect.reload());
}

function serveWatch() {
	gulp.watch([paths.dist.all], ['connect:reload']);
}
