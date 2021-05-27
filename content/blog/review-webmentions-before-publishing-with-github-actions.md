---
layout: blog
permalink: "{{ page.filePathStem }}/index.html"
title: Review incoming WebMentions before publishing with Github Actions
description: How I automatically generate PR's when WebMentions are received
tags:
  - blog
  - webmentions
  - github actions
date: 2021-05-26T19:10:17.049Z
tweetUrl: https://twitter.com/petergoes/status/1397632362926772228
tootUrl: https://toot.cafe/@petergoes/106309292601460064
---

Recently I added [webmentions](https://indieweb.org/webmention) to this blog. 
Which is completely static. It is build with [Eleventy](https://11ty.dev),
and hosted on [Netlify](https:www.netlify.com).

## Accepting Webmentions in the first place

Accepting webmentions for a static site is relatively straight forward. I 
followed the article [An In-Depth Tutorial of Webmentions + Eleventy](https://sia.codes/posts/webmentions-eleventy-in-depth/)
to do so. And was quite happy with the results.

But there are a few things I did not liked about it:

1. I want incomming mentions to be published as soon as possible, without the 
   need for client-side JavaScript. Something needs to trigger the build.
2. I want to be in full control of the content placed on this site. Accepting 
   webmentions is awesome, but I want to be able moderate them.

## Using a Github Action to create a Pull Request with new mentions

I use [webmention.io](https://webmention.io) to receive my mentions. The service
comes with an API with which I can retrieve them.

I created a Github Action to periodically fetch my mentions and write each of 
them to a file.

When the Github Action runs, it should: 
1. Fetch my web mentions from the API
2. Store each of them in a seperate json file
3. Create a Pull Request with the new and changed files

### Fetching and storing new Web Mentions
   
The (trimmed down version of the) fetching and storing logic comes down to this:

```js
const mentionsFolder = './mentions'

fetch(`https://webmention.io/api/mentions.jf2?token=<MY-TOKEN>&per-page=10000`)
  .then(response => response.json())
  .then(data => data.children)
  .then(mentions => mentions.forEach(writeMentionToFile))

function writeMentionToFile(mention) {
  const id = mention['wm-id']
  const targetPostPath = mention['wm-target'].replace('https://www.petergoes.nl', '')
  const outputFolder = path.join(mentionsFolder, targetPostPath)

  fs.writeFileSync(
    path.join(outputFolder, `${id}.json`),
    JSON.stringify(mention, null, 2),
    { encoding: 'utf-8' }
  )
}
```

I left out some checks here and there.  
This is the full [store-webmentions.mjs](https://github.com/petergoes/petergoes.nl/blob/main/_automations/store-webmentions.mjs) 
file.

Any webmention is stored as a json file in the `mentions/` folder. If a mention exists, it gets overwritten with the new content. Updating
that mention.

### The Github Action

Lets look at the actions .yml file.

```yaml
name: Webmentions

on:
  schedule:
    - cron: "0 0 * * *"

jobs:
  webmentions:
    steps:
      - name: Check out repository
        uses: actions/checkout@master

      - name: Set up Node.js
        uses: actions/setup-node@master

      - name: Install dependencies
        run: npm install

      - name: Fetch webmentions
        env:
          WEBMENTION_IO_TOKEN: <<WEBMENTION_IO_TOKEN>>
        run: node ./_automations/store-webmentions.mjs

      - name: Create Pull Request
        id: cpr
        uses: peter-evans/create-pull-request@v3
        with:
          token: <<GITHUB_TOKEN>>
          commit-message: Update WebMentions
          assignees: petergoes
          title: Update Webmentions
          body: Update Webmentions
```

This is the [full webmentions.yml file](https://github.com/petergoes/petergoes.nl/blob/main/.github/workflows/webmentions.yml).

I set the schedule to run the action every day at midnight. New mentions are
automatically pulled in at least once a day.

When there are new mentions, the [Create Pull Request](https://github.com/peter-evans/create-pull-request) 
action commits these changes and generates a Pull Request. If there are no new
mentions, it does nothing.

This works fine, but we can take it one step further.

## Run the Github Action when a new mention is received

Instead of doing this once a day, it would be nice if this action runs anytime
a new mention is posted. The webmention.io service provides the option to call a
webhook when a new mention is posted. Nice!

Github Actions can be configured so that they are triggerd via a webhook. Sounds like
a match made in heaven. 

To set this up, I followed the guide [GitHub Actions Trigger Via Webhooks](https://mainawycliffe.dev/blog/github-actions-trigger-via-webhooks).

Lets first configure the Github Action to run when a webhook is called:

```diff
 on:
+  repository_dispatch:
+    types: [Received Webmention]
   schedule:
     - cron: "0 0 * * *"
```

To run the action, I need to make a POST request to: `https://api.github.com/repos/petergoes/petergoes.nl/dispatches`.
The body of the request needs to contain a type I defined in the .yml file, and 
I have to include a token in the `Authorization` header.

The full request looks like this:

```js
fetch(
  'https://api.github.com/repos/petergoes/petergoes.nl/dispatches',
  {
    method: 'POST',
    headers: {
      Authorization: `token <GITHUB_TOKEN>`
    },
    body: '{ "event_type": "Received Webmention" }'
  }
)
```

That does not match the data structure I get from the webmentions.io webhook...

### Use a Netlify function to call the Github Action

The last piece of the puzzel is a Netlify function which receives the webhook 
request from webmention.io, when that is valid, it calls the endpoint on Github
to trigger the Github Action

The Netlify function looks like this:

```js
const fetch = require('node-fetch')

exports.handler = async function (event, context) {

  // The payload from webmention.io is configured to contain a secret
  const { secret } = JSON.parse(event.body)

  // Make sure that it is known to the Netlify Function so no one else can call
  // this function
  if (secret !== process.env.WEBMENTION_IO_SECRET) {
    return { statusCode: 401 }
  }

  // Trigger the Github Action
  const response = await fetch(
    'https://api.github.com/repos/petergoes/petergoes.nl/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `token <GITHUB_TOKEN>`
      },
      body: '{ "event_type": "Received Webmention" }'
    }
  )

  return { statusCode: 200, body: 'ok' }
}
```

See [the full Netlify Function](https://github.com/petergoes/petergoes.nl/blob/main/.netlify/functions/trigger-pr-workflow.js) here

And thats it! That are a lot of steps. But when you post a webmention, or like the
tweet on Twitter, you should see a PR in the [Pull Request section on GitHub](https://github.com/petergoes/petergoes.nl/pulls)
in a few minutes!