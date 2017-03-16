const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const optipng = require('imagemin-optipng');
const jpeg = require('imagemin-jpeg-recompress');
const gulpResponsive = require('gulp-responsive');
const runSequence = require('run-sequence');
const { paths } = require('./config');

gulp.task('images:build', images);
gulp.task('images:responsive', responsive);
gulp.task('images:optimize', optimize);

function images(cb) {
	runSequence([
		'images:responsive',
		'images:optimize'
	], cb);
}

function responsive() {
	return gulp.src([paths.source.images.bitmap])
		.pipe(gulpResponsive({
			'logo/*.{jpg,png}': [
				{height:  '16', width:  '16', rename: {suffix:  '-16'}, crop: 'center'},
				{height:  '32', width:  '32', rename: {suffix:  '-32'}, crop: 'center'},
				{height:  '48', width:  '48', rename: {suffix:  '-48'}, crop: 'center'},
				{height:  '72', width:  '72', rename: {suffix:  '-72'}, crop: 'center'},
				{height:  '96', width:  '96', rename: {suffix:  '-96'}, crop: 'center'},
				{height: '144', width: '144', rename: {suffix: '-144'}, crop: 'center'},
				{height: '168', width: '168', rename: {suffix: '-168'}, crop: 'center'},
				{height: '192', width: '192', rename: {suffix: '-192'}, crop: 'center'},
			]},
			{
				withoutEnlargement: true,
				skipOnEnlargement: false,
				errorOnEnlargement: false
			}
		))
		.pipe(gulp.dest(paths.dist.root));
}

function optimize() {
	return gulp.src(paths.source.images.all, {base: paths.dist.root})
		.pipe(imagemin([
                jpeg(),
                optipng({ optimizationLevel: 3 })
            ]))
		.on('error', function(error) {
			console.error(error);
			this.emit('end');
		})
		.pipe(gulp.dest(paths.dist.root));
}
