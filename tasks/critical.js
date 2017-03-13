const gulp = require('gulp');
const criticalcss = require('critical').stream;

// Generate & Inline Critical-path CSS
gulp.task('critical', critical);

function critical() {
    return gulp.src('dist/**/index.html')
        .pipe(criticalcss({
			inline: true,
			base: './dist/',
			dimensions: [
				{ height: 200, width: 500 },
				{ height: 900, width: 1200}
			],
			minify: true
		}))
        .pipe(gulp.dest('dist'));
}
