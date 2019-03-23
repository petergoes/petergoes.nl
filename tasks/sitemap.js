const fs = require('fs')
const glob = require('glob')
const { paths, sitemap } = require('./config.js')
const { site } = require('../config/site')

glob(paths.dist.html.indexes, (err, matches) => {
    const urls = matches
        .map(path => path.replace('index.html', ''))
        .map(path => path.replace('./dist', ''))
        .filter(path => !sitemap.excludes.includes(path))
        .map(path => `${site.url}${path}`)
        .map(url => url.replace(/\/$/, ''))
    
    fs.writeFile(
        paths.dist.sitemap,
        urls.join('\n'),
        { encoding: 'utf8' },
        err => {
            err 
                ? console.error(err)
                : console.log('Sitemap written')
        })
})

