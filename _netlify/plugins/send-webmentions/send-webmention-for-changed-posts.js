const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch');
const cheerio = require('cheerio')
const microformat = require('microformat-node')
const getTargetEndpoint = require('./get-webmention-target')

async function getMentionBundle(postLocation) {
  const resource = postLocation.replace('content', '_site').replace('.md', '/index.html')
  const localFilePath = path.join(__dirname, '../../../', resource)
  const postHtml = fs.readFileSync(localFilePath, {encoding: 'utf-8'})
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
  ))

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
  return fetch(`http://localhost:3000/api?source=${source}&target=${target}`)
    .then(async response => ({
      source,
      content: await response.text()
    }))
}

async function handleWebmentionResponse({ source, content }) {
  if (content) {
    console.log('')
    console.log('Endpoint response:')
    console.log(`  Source: ${source}`)
    console.log(`  Response: ${content}`)
    console.log('')
  }
}

async function sendWebmentionForChangedPost(changedPosts) {
  const mentionBundlePromise = changedPosts
    .forEach(async postLocation => {
      const bentionBundle = await getMentionBundle(postLocation)
      bentionBundle.forEach(bundle => 
          sendWebMention(bundle)
            .then(handleWebmentionResponse)
            .catch(error => {
              if (error.message === 'No webmention endpoint') {
                // ignore, already logged
              }
            })
      )
    }) 
}

// (async =() => {
// await sendWebmentionForChangedPost(['content/notes/2021-06-04-10-03.md']) // note, should be posted to twitter and mastodon
// await sendWebmentionForChangedPost(['content/likes/2021-06-04-10-06.md']) // twitter post
// await sendWebmentionForChangedPost(['content/replies/2021-05-20-06-21.md']) // sia.codes article
// await sendWebmentionForChangedPost(['content/replies/2021-06-04-10-05.md']) // tweet
// await sendWebmentionForChangedPost(['content/replies/2021-06-05-18-56.md']) // bulk reply webmention.rocks
// await sendWebmentionForChangedPost(['content/bookmarks/an-in-depth-tutorial-of-webmentions-eleventy.md']) // sia.codes article
// await sendWebmentionForChangedPost(['content/bookmarks/css-is-a-strongly-typed-language-css-tricks.md']) // css tricks article
// })()

module.exports = sendWebmentionForChangedPost
