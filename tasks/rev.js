const gulp = require('gulp');
const gulpRev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const runSequence = require('run-sequence');
const del = require('del');
const { paths } = require('./config');

gulp.task('rev', cb => runSequence('rev:files', 'rev:moveback', 'rev:cleanup', 'rev:replace', cb));
gulp.task('rev:files', rev);
gulp.task('rev:moveback', moveback);
gulp.task('rev:cleanup', cleanup);
gulp.task('rev:replace', replace);

function rev() {
	return gulp.src([paths.dist.styles.all, paths.dist.js.all], { base: paths.dist.root })
		.pipe(gulpRev())
		.pipe(gulp.dest(paths.dist.reved.root))  // write rev'd assets to build dir 
        .pipe(gulpRev.manifest())
        .pipe(gulp.dest(paths.dist.root)); // write manifest to build dir
}

function moveback() {
	return gulp.src([paths.dist.reved.styles, paths.dist.reved.js])
		.pipe(gulp.dest(paths.dist.root));
}

function cleanup() {
	return del(paths.dist.reved.root)
}

function replace() {
	const manifest = gulp.src(paths.dist.reved.manifest);

	return gulp.src(paths.dist.html.all)
		.pipe(revReplace({ manifest }))
		.pipe(gulp.dest(paths.dist.root));
}
