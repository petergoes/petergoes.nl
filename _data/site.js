const gravatar = require('gravatar')

module.exports = {
  "email": "petergoes@gmail.com",
  "name": "PeterGoes.nl",
  "shortName": "PeterGoes.nl",
  "description": "My home on the web",
  "gravatar": `https:${gravatar.url('petergoes@gmail.com', { size: 1024 })}`,
  "subtitle": "Front-end Developer",
  "themeColor": "#263238",
  "title": "Peter Goes",
  "author": "Peter Goes",
  "url": "https://www.petergoes.nl"
}
