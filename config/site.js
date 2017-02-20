const gravatar = require('gravatar');

module.exports = {
	site: {
		"data": {
			"mainmenu": [
				{ label: "Home",     uri: '/' },
				{ label: "About Me", uri: '/about-me' }
			]
		},
		"email": "petergoes@gmail.com",
		"name": "PeterGoes.nl",
		"social": {
			"twitter": {
				"url": "https://twitter.com/petergoes",
				"username": "@petergoes",
			},
			"github": "https://github.com/petergoes",
			"vimeo": "https://vimeo.com/petergoes",
			"linkedIn": "https://nl.linkedin.com/in/pgoes",
			"googlePlus": "https://plus.google.com/108905978694295358060",
			"gravatar": gravatar.url('petergoes@gmail.com')
		},
		"subtitle": "Front-end Developer",
		"themeColor": "#263238",
		"title": "Peter Goes",
		"url": "http://www.petergoes.nl"
	}
}
