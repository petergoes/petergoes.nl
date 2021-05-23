const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("eleventy-plugin-highlightjs");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const filterFormatDate = require('./eleventy-filter-format-date')
const filterRemove = require('./eleventy-filter-remove')
const filterTagsInCollection = require('./eleventy-filter-tags-in-collection')
const filterWebMentions = require('./eleventy-filter-webmentions')
const transfromHtmlmin = require('./eleventy-transform-htmlmin')
const shortcodePostcss = require('./eleventy-nunjucks-shortcode-postcss')
const { shortcodeImageManifest, shortcodeSingleImageUrl, shortcodeFeaturedImage } = require('./eleventy-shortcode-image')
require('dotenv-save').config()

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight, { className: "hljs-block" });
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  eleventyConfig.addPassthroughCopy({ "src/_public": "/" });
  eleventyConfig.addPassthroughCopy("src/_includes/**/*.js");

  eleventyConfig.addTransform("htmlmin", transfromHtmlmin);

  eleventyConfig.addFilter("formatDate", filterFormatDate);
  eleventyConfig.addFilter("remove", filterRemove);
  eleventyConfig.addFilter("tagsInCollection", filterTagsInCollection);
  Object.keys(filterWebMentions).forEach(filterName => {
    eleventyConfig.addFilter(filterName, filterWebMentions[filterName])
  })

  eleventyConfig.addNunjucksAsyncShortcode("postcss", shortcodePostcss);
  eleventyConfig.addNunjucksAsyncShortcode("imageManifest", shortcodeImageManifest);
  eleventyConfig.addNunjucksAsyncShortcode("imageUrl", shortcodeSingleImageUrl);
  eleventyConfig.addNunjucksAsyncShortcode("featuredImage", shortcodeFeaturedImage);

  // You can return your Config object (optional).
  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "../src/_includes",
      data: "../src/_data"
    }
  };
};