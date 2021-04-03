const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(inclusiveLangPlugin);

  // You can return your Config object (optional).
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data"
    }
  };
};
