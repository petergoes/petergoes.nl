const { map } = require('lodash');
const sendWebmentionForChangedPost = require('./send-webmention-for-changed-posts')

const feedurl = 'https://www.petergoes.nl/webmentions-to-send-feed.xml'
const webmentionAppEndpoint = `https://webmention.app/check?token=${process.env.WEBMENTION_APP_TOKEN}`

module.exports = {
  onSuccess: async ({ utils }) => {

    require('dotenv-save').config()
    const { git } = utils

    const changedFiles = [
      ...git.modifiedFiles.filter(file => !/content\/replies|notes/.test(file)),
      ...git.createdFiles
    ]
    const changedPosts = changedFiles
      .filter(file => /content\/[bookmarks|likes|replies|notes]/.test(file))
      
    console.log('Changed files:', changedFiles)
      
    if (changedPosts.length > 0) {
      console.log('Changed posts:', changedPosts)
      sendWebmentionForChangedPost(changedPosts)

      // await Promise.all(promises)
      //       .then((results) => {
      //         results.forEach(item => console.log(JSON.stringify(item, null, 2)))
      //       })
      // return fetch(
      //   `https://webmention.app/check?token=${process.env.WEBMENTION_APP_TOKEN}&url=${feedurl}&limit=1`,
      //   {
      //     method: 'POST'
      //   })
      //   .then(response => response.json())
      //   .then(data => data.urls.forEach(item => {
      //     try {
      //       console.log(JSON.stringify(item, null, 2))
      //     } catch (error) {
      //       console.error(error)
      //     }
      //   }))
    } else {
      console.log('')
      console.log('No posts changed')
    }
  }
}
