const fs = require('fs')

module.exports = {
  onPreBuild: () => {
    try {
      if(!fs.existsSync('.env')) {
        fs.writeFileSync('.env', '', { encoding: 'utf-8' })
      }
    } catch (err) {
      console.error(err);
    }
  }
}
