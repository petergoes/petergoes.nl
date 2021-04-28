import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob-promise'
import { PurgeCSS } from 'purgecss'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = await glob('_site/**/*.html')
const promises = htmlFiles
  .filter(file => /\/cms/.test(file) === false)
  .map(file => path.join(__dirname, file))
  .map(async htmlFile => {
    const findCssFile = /\/\*CSS_REPLACE_WITH_START(.+)CSS_REPLACE_WITH_END\*\//
    const htmlContents = await fs.readFile(htmlFile, { encoding: 'utf-8' })
    const [fullMatch, cssFile, ...rest] = findCssFile.exec(htmlContents)

    const purgeCSSResult = await new PurgeCSS().purge({
      content: [htmlFile],
      css: [cssFile],
    })

    const cssContents = purgeCSSResult && purgeCSSResult[0] && purgeCSSResult[0].css
    const updatedHtml = htmlContents.replace(fullMatch, cssContents)
    let writePromise
    try {
      writePromise = fs.writeFile(htmlFile, updatedHtml, { encoding: 'utf-8' })
    } catch (error) {
      console.log('could not write to ', htmlFile)
      writePromise = Promise.resolve()
    }

    let deletePromise
    try {
      deletePromise = fs.unlink(cssFile)
    } catch (error) {
      console.log('could not delete ', cssFile)
      deletePromise = Promise.resolve()
    }
    await Promise.all([writePromise, deletePromise])
  })

await Promise.all(promises)
