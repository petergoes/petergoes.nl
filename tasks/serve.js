const gulp = require('gulp');
const gulpConnect = require('gulp-connect');

gulp.task('connect', connect);
gulp.task('connect:reload', connectReload);
gulp.task('serve', ['connect', 'watch']);
gulp.task('serve:watch', serveWatch);

function connect() {
	gulpConnect.server({
		root: 'dist',
		livereload: true,
		port: 3000
	});
}

function connectReload() {
	gulp.src('./dist/**/*')
		.pipe(gulpConnect.reload());
}

function serveWatch() {
	gulp.watch(['./dist/**/*'], ['connect:reload']);
}
