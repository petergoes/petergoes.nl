module.exports = {
  eleventyComputed: {
    title: (data) => {
      if (/index.md/.test(data.page.inputPath)) {
        return data.title
      }
      return `Like of ${data.url}`
    }
  }
}
