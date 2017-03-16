const gulp = require('gulp');
const { paths } = require('./config');

gulp.task('assets:build', assets);

function assets() {
	const excludes = [
		...paths.source.assets.sourceFiles,
		...paths.source.images.all
	].map(line => `!${line}`);
	return gulp.src([...paths.source.assets.all, ...excludes])
		.pipe(gulp.dest(paths.dist.assets));
}
