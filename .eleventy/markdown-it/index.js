const markdownIt = require('markdown-it');
const addLazy = require('./add-lazy')

const options = {
  html: true,
  typographer: true,
  breaks: true,
  linkify: true,
}

module.exports = markdownIt(options)
  .use(addLazy)
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-footnote'))
