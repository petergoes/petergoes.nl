const gulp = require('gulp');
const taskListing = require('gulp-task-listing');

require('./tasks/html');
require('./tasks/watch');

gulp.task('default', taskListing.withFilters(null, 'default'));
