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
      return `Note written on the ${dayjs(data.page.date).format('Do of MMMM, YYYY')}`
    }
  }
}
