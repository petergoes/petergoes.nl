const gulp = require('gulp');
const criticalcss = require('critical').stream;
const { paths } = require('./config');

gulp.task('critical', critical);

function critical() {
    return gulp.src(paths.dist.html.indexes)
        .pipe(criticalcss({
			inline: true,
			base: paths.dist.root,
			dimensions: [
				{ height: 200, width: 500 },
				{ height: 900, width: 1200}
			],
			minify: true
		}))
        .pipe(gulp.dest(paths.dist.root));
}
