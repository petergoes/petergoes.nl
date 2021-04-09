const fs = require('fs')
const path = require('path')
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  eleventyConfig.addPassthroughCopy({ "_public": "/" });

  eleventyConfig.addFilter("json", function(value) {
    JSON.stringify(value, null, 2)
  });

  eleventyConfig.addFilter("formatDate", function(value) {
    const date = new Date(value)
    const day = `${date.getDate()}`.padStart(2, '0')
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const year = `${date.getFullYear()}`
    return `${day}-${month}-${year}`
  });


  eleventyConfig.addFilter("postcss", function(files) {
    const getFileContents = file => fs.readFileSync(path.join(__dirname, '_includes', file), {encoding: "utf-8"})
    return files
      .map(getFileContents)
      .join('\n')
  })

  // You can return your Config object (optional).
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data"
    }
  };
};
