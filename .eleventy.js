const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const htmlmin = require("html-minifier");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssImport = require('postcss-import')
const postcssMediaVariables = require('postcss-media-variables')
const postcssCustomProperties = require('postcss-custom-properties')
require('dotenv-save').config()

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  eleventyConfig.addPassthroughCopy({ "_public": "/" });

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addFilter("formatDate", function(value) {
    const date = new Date(value)
    const day = `${date.getDate()}`.padStart(2, '0')
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const year = `${date.getFullYear()}`
    return `${day}-${month}-${year}`
  });

  eleventyConfig.addNunjucksAsyncShortcode("postcss", async function(files, pageOutputFile, external) {
    const baseCssFile = 'css/main.css'
    const cssOutputFile = (pageOutputFile || '').replace('.html', '.css')
    const getFileContents = file => fs.readFileSync(path.join(__dirname, '_includes', file), {encoding: "utf-8"})

    const mainContents = `${getFileContents(baseCssFile)}\n${files.map(file => `@import '../${file}';\n`)}`

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

    const css = await postcss(pluginList)
      .process(mainContents, { from: path.join(__dirname, '_includes', baseCssFile) })
      .then(result => result.css)

    let fileName
    if (pageOutputFile) {
      fileName = path.join(__dirname, cssOutputFile)
      const dir = fileName.replace(/\/(.[^\/]+)$/, '').replace(/\.$/, '')
      await mkdirp(dir)
      fs.writeFileSync(fileName, css, { encoding: 'utf-8' })
    }

    return external
      ? cssOutputFile.replace('_site', '')
      : `/* CSS_REPLACE_WITH ${fileName} */`

  });

  // You can return your Config object (optional).
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data"
    }
  };
};
