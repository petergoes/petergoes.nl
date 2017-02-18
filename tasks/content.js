const changed = require('gulp-changed');
const frontMatter = require('front-matter');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const marked = require('marked');
const nunjucks = require('nunjucks');
const path = require('path');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const configSite = require('../config/site');
const { paths } = require('./config');

gulp.task('content:buildNew', content);
gulp.task('content:build', () => content({ onlyChanged: false }));
gulp.task('content:watch', watch);

function content({ onlyChanged = true } = {}) {
	return gulp.src('content/**/*.md')
		.pipe(gulpIf(onlyChanged, changed('dist', { transform: transformPath })))
		.pipe(transform(markdownToHtml))
		.pipe(rename(nameToFolderWithIndex))
		.pipe(gulp.dest('dist'));
}

function watch() {
	gulp.watch([paths.content.all], ['content:buildNew']);
	gulp.watch([paths.source.html.all], ['content:build']);
}

function transformPath(newPath) {
	const pathObj = path.parse(newPath);
	const newName = (pathObj.name !== 'index') ? `${pathObj.name}/index` : pathObj.name;

	return `${pathObj.dir}/${newName}.html`;
}

function markdownToHtml(contents, file) {
	const fm = frontMatter(contents.toString());
	const pageMeta = getPageMetaData(file, fm);
	const renderedHtml = marked(fm.body);
	const nunjucksData = { content: renderedHtml };
	const data = Object.assign({}, nunjucksData, configSite, pageMeta);

	nunjucks.configure(paths.source.views, {
		autoescape: false
	});

	return nunjucks.render(`${fm.attributes.view}.html`, data);
}

function nameToFolderWithIndex(path) {
	path.basename = (path.basename === 'index') ? path.basename : `${path.basename}/index`;
	path.extname = ".html";

	return path;
}

function getPageMetaData(file, frontMatter) {
	const fileObj = path.parse(file.path);
	const relativePath = path.relative(paths.dist.root, path.join(fileObj.dir, fileObj.name)).replace('../content/', '');
	const data = {
		path: relativePath,
		permalink: `${configSite.site.url}/${relativePath}`.replace('/index', ''),
		title: getTitleFromMarkdown(frontMatter.body)
	};
	
	return { page: Object.assign({}, data , frontMatter.attributes) };
}

function getTitleFromMarkdown(markdown) {
	return markdown.match(/(#\s)(.+)(\n)/)[2].trim();
}
