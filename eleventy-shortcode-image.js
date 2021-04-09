const path = require('path')
const Image = require("@11ty/eleventy-img");

function getImage(src, widths, formats) {
  return Image(src, {
    outputDir: './_site/assets/img/',
    urlPath: "/assets/img/",
    widths,
    formats,
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
  
      return `${name}-${width}-${id}.${format}`;
    }
  });
}

async function shortcodeImageManifest(src) {
  let metadata = await getImage(src, [16, 32, 48, 72, 96, 144, 168, 192, 512], ['png'])

  const json = metadata.png.map(image => ({
    src: image.url,
    type: image.sourceType,
    sizes: `${image.width}x${image.height}`,
  }))

  return JSON.stringify(json, null, 2);
}

async function shortcodeSingleImageUrl(src, size, format) {
  let metadata = await getImage(src, [size], [format])
  return metadata[format][0].url
}

module.exports = {
  shortcodeImageManifest,
  shortcodeSingleImageUrl
}
