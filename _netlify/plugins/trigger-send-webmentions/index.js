const fs = require('fs')
const { spawn } = require('child_process');
const fetch = require('node-fetch')

module.exports = {
  onSuccess: ({ utils }) => {
    require('dotenv-save').config()
    const { git } = utils

    const changedPosts = [...git.modifiedFiles, ...git.createdFiles]
      .filter(file => /content\/[bookmarks|likes|replies|notes]/.test(file))
      .map(post => post.replace('content/', ''))
      .map(post => post.replace('.md', ''))
      .map(post => `http://petergoes.nl/${post}/`)
      .map(postUrl => 
        fetch(
          `https://webmention.app/check?token=${process.env.WEBMENTION_APP_TOKEN}&url=${postUrl}`,
          {
            method: 'POST'
          })
          .then(response => response.text())
      )

      return Promise.all(changedPosts)
          .then(responses => responses.forEach(console.log))
  }
}
