const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

module.exports = {
  eleventyComputed: {
    title: (data) => {
      if (/index.md/.test(data.page.inputPath)) {
        return data.title
      }
      return `Note written on the ${dayjs(data.page.date).format('Do of MMMM, YYYY')}`
    }
  }
}
