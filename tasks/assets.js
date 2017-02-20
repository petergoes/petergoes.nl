const gulp = require('gulp');
const { paths } = require('./config');

gulp.task('assets:build', assets);

function assets() {
	return gulp.src(paths.source.assets)
		.pipe(gulp.dest(paths.dist.root));
}
