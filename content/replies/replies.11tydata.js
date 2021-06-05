const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

module.exports = {
  eleventyComputed: {
    title: (data) => {
      if (/index.md/.test(data.page.inputPath)) {
        return data.title
      }

      const title = /https?:\/\/(www.)?twitter.com\//.test(data.url)
        ? `@${data.url.replace(/^https?:\/\/(www.)?twitter.com\//, '').replace(/\/.+/, '')}`
        : data.url

      return `Reply to ${title}`
    }
  }
}
