const gulp = require('gulp');
const gzip = require('gulp-gzip');
const { paths } = require('./config');

gulp.task('compress', compress);

function compress() {
	return gulp.src(paths.dist.all)
		.pipe(gzip({ append: false, skipGrowingFiles : true }))
		.pipe(gulp.dest(paths.dist.root));
}
