const gulp = require('gulp');
const transform = require('gulp-transform');
const less = require('gulp-less');
const rename = require('gulp-rename');
const fs = require('fs');
const { paths } = require('./config');

gulp.task('styles:build', styles);
gulp.task('styles:watch', watch);

function styles() {
	return gulp.src(paths.source.styles.main)
		.pipe(less())
		.pipe(transform(includeHighlightJSStyling))
		.pipe(rename(paths.dist.styles.fileName))
		.pipe(gulp.dest(paths.dist.styles.folder))
}

function watch() {
	return gulp.watch([paths.source.styles.all], ['styles:build']);
}

function includeHighlightJSStyling(contents) {
	let highlight = fs.readFileSync('./node_modules/highlight.js/styles/monokai-sublime.css');
	highlight += contents.toString();
	return highlight;
}
