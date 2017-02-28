module.exports = {
	paths: {
		content: {
			all: './content/**/*.md'
		},
		dist: {
			all: './dist/**/*',
			fonts: {
				all: './dist/fonts/**/*'
			},
			html: {
				all: './dist/**/*.html'
			},
			js: {
				all: './dist/**/*.js'
			},
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
			}
		},
		source: {
			assets: [
				'./src/assets/**/*',
				'./node_modules/fontfaceobserver/fontfaceobserver.js'
			],
			folder: './src',
			html: {
				all: './src/**/*.html'
			},
			styles: {
				all: './src/**/*.less',
				main: './src/styles/_main.less'
			},
			views: './src/views'
		}
	}
}
