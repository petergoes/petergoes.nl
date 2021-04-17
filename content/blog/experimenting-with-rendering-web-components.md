---
  title: Experimenting with rendering Web Components
  description: The start of my journey to render web components on the server
  tags: 
    - blog
    - web-components
  layout: blog
  date: 2019-03-23
  permalink: "{{ page.filePathStem }}"
---

## About this serie of posts
This is the start of my journey to render Web Components on the server. In it I will document the things I run in to. Things that work out. Things that do not work out. I see a great deal of potential in the adoption of web components because I believe that working with 'vanilla' web technologies will be more resilient, more stable, and better maintainable. Especially in the log run.

This series will be the blogs I write in documenting my process. I have no clue when to write something or when it is done, but we'll see!

I have quite some experience with building React and Vue applications. Especially Vue is something that I love to work with. Because it combines a component based workflow and it _feels_ really close to vanilla web technologies. Although in the end it is all compiled down to JavaScript, as a developer you write as if it were HTML, CSS and JavaScript. And to top it off, the tooling around these frameworks are top notch. Making the developer experience really really good in larger scale or complex sites / apps.

Then, Web Components caught my attention again. I did notice it when they were first introduced in 2011. But I never thought much of it. Until I recently did an experiment with them again. See if you can convert a VueJS component into a Web Component to use it in React. Turns out, you can do that! My colleague and I blogged about it [here](https://www.voorhoede.nl/en/blog/javascript-frameworks-meet-web-components/). That got me all exited again, especially since I noticed that [LitElement](https://lit-element.polymer-project.org/) and [LitHtml](https://lit-html.polymer-project.org/) are a thing now.

## The problem of server side rendering

Server side rendering is still an issue with Web Components. React, Vue and all those other frameworks have this covered. But for the `shadowDom`, there is not a standardised way of serialising that to send it over the wire. 

There are some experiments / solutions going on. Especially the [@skatejs/ssr](https://github.com/skatejs/skatejs/tree/master/packages/ssr) package by [@treshugart](https://twitter.com/treshugart) is really close.

I tried the `@skatejs/ssr` package, and I got the example sort of working. Not quite, though, and I am sure that is due to my lack of proper trying that out. I looked through the source code of the package and realised that it wasn't all that complicated. I could quickly see the concepts of what was going on. That together with the [talk](https://www.youtube.com/watch?v=yT-EsESAmgA&feature=youtu.be) Trey Shugart gave at the Polymer summit in 2017 I was inspired to roll my own implementation. Take a look at that talk, it is really good.

I think that rolling my own implementation is something that will teach me quite a bit about the bread and butter of Web Components. And as far as I currently am it is a fun exercise!

If you want to check out my progress thus far, you can find the repo [here](https://github.com/petergoes/ssr-web-components)