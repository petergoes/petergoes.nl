module.exports = {
	sitemap: {
		excludes: [
			'/contact/failed/',
			'/contact/success/',
			'/error/'
		]
	},
	paths: {
		node_modules: './node_modules/**/*',
		content: {
			all: './content/**/*.md'
		},
		dist: {
			all: './dist/**/*',
			assets: './dist/assets',
			fonts: {
				all: './dist/fonts/**/*'
			},
			html: {
				all: './dist/**/*.html',
				indexes: './dist/**/index.html'
			},
			images: {
				all: './dist/**/*.{png,gif,svg,jpg,jpeg}'
			},
			js: {
				all: './dist/**/*.js',
				bundle: './dist/js/bundle.js'
			},
			sitemap: './dist/sitemap.txt',
			reved: {
				fonts: './dist/reved/fonts/**/*',
				js: './dist/reved/**/*.js',
				manifest: './dist/rev-manifest.json',
				root: './dist/reved',
				styles: './dist/reved/**/*.css',
				all: './dist/reved/**/*'
			},
			root: './dist',
			styles: {
				all: './dist/**/*.css',
				folder: './dist/styles',
				fileName: 'main.css'
			},
			vendor: {
				all: './dist/vendor'
			},
			webManifest: './dist/web-manifest.json'
		},
		source: {
			assets: {
				all: [
					'./src/assets/**/*',
					'./node_modules/fontfaceobserver/fontfaceobserver.js'
				],
				sourceFiles: [
					'./src/assets/**/*.sketch'
				],
				root: './src/assets/'
			},
			folder: './src',
			html: {
				all: './src/**/*.html'
			},
			images: {
				all: './src/assets/**/*.{png,gif,svg,jpg,jpeg}',
				bitmap: './src/assets/**/*.{png,gif,jpg,jpeg}'
			},
			styles: {
				all: './src/**/*.less',
				main: './src/styles/_main.less'
			},
			views: './src/views',
			js: {
				all: './src/**/*.js',
				entry: './src/views/_base.js'
			},
			webManifest: './src/web-manifest.json'
		}
	}
}
