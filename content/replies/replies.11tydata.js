const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

module.exports = {
  eleventyComputed: {
    title: (data) => {
      if (/index.md/.test(data.page.inputPath)) {
        if (data.pagination && data.pagination.hrefs.length > 1) {
          const currentPageNumber = data.pagination.pageNumber
          const totalPages = data.pagination.hrefs.length
  
          return `${data.title} (Page ${currentPageNumber + 1} of ${totalPages})`
        }

        return data.title
      }

      const title = /https?:\/\/(www.)?twitter.com\//.test(data.url)
        ? `@${data.url.replace(/^https?:\/\/(www.)?twitter.com\//, '').replace(/\/.+/, '')}`
        : data.url

      return `Reply to ${title}`
    }
  }
}
