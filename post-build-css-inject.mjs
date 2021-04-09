import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob-promise'
import { PurgeCSS } from 'purgecss'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = await glob('_site/**/*.html')
const promises = htmlFiles
  .map(file => path.join(__dirname, file))
  .map(async htmlFile => {
    const findCssFile = /\/\*\sCSS_REPLACE_WITH\s(.+)\s\*\//
    const htmlContents = await fs.readFile(htmlFile, { encoding: 'utf-8' })
    const [fullMatch, cssFile] = findCssFile.exec(htmlContents)

    const purgeCSSResult = await new PurgeCSS().purge({
      content: [htmlFile],
      css: [cssFile]
    })

    const cssContents = purgeCSSResult[0].css
    const updatedHtml = htmlContents.replace(fullMatch, cssContents)
    const writePromise = fs.writeFile(htmlFile, updatedHtml, { encoding: 'utf-8' })
    const deletePromise = fs.unlink(cssFile)
    await Promise.all([writePromise, deletePromise])
  })

await Promise.all(promises)
