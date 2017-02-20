module.exports = {
	paths: {
		content: {
			all: './content/**/*.md'
		},
		dist: {
			all: './dist/**/*',
			root: './dist',
			styles: {
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
