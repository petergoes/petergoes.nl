const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', build);

function build() {
	const buildTasks = Object.keys(gulp.tasks)
		.filter(task => /:build$/.test(task))
		.filter(task => {
			if (process.env.NODE_ENV !== 'development') {
				return true;
			} else {
				return !(/images:build/.test(task))
			}
		})

	runSequence(buildTasks);
}
