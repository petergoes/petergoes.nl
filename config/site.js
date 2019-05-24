const gravatar = require('gravatar');

module.exports = {
	site: {
		"data": {
			"mainmenu": [
				{ label: "Home",     uri: '/' },
				{ label: "About Me", uri: '/about-me' },
				{ label: "Blog", uri: '/blog' },
				{ label: "Contact", uri: '/contact' }
			]
		},
		"email": "petergoes@gmail.com",
		"name": "PeterGoes.nl",
		"shortName": "PeterGoes.nl",
		"description": "My home on the web",
		"social": {
			"twitter": {
				"name": "Twitter",
				"url": "https://twitter.com/petergoes",
				"username": "@petergoes"
			},
			"github": {
				"name": "Github",
				"url": "https://github.com/petergoes"
			},
			"vimeo": {
				"name": "Vimeo",
				"url": "https://vimeo.com/petergoes"
			},
			"linkedIn": {
				"name": "LinkedIn",
				"url": "https://nl.linkedin.com/in/pgoes"
			},
			"googlePlus": {
				"name": "Google+",
				"url": "https://plus.google.com/108905978694295358060"
      },
      "tootCafe": {
        "name": "Toot Café",
        "url": "https://toot.cafe/@petergoes"
      },
		},
		"gravatar": gravatar.url('petergoes@gmail.com'),
		"subtitle": "Front-end Developer",
		"themeColor": "#263238",
		"title": "Peter Goes",
		"url": "https://www.petergoes.nl"
	}
}
