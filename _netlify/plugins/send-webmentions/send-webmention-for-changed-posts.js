const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch');
const cheerio = require('cheerio')
const microformat = require('microformat-node')
const getTargetEndpoint = require('./get-webmention-target')

async function getMentionBundle(postLocation) {
  const resource = postLocation.replace('content', '_site').replace('.md', '/index.html')
  const localFilePath = path.join(__dirname, '../../../', resource)
  const postHtml = fs.readFileSync(localFilePath, { encoding: 'utf-8' })
  const postMainHtml = cheerio.load(postHtml)('main').html()
  const microformats = microformat.get({ html: postMainHtml })
  const entry = microformats.items.find(({ type }) => type.includes('h-entry'))
  const { url } = entry.properties
  const source = url.find(url => /^http(s?):\/\/(www.)?petergoes.nl/.test(url))
  const targets = url.filter(url => url !== source)
  const pairs = targets.map(target => ({ target, source }))
  const webmentionBundles = await Promise.all(pairs.map(({ target, source }) => {
    console.log('')
    console.log('Search webmention endpoints in:')
    console.log(`  ${target}`)
    return getTargetEndpoint(target)
      .then(endpoint => ({
        target,
        source,
        endpoint,
      }))
  }
  )).catch(error => console.log(error))

  return webmentionBundles.flat(Infinity)
}

async function sendWebMention({ target, source, endpoint }) {
  if (!endpoint) {
    console.log('')
    console.log('No webmention endpoint found for:')
    console.log(`  ${target}`)
    console.log('')
    throw new Error('No webmention endpoint')
  }

  if (!target || !source) {
    console.log('')
    console.error('Target or source not found for')
    console.log({ source, target, endpoint })
    console.log('')
    throw new Error('target or source not found')
  }

  console.log('')
  console.log(`Sending webmention:`)
  console.log(`  Target: ${target}`)
  console.log(`  Source: ${source}`)
  console.log(`  Endpoint: ${endpoint}`)
  console.log('')

  // console.log('Execute fetch on:')
  // console.log(`  ${endpoint}`)
  // return { source }

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`
  })
    .then(async response => {
      const content = await response.json()
        .catch(error => {
          if (!/^invalid\sjson\sresponse\sbody/.test(error.message)) {
            console.log(error.message)
          }
          return {}
        })

      return { source, content, response }
    })
}

async function handleWebmentionResponse({ source, content, response }) {
  console.log('')
  console.log('Endpoint response:')
  console.log(`  Status: ${response.status}`)
  console.log(`  Status text: ${response.statusText}`)
  console.log(`  Source: ${source}`)
  console.log(`  Target: ${response.url}`)

  if (content) {
    console.log(`  Response: ${JSON.stringify(content, null, 2)}`)

    const body = {
      event_type: "Add syndication link",
      client_payload: { source }
    }

    if (response.url === 'https://brid.gy/publish/twitter') {
      body.client_payload.tweetUrl = source
    }

    if (response.url === 'https://brid.gy/publish/mastodon') {
      body.client_payload.tootUrl = source
    }

    if (body.client_payload.tweetUrl || body.client_payload.tootUrl) {
      console.log('  Syndication action triggered')

      await fetch(
        'https://api.github.com/repos/petergoes/petergoes.nl/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `token ${process.env.GITHUB_PAT}`
          },
          body: JSON.stringify(body)
        }
      )
    }

  }

  console.log('')

  return { source, content }
}

async function sendWebmentionForChangedPost(changedPosts) {
  return Promise.all(
    changedPosts.map(postLocation =>
      getMentionBundle(postLocation)
        .then(mentionBundle =>
          Promise.all(
            mentionBundle.map(bundle =>
              sendWebMention(bundle)
                .then(handleWebmentionResponse)
                .catch(error => {
                  if (error.message === 'No webmention endpoint') {
                    // ignore, already logged
                  }
                })
            )
          )
        ))
  )
}

(async () => {
// await sendWebmentionForChangedPost(['content/notes/2021-06-04-10-03.md']) // note, should be posted to twitter and mastodon
// await sendWebmentionForChangedPost(['content/likes/2021-06-04-10-06.md']) // twitter post
// await sendWebmentionForChangedPost(['content/replies/2021-05-20-06-21.md']) // sia.codes article
// await sendWebmentionForChangedPost(['content/replies/2021-06-04-10-05.md']) // tweet
// await sendWebmentionForChangedPost(['content/replies/2021-06-06-20-11.md']) // bulk reply webmention.rocks
// await sendWebmentionForChangedPost(['content/bookmarks/an-in-depth-tutorial-of-webmentions-eleventy.md']) // sia.codes article
// await sendWebmentionForChangedPost(['content/bookmarks/css-is-a-strongly-typed-language-css-tricks.md']) // css tricks article
})()

module.exports = sendWebmentionForChangedPost
