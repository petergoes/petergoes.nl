const fetch = require('node-fetch')
const microformat = require('microformat-node')
const cheerio = require('cheerio')

async function getTargetEndpoint(target) {
  function getFromHeaders(headers) {
    const values = (headers.get('link') || '').split(',')
    const value = values.find(value => /rel="?(.+)?webmention"?/.test(value))
    if (value) {
      return value
        .replace(/;.+/, '')
        .replace('<', '')
        .replace('>', '')
    }
  }

  function getFromHtml(html) {
    const { rels = {} } = microformat.get({ html })
    const { webmention = [] } = rels
    if (webmention.length > 0) {
      return webmention[0]
    }

    const $ = cheerio.load(html)
    const linkHref = $('link[rel="webmention"]').attr('href')
    if (linkHref === '') {
      return target
    }

    console.log(html)
  }

  return fetch(target)
    .then(async res => {
      const endpoint = getFromHeaders(res.headers) ||
                       getFromHtml(await res.text())

      if (!endpoint) return

      if (!/http/.test(endpoint)) {
        const url = new URL(res.url)
        const origin = url.origin
        const _endpoint = /^\//.test(endpoint) ? endpoint : `/${endpoint}`
        return `${origin}${_endpoint}`
      }

      return endpoint.trim()
    })
}

// (async () => {
//   console.log('1', await getTargetEndpoint('https://webmention.rocks/test/1'))
//   console.log('2', await getTargetEndpoint('https://webmention.rocks/test/2'))
//   console.log('3', await getTargetEndpoint('https://webmention.rocks/test/3'))
//   console.log('4', await getTargetEndpoint('https://webmention.rocks/test/4'))
//   console.log('5', await getTargetEndpoint('https://webmention.rocks/test/5'))
//   console.log('6', await getTargetEndpoint('https://webmention.rocks/test/6'))
//   console.log('7', await getTargetEndpoint('https://webmention.rocks/test/7'))
//   console.log('8', await getTargetEndpoint('https://webmention.rocks/test/8'))
//   console.log('9', await getTargetEndpoint('https://webmention.rocks/test/9'))
//   console.log('10', await getTargetEndpoint('https://webmention.rocks/test/10'))
//   console.log('11', await getTargetEndpoint('https://webmention.rocks/test/11'))
//   console.log('12', await getTargetEndpoint('https://webmention.rocks/test/12'))
//   console.log('13', await getTargetEndpoint('https://webmention.rocks/test/13'))
//   console.log('14', await getTargetEndpoint('https://webmention.rocks/test/14'))
//   console.log('15', await getTargetEndpoint('https://webmention.rocks/test/15'))
//   console.log('16', await getTargetEndpoint('https://webmention.rocks/test/16'))
//   console.log('17', await getTargetEndpoint('https://webmention.rocks/test/17'))
//   console.log('18', await getTargetEndpoint('https://webmention.rocks/test/18'))
//   console.log('19', await getTargetEndpoint('https://webmention.rocks/test/19'))
//   console.log('20', await getTargetEndpoint('https://webmention.rocks/test/20'))
//   console.log('21', await getTargetEndpoint('https://webmention.rocks/test/21'))
//   console.log('22', await getTargetEndpoint('https://webmention.rocks/test/22'))
//   console.log('23', await getTargetEndpoint('https://webmention.rocks/test/23/page'))
// })()

module.exports = getTargetEndpoint
