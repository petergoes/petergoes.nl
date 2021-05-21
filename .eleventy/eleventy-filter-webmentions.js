const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

module.exports = {
  getWebmentionsForUrl: (webmentions, url) => {
    return webmentions.children.filter(entry => entry['wm-target'] === url)
  },
  size: (mentions) => {
    return !mentions ? 0 : mentions.length
  },
  webmentionsByType: (mentions, mentionType) => {
    if (Array.isArray(mentionType)) {
      return Object.values(mentions
        .filter(entry => {
          const keys = Object.keys(entry)
          const foundTypes = keys.filter(key => mentionType.includes(key))
          return foundTypes.length > 0
        })
        .reduce((collection, item) => {
          return {...collection, [item.author.url]: item}
        }, {}))
    }
    
    return mentions.filter(entry => !!entry[mentionType])
  },
  readableDateFromISO: (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") => {
    return dayjs.format(formatStr);
  },

  removeSyndication: (mentions, syndicationLink) => {
    return mentions.filter(mention => mention.url !== syndicationLink)
  }
}
