const changed = require('gulp-changed');
const frontMatter = require('front-matter');
const gulp = require('gulp');
const marked = require('marked');
const nunjucks = require('nunjucks');
const path = require('path');
const rename = require('gulp-rename');
const transform = require('gulp-transform');

nunjucks.configure('./src/views', {
    autoescape: false
});

gulp.task('content', content);
gulp.task('content:watch', watch);

function content() {
	gulp.src('content/**/*.md')
		.pipe(changed('dist', {extension: '.html', transform: transformPath }))
		.pipe(transform(markdownToHtml))
		.pipe(rename(nameToFolderWithIndex))
		.pipe(gulp.dest('dist'));
}

function watch() {
	return gulp.watch([
			'content/**/*.md'
		], content);
}

function transformPath(newPath) {
	const pathObj = path.parse(newPath);
	const newName = (pathObj.name !== 'index') ? `${pathObj.name}/index` : pathObj.name;

	return `${pathObj.dir}/${newName}${pathObj.ext}`;
}

function markdownToHtml(contents) {
	const data = frontMatter(contents.toString());
	const renderedHtml = marked(data.body);
	const renderedPage = nunjucks.render(`${data.attributes.view}.html`, { content: renderedHtml });

	return renderedPage;
}

function nameToFolderWithIndex(path) {
	path.basename = (path.basename === 'index') ? path.basename : `${path.basename}/index`;
	path.extname = ".html";

	return path;
}
