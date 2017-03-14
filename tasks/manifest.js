const gulp = require('gulp');
const fs = require('fs');
const { site } = require('../config/site.js');
const { paths } = require('./config');

gulp.task('manifest', manifest);

function manifest(cb) {
	const manifestContents = fs.readFileSync(paths.source.webManifest, 'utf8');
	const manifestData = JSON.parse(manifestContents);
	const siteData = {
		name: site.name,
		short_name: site.shortName,
		description: site.description,
		background_color: site.themeColor,
		theme_color: site.themeColor
	};
	const mergedData = Object.assign({}, manifestData, siteData);

	fs.writeFileSync(paths.dist.webManifest, JSON.stringify(mergedData));

	cb();
}
