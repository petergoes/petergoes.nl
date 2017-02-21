const gulp = require('gulp');
const gulpConnect = require('gulp-connect');
const gulpWatch = require('gulp-watch');
const { paths } = require('./config.js');

gulp.task('connect', connect);
gulp.task('serve', ['connect', 'watch']);
gulp.task('serve:watch', serveWatch);

function connect() {
	gulpConnect.server({
		root: paths.dist.root,
		livereload: true,
		port: 3000
	});
}

function serveWatch() {
	gulp.src(paths.dist.all)
		.pipe(gulpWatch(paths.dist.all))
		.pipe(gulpConnect.reload());
}
