---
layout: blog
permalink: "{{ page.filePathStem }}/index.html"
language: en
title: Looking at user stats increase my emotional connection with them
description: After measuring the browser capabilities of our actual users, I
  tend to raise the bar for when I use a CSS feature
tags:
  - blog
date: 2023-03-04T14:06:42.491Z
tweetUrl: ""
tootUrl: ""
---
It seems that the capabilities of CSS grow exponentially fast the last few years. With the [iterop](https://web.dev/interop-2022/) initiative making sure that features are consistent across browsers, life as a Front-end Dev is quite awesome.

Usually when I want to play with all these new toys, I look at [Can I Use](https://caniuse.com) to see if I can actually use them. But now that we are starting to build a complete design system from scratch, I want to know if I could use features like container queries or the `:has()` selector. It could, potentially, reduce the complexity of our components quite drastically.

## Looking at statistics from our actual users
I keep a close eye to the statistics from our analytics tool to see what browsers our readers use. However, we are very privacy conscious. We use a privacy friendly analytics tool (Matomo), respect the do not track header, track only the data we actually need. That does mean, however, that we don't know a lot about our users. The section 'unknown' in the browser engine section is quite large.

To actually make more informed decisions, I wrote a small script that test CSS features I care about and track those.
Now I have actual data from our users. But then I noticed something when I looked at the data.

## I care much more about stats from our actual users than nation wide stats
When I was primarily looking at Can I Use, there was no emotional connection. 85% of users did have Grid support? Great, start using it. Maybe not on critical things, so those 15% that do not have it do not suffer that much.

But now, I have stats like: 91% of our members browsers support the `:has()` selector. That means 9% of our members, which pay my salary, do not. All of a sudden that is quite a substantial amount!

I find it an even more exiting challenge to provide a base line which I can then progressively enhance. Because these stats remind me that our users are people, not a number.