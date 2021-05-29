module.exports = {
  onSuccess: ({ constants }) => {
    await fetch(
      'https://api.github.com/repos/petergoes/petergoes.nl/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `token ${process.env.GITHUB_PAT}`
        },
        body: '{ "event_type": "Build success" }'
      }
    )
  },
}
