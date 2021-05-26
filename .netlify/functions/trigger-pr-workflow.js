const fetch = require('node-fetch')
require('dotenv-save').config()

exports.handler = async function triggerPrWorkflow(event, context) {
  let secret
  try {
    const { secret: _secret } = JSON.parse(event.body)
    secret = _secret
  } catch (error) {
    return { statusCode: 400 }
  }

  if (secret !== process.env.WEBMENTION_IO_SECRET) {
    return { statusCode: 401 }
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/petergoes/petergoes.nl/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `token ${process.env.GITHUB_PAT}`
        },
        body: '{ "event_type": "Received Webmention" }'
      }
    ).then(response => response.text())

    if (response) {
      return { statusCode: 500, body: response }
    }
    return { statusCode: 200, body: 'ok' }
  } catch (error) {
    return { statusCode: 500, body: error.message }
  }
}
