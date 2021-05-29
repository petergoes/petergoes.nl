const { spawn } = require('child_process');
const fetch = require('node-fetch')




module.exports = {
  onSuccess: ({ utils }) => {
    const { git } = utils

    const changedPosts = [...git.modifiedFiles, ...git.createdFiles]
      .filter(file => /content\/[bookmarks|likes|replies|notes]/.test(file))
      .map(post => post.replace('content/', ''))
      .map(post => post.replace('.md', ''))
      .map(post => `http://petergoes.nl/${post}/`)
      .map(postUrl => {
        return new Promise((resolve, reject) => {
          console.log('Post url:', postUrl)
          const webmention = spawn('npx', ['webmention', postUrl, '--send']);
          let stdout = ''
          let stderr = ''
          webmention.stdout.on('data', (data) => {
            stdout += data
          });

          webmention.stderr.on('data', (data) => {
            stderr += data
          });

          webmention.on('close', (code) => {
            if (code !== 0) {
              console.log(stderr)
              return reject()
            }
            console.log(stdout)
            resolve()
          });
        })
      })

      return Promise.all(changedPosts)
  }
}
