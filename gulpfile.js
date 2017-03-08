const gulp = require('gulp');
const taskListing = require('gulp-task-listing');

require('./tasks/assets');
require('./tasks/build');
require('./tasks/clean');
require('./tasks/compress');
require('./tasks/content');
require('./tasks/deploy');
require('./tasks/rev');
require('./tasks/scripts');
require('./tasks/serve');
require('./tasks/styles');
require('./tasks/vendor');
require('./tasks/watch');

gulp.task('default', taskListing.withFilters(null, 'default'));
