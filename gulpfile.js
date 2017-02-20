const gulp = require('gulp');
const taskListing = require('gulp-task-listing');

require('./tasks/build');
require('./tasks/content');
require('./tasks/serve');
require('./tasks/styles');
require('./tasks/watch');

gulp.task('default', taskListing.withFilters(null, 'default'));
