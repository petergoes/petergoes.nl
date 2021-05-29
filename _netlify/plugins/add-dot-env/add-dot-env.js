const fs = require('fs')

module.exports = {
  onPreBuild: () => {
    fs.writeFileSync('.env', '', { encoding: 'utf-8' })
  }
}
