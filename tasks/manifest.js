const gulp = require('gulp');
const fs = require('mz/fs');
const path = require('path')
const { site } = require('../config/site.js');
const { paths } = require('./config');

gulp.task('manifest:build', manifest);
gulp.task('manifest:watch', watch);

const manifestSource = path.join(__dirname, '..', paths.source.webManifest)
const manifestDest = path.join(__dirname, '..', paths.source.webManifest)

function manifest() {
	const manifestData = JSON.parse(fs.readFileSync(manifestSource, 'utf8'));
	return writeManifestFile(manifestData);
}

function watch() {
	return gulp.watch([manifestSource], ['manifest:build']);
}

function writeManifestFile(manifestData) {
	const siteData = {
		name: site.name,
		short_name: site.shortName,
		description: site.description,
		background_color: site.themeColor,
		theme_color: site.themeColor
	};
	const mergedData = Object.assign({}, manifestData, siteData);
	const mergedJson = JSON.stringify(mergedData);

	return fs.writeFile(manifestDest, mergedJson);
}
