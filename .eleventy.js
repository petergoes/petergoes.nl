const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const filterFormatDate = require('./eleventy-filter-format-date')
const transfromHtmlmin = require('./eleventy-transform-htmlmin')
const shortcodePostcss = require('./eleventy-nunjucks-shortcode-postcss')
const { shortcodeImageManifest, shortcodeSingleImageUrl } = require('./eleventy-shortcode-image')
require('dotenv-save').config()

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  eleventyConfig.addPassthroughCopy({ "_public": "/" });

  eleventyConfig.addTransform("htmlmin", transfromHtmlmin);

  eleventyConfig.addFilter("formatDate", filterFormatDate);

  eleventyConfig.addNunjucksAsyncShortcode("postcss", shortcodePostcss);
  eleventyConfig.addNunjucksAsyncShortcode("imageManifest", shortcodeImageManifest);
  eleventyConfig.addNunjucksAsyncShortcode("imageUrl", shortcodeSingleImageUrl);

  // You can return your Config object (optional).
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data"
    }
  };
};
