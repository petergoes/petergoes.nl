const fs = require('fs')
const { spawn } = require('child_process');
const fetch = require('node-fetch')

const feedurl = 'https://www.petergoes.nl/webmentions-to-send-feed.xml'

module.exports = {
  onSuccess: ({ utils }) => {

    require('dotenv-save').config()
    const { git } = utils

    const changedFiles = [...git.modifiedFiles, ...git.createdFiles]
    const changedPosts = changedFiles
      .filter(file => /content\/[bookmarks|likes|replies|notes]/.test(file))
      
    console.log('Changed files:', changedFiles)
      
    if (changedPosts.length > 0) {
      console.log('Changed posts:', changedPosts)
      return fetch(
        `https://webmention.app/check?token=${process.env.WEBMENTION_APP_TOKEN}&url=${feedurl}&limit=1`,
        {
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => data.urls.forEach(item => {
          console.log(`Source: ${item.source}`)
          console.log(`Target: ${item.target}`)
          console.log(`Endpoint: ${item.endpoint.url} (${item.endpoint.type})`)
        }))
    } else {
      console.log('No posts changed')
    }
  }
}
