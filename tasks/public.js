const gulp = require('gulp');
const { paths } = require('./config');

gulp.task('public:build', publicTask);

function publicTask() {
	return gulp.src(paths.source.public)
		.pipe(gulp.dest(paths.dist.public));
}
