const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('watch', watch);

function watch() {
	const watchTasks = Object.keys(gulp.tasks)
		.filter(task => /:watch$/.test(task))

	runSequence(watchTasks);
}
