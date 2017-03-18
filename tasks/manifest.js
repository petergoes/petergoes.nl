const gulp = require('gulp');
const fs = require('mz/fs');
const { site } = require('../config/site.js');
const { paths } = require('./config');

gulp.task('manifest:build', manifest);
gulp.task('manifest:watch', watch);

function manifest() {
	const manifestData = JSON.parse(fs.readFileSync(paths.source.webManifest, 'utf8'));
	return writeManifestFile(manifestData);
}

function watch() {
	return gulp.watch([paths.source.webManifest], ['manifest:build']);
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

	return fs.writeFile(paths.dist.webManifest, mergedJson);
}
