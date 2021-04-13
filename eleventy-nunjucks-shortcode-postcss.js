const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssImport = require('postcss-import')
const postcssMediaVariables = require('postcss-media-variables')
const postcssCustomProperties = require('postcss-custom-properties')

module.exports = async function(files, pageOutputFile, development) {
  const baseCssFile = 'css/main.css'
  const cssOutputFile = (pageOutputFile || '').replace('.html', '.css')
  const getFileContents = file => fs.readFileSync(path.join(__dirname, '_includes', file), {encoding: "utf-8"})

  const mainContents = `${getFileContents(baseCssFile)}\n${files.map(file => `@import "../${file}";`).join('\n')}`

  const plugins = [
    postcssImport,
    postcssMediaVariables,
    postcssCustomProperties,
    postcssMediaVariables,
  ]

  const productionPlugins = [
    cssnano
  ]

  const pluginList = process.env.DEVELOPMENT === 'true'
    ? plugins
    : [...plugins, ...productionPlugins]

  let css = await postcss(pluginList)
    .process(mainContents, { from: path.join(__dirname, '_includes', baseCssFile) })
    .then(result => result.css)

  if (development) {
    css = `/*\n${mainContents}\n*/\n\n${css}`
  }

  let fileName
  if (pageOutputFile) {
    fileName = path.join(__dirname, cssOutputFile)
    const dir = fileName.replace(/\/(.[^\/]+)$/, '').replace(/\.$/, '')
    await mkdirp(dir)
    fs.writeFileSync(fileName, css, { encoding: 'utf-8' })
  }

  return development
    ? `/*\n  ${fileName}\n*/\n${css}`
    : `/*CSS_REPLACE_WITH_START${fileName}CSS_REPLACE_WITH_END*/`
}
