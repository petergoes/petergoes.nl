const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const { paths } = require('./config');

gulp.task('styles:build', styles);
gulp.task('styles:watch', watch);

function styles() {
	return gulp.src(paths.source.styles.main)
		.pipe(less())
		.pipe(rename(paths.dist.styles.fileName))
		.pipe(gulp.dest(paths.dist.styles.folder))
}

function watch() {
	return gulp.watch([paths.source.styles.all], ['styles:build']);
}
