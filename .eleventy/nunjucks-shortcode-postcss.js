const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssImport = require('postcss-import')
const postcssCustomProperties = require('postcss-custom-properties')
const postcssCustomMedia = require('postcss-custom-media')

module.exports = async function(files, pageOutputFile, development) {
  const baseCssFile = 'css/main.css'
  const cssOutputFile = (pageOutputFile || '').replace('.html', '.css')
  const getFileContents = file => fs.readFileSync(path.join(__dirname, '../src/_includes', file), {encoding: "utf-8"})

  const mainContents = `${getFileContents(baseCssFile)}\n${files.map(file => `@import "../${file}";`).join('\n')}`

  const plugins = [
    postcssImport,
    postcssCustomProperties,
    postcssCustomMedia,
  ]

  const productionPlugins = [
    cssnano
  ]

  const pluginList = process.env.DEVELOPMENT === 'true'
    ? plugins
    : [...plugins, ...productionPlugins]

  let css = await postcss(pluginList)
    .process(mainContents, { from: path.join(__dirname, '../src/_includes', baseCssFile) })
    .then(result => result.css)

  if (development) {
    css = `/*\n${mainContents}\n*/\n\n${css}`
  }

  let fileName
  if (pageOutputFile) {
    fileName = path.join(__dirname, '..', cssOutputFile)
    const dir = fileName.replace(/\/(.[^\/]+)$/, '').replace(/\.$/, '')
    try {
      await mkdirp(dir)
    } catch (error) {
      console.log(`Could not create ${dir}`)
    }
    try {
      fs.writeFileSync(fileName, css, { encoding: 'utf-8' })
    } catch (error) {
      console.log(`Could not write ${fileName}`)
    }
  }

  return development
    ? `/*\n  ${fileName}\n*/\n${css}`
    : `/*CSS_REPLACE_WITH_START${fileName}CSS_REPLACE_WITH_END*/`
}
