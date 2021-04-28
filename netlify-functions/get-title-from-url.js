const fetch = require('node-fetch')

const findTitle = /<title>(.+)<\/title>/

exports.handler = async function getTitleFromUrl(event, context) {
  const { url } = event.queryStringParameters || {}

  if (!url) {
    return {
      statusCode: 400,
      body: "url is not provided"
    }
  }

  const [, title] = await fetch(decodeURIComponent(url))
    .then(res => res.text())
    .then(html => findTitle.exec(html))


  return {
    statusCode: 200,
    body: JSON.stringify({ title }, null, 2)
  }
}
