const changed = require('gulp-changed');
const frontMatter = require('front-matter');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const marked = require('marked');
const nunjucks = require('nunjucks');
const path = require('path');
const rename = require('gulp-rename');
const transform = require('gulp-transform');

gulp.task('content', content);
gulp.task('content:forceall', () => content({ onlyChanged: false }));
gulp.task('content:watch', watch);

function content({ onlyChanged = true } = {}) {
	return gulp.src('content/**/*.md')
		.pipe(gulpIf(onlyChanged, changed('dist', {extension: '.html', transform: transformPath })))
		.pipe(transform(markdownToHtml))
		.pipe(rename(nameToFolderWithIndex))
		.pipe(gulp.dest('dist'));
}

function watch() {
	gulp.watch(['content/**/*.md'], ['content']);
	gulp.watch(['src/**/*.html'], ['content:forceall']);
}

function transformPath(newPath) {
	const pathObj = path.parse(newPath);
	const newName = (pathObj.name !== 'index') ? `${pathObj.name}/index` : pathObj.name;

	return `${pathObj.dir}/${newName}${pathObj.ext}`;
}

function markdownToHtml(contents) {
	const data = frontMatter(contents.toString());
	const renderedHtml = marked(data.body);

	nunjucks.configure('./src/views', {
		autoescape: false
	});

	return nunjucks.render(`${data.attributes.view}.html`, { content: renderedHtml });
}

function nameToFolderWithIndex(path) {
	path.basename = (path.basename === 'index') ? path.basename : `${path.basename}/index`;
	path.extname = ".html";

	return path;
}
