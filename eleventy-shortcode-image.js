const fs = require('fs')
const path = require('path')
const Image = require("@11ty/eleventy-img");
const splitStringInTspans = require('./_utils/split-string-in-tspans')

const featuredImageFallback = fs.readFileSync(path.join(__dirname, '_assets/featured-image-fallback.svg'), {encoding: 'utf-8'})
const featuredImageSvg = fs.readFileSync(path.join(__dirname, '_assets/featured-image-mockup.svg'), {encoding: 'utf-8'})

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

async function shortcodeFeaturedImage(page, title, fallback, category) {
  if (page.outputPath) {
    const outputFileName = 'featured-image.png'
    const outputDir = fallback
      ? './_site/assets/img/'
      : `./_site/${page.filePathStem.replace('/index', '')}`
    const buffer = fallback
      ? Buffer.from(featuredImageFallback)
      : Buffer.from(featuredImageSvg.replace('PAGE_TITLE', splitStringInTspans(title, category)))
    const outputUrl = `${outputDir}/${outputFileName}`
    const urlPath = outputDir.replace('./_site', '')
    const image = await new Image(buffer, {
      formats: ['png'],
      widths: [1000],
      outputDir,
      urlPath,
      filenameFormat: id => `${id}-${outputFileName}`
    })
    return `${image.png[0].url}`
  }
  return 'other'
}

module.exports = {
  shortcodeImageManifest,
  shortcodeSingleImageUrl,
  shortcodeFeaturedImage,
}
