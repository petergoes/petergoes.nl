const fetch = require('node-fetch')

const findTitle = /\<title\>(.+)\<\/title\>/

exports.handler = async function getTitleFromUrl(event, context) {
  const { url } = event.queryStringParameters || {}

  if (!url) {
    return {
      statusCode: 400,
      body: "url is not provided"
    }
  }

  let response
  let html
  let title
  let match
  try {
    html = await fetch(decodeURI(url)).then(res => res.text())
    match = findTitle.exec(html.replace(/\n/g, ''))
    title = match[1].trim()

    if (!title) throw new Error('Title was not found')

    return {
      statusCode: 200,
      body: JSON.stringify({ title }, null, 2)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        responseHtml: html,
        error: error.message,
        match,
        requestUrl: decodeURI(url),
      })
    } 
  }
}
