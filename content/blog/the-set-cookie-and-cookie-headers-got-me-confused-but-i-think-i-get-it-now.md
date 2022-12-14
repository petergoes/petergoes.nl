---
layout: blog
permalink: "{{ page.filePathStem }}/index.html"
language: en
title: The Set-Cookie and Cookie headers got me confused, but I think I get it now
description: The Set-Cookie and Cookie headers are being set in different
  situations and under different circumstances. They serve completely different
  purposes, but it took me a while to figure that out!
tags:
  - blog
  - cookies
date: 2022-12-14T19:56:05.743Z
tweetUrl: ""
tootUrl: https://social.petergoes.nl/@petergoes/109514210633832432
---
I learned a thing or two about cookies today... It took me quite a while to figure it out, but I think I understand it now.

I am rebuilding a website from an old PHP / Twig setup into something more modern. The PHP backend is still in use, but I wanted to separate the front-end and rebuild that with Remix. The backend gets slowly transferred into an API only backend that my Remix server is going to communicate with.

Authentication is done via cookies, but since I now have a Remix server between the client and the API, I need to perform the requests to the backend with the session cookies from the user. Having the Remix server in between allows me to do a couple of requests to the API without going all the way back to the client for each response. But that means getting and sending cookies along as well.

The problem I faced was this: When I create a user, I also need to store the country that user lives in. For the user, that is one form to will out: `username`, `password`, `countryCode`. But the backend wants to store the `countryCode` via a separate request. So first create the user, then update that user via an other endpoint with the country code. But only an authenticated user can update their country code. 

I needed to get the session cookie from the `createUser` endpoint, and provide that to the `updateCountry` endpoint right after.

## `Set-Cookie` and `Cookie` are two different things
It took me a while before I realised that the server **sends** a `Set-Cookie` header to the browser, but **expects** a `Cookie` header when receiving.

When I figured that out, it was a matter of getting the `Set-Cookie` header, and passing it as `Cookie`, right? No, that did not work at all.

Looking at the original requests from the legacy codebase, each request to the backend has a `Cookie` _request_ header with some information (`session=s3ss10n1d` for example). But multiple cookies can be stored for a domain, so the value can also be: `session=s3ss10n1d; setting=theme-blue`. Right, a header, cookies split via `; `. I get that.

Looking at the _response_ headers though, there were multiple `Set-Cookie` headers. One for each cookie, each of that with the following shape: `cookieName=cookieValue; expires=Thu, 01-Jan-1970 00:00:01 GMT; Max-Age=0; path=/; domain=.some-site.com; secure; HttpOnly; SameSite=Lax`. Ok, the cookie has a name / value combo and some attributes separated by a `; `. I get that as well.

### Reading response headers
The [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) contains a `headers` property that is an instance of [Header](https://developer.mozilla.org/en-US/docs/Web/API/Headers). You can use it to query values of response headers via `header.get()`. From the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Headers/get):

> If the header has multiple values associated with it, the byte string will contain all the values, in the order they were added to the Headers object

The code example with it:

```js
myHeaders.get('Accept-Encoding'); // Returns "deflate, gzip"
myHeaders.get('Accept-Encoding').split(',').map((v) => v.trimStart()); // Returns [ "deflate", "gzip" ]
```

That does not seem so hard... Let's have one more close look at the `Set-Cookie` value: `cookieName=cookieValue; expires=Thu, 01-Jan-1970 00:00:01 GMT; Max-Age=0; path=/; domain=.some-site.com; secure; HttpOnly; SameSite=Lax`. Please notice the `expires` value: `Thu, 01-jan...`. That `,` right there is the sole reason a good amount of hours wasted.

Parsing the `Set-Cookie` header with a library finally solved the problem I had.

## Lessons learned

1. A server **sends** multiple `Set-Cookie` headers where each header contains a cookie with additional attributes, split by `; `.
2. A server **expects** a single `Cookie` header where each cookie is represented via `name=value` split by a `; `.
3. For the love of all that is dear to you, use some libraries for dealing with the `Set-Cookie` header. I ended up using [cookie](https://github.com/jshttp/cookie) and (more importantly) [set-cookie-parser](https://github.com/nfriedly/set-cookie-parser).