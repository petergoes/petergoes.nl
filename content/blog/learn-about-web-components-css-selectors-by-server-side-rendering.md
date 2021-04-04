---
  title: Learn about Web Components CSS selectors by server side rendering
  description: Can the mounted() function of a Vue component be mimicked in a Web Component?
  tags: ["blog", "web-components"]
  layout: blog
  date: 2019-04-27
---

## New CSS selectors in Web Components

One of the most useful features of the Shadow DOM specification, is **scoped CSS**. The styles defined in the Shadow DOM don't leak out to the containing page. But within the Shadow DOM you CAN get a sense of the surrounding context of the Custom Element. To make the latter possible, some new selectors have been introduced. In this post, I will explain how I learned about some of these new selectors, focusing on the `:host()`, `:host-context()` and `::slotted()`.

In a previous blog posts I focussed on [serialising the HTML of the Shadow DOM](https://www.petergoes.nl/blog/my-stab-at-rendering-shadow-dom-server-side). But these new CSS selectors should also be transformed and placed in the main document. Because, as long as the Web Component did not load on the client yet, its styles will not show up.

So somehow I needed to transform the selectors from the Shadow DOM styles and move these styles into the main document (or Light DOM). That process taught me quite a lot about how these new selectors work!

## A quick recap of serialising the HTML

To serialise the Shadow DOM I go through this process:
1. Launch Puppeteer and load a page containing Web Components
2. For every Web Component:
	1. Find the rendered Shadow DOM
	2. Find the Light DOM contained in the element
	3. Move the Light DOM into a `<template>` element
	4. Move the (rendered) Shadow DOM in the place of the Light DOM
	5. Add a couple of attributes indicating the state of the serialising process
3. Add a rehydrate script to the page which will run on the client undoing all the work above

