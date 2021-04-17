const dayjs = require('dayjs')

module.exports = function(value, format = 'DD-MM-YYYY') {
  return dayjs(value).format(format)
}
