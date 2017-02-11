const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');

gulp.task('html', html);

function html() {
	gulp.src('src/views/page.html')
        .pipe(nunjucks.compile({ content: 'hello world' }))
        .pipe(gulp.dest('dist'));
}
