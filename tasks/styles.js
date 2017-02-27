const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const { paths } = require('./config');

gulp.task('styles:build', styles);
gulp.task('styles:watch', watch);

function styles() {
	return gulp.src(paths.source.styles.main)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(rename(paths.dist.styles.fileName))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.dist.styles.folder))
}

function watch() {
	return gulp.watch([paths.source.styles.all], ['styles:build']);
}
