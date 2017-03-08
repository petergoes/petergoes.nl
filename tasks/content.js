const changed = require('gulp-changed');
const cheerio = require('cheerio');
const configSite = require('../config/site');
const frontMatter = require('front-matter');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const marked = require('marked');
const nunjucks = require('nunjucks');
const path = require('path');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const { paths } = require('./config');

gulp.task('content:buildNew', content);
gulp.task('content:build', () => content({ onlyChanged: false }));
gulp.task('content:watch', watch);

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

function content({ onlyChanged = true } = {}) {
	return gulp.src(paths.content.all)
		.pipe(gulpIf(onlyChanged, changed('dist', { transformPath: transformPath })))
		.pipe(transform(markdownToHtml))
		.pipe(rename(nameToFolderWithIndex))
		.pipe(gulp.dest(paths.dist.root))
		.pipe(transform(extractMainContent))
		.pipe(rename(indexToPartial))
		.pipe(gulp.dest(paths.dist.root));
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
	const renderedHtml = addHighlightJsClassToHtml(marked(fm.body));
	const nunjucksData = { content: renderedHtml };
	const data = Object.assign({}, nunjucksData, configSite, pageMeta);

	nunjucks.configure(paths.source.folder, {
		autoescape: false
	});

	return nunjucks.render(`views/${fm.attributes.view}.html`, data);
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

function addHighlightJsClassToHtml(html) {
	const $ = cheerio.load(html);
	$('pre code').addClass('hljs');
	$('pre:has(code)').addClass('hljs-wrapper');

	return $.html();
}

function extractMainContent(contents) {
	const $ = cheerio.load(contents.toString());
	const title = $('html title').text();
	const bodyClass = $('body').attr('class');
	const data = {
		title,
		bodyClass
	}
	
	$('main').append(`<script type="application/json">${JSON.stringify(data)}</script>`);

	return $('main').html();
}

function indexToPartial(path) {
	path.basename = 'partial';
	return path;
}
