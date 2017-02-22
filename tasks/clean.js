const gulp = require('gulp');
const del = require('del');
const { paths } = require('./config')

gulp.task('clean', clean);

function clean() {
	return del(paths.dist.all);
}
