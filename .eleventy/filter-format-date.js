const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

module.exports = function(value, format = 'DD-MM-YYYY') {
  return dayjs(value).format(format)
}
