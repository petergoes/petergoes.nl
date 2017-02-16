const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', build);

function build() {
	const watchTasks = Object.keys(gulp.tasks)
		.filter(task => /:build$/.test(task))

	runSequence(watchTasks);
}
