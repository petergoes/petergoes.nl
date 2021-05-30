const fs = require('fs')
const { spawn } = require('child_process');
const fetch = require('node-fetch')

const feedurl = 'https://www.petergoes.nl/likes/feed.xml'

module.exports = {
  onSuccess: ({ utils }) => {

    require('dotenv-save').config()
    const { git } = utils

    const changedFiles = [...git.modifiedFiles, ...git.createdFiles]
    const changedPosts = changedFiles
      .filter(file => /content\/[bookmarks|likes|replies|notes]/.test(file))
      
    console.log({ changedFiles })
      
    if (changedFiles.length > 0) {
      console.log({ changedPosts })
      return fetch(
        `https://webmention.app/check?token=${process.env.WEBMENTION_APP_TOKEN}&url=${feedurl}`,
        {
          method: 'GET'
        })
        .then(response => response.text())
        .then(data => console.log(data))
    }
  }
}
