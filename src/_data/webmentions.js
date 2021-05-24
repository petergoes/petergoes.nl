const fs = require('fs')
const path = require('path')
const glob = require('glob-promise')

const mentionsFolder = path.join(__dirname, '../../mentions')

module.exports = async function () {
  const files = await glob('**/*.json', { cwd: mentionsFolder })
  const children = files
    .map(filePath => fs.readFileSync(path.join(mentionsFolder, filePath), { encoding: 'utf-8' }))
    .map(contents => JSON.parse(contents))

  return { children }
}
