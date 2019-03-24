---
	title: My stab at rendering Shadow Dom server side
	description: The first step in server side rendering web components is getting the Shadow Dom over the wire. This is my attempt.
	view: blog
	published: true
	created_at: 24-03-2019
---

## What is the Shadow Dom and why is it important?

The [Shadow Dom](https://www.w3.org/TR/shadow-dom/) is a specification that [CanIUse](https://caniuse.com/#search=shadow%20dom) summarises as: 

> Method of establishing and maintaining functional boundaries between DOM trees and how these trees interact with each other within a document, thus enabling better functional encapsulation within the DOM & CSS. - [CanIUse.com](https://caniuse.com)

An element can have its own DOM which is hidden or inaccessible from the outside. Think of the `<video>` element. All controls; the play button, the volume controls, the play head, are all DOM elements. You can't see or modify them because they live in the Shadow Dom of the element. The Shadow Dom in a `<video>` element has a mode of `'closed'`. 

A Web Component that you write can also have its own Shadow Dom. As a component author you can set its mode to `'closed'` (like the `<video>` element) or `'open'`. When it's `'open'` you can inspect it in your DevTools or interact with it via JavaScript. It is important to note that the Shadow Dom gets created when the Web Component is connected, and that it is not part of the DOM that gets downloaded with rest of the HTML. In other words, when the browser downloads an HTML file, the Shadow Dom is not included.

## Why do I want to render a Web Components Shadow Dom server side?

The kind of projects I typically do are static site generated websites. Which can be enhanced with JavaScript when that is loaded, but as much as all functionality should be usable without JavaScript.

If I approach Web Components the same way that I would with a Vue Component, most of the markup I write ends up in the Shadow Dom. And by default, that won't get shipped with the HTML file. I would NEED the Web Component to be downloaded and parsed in order for the Shadow Dom to exist. That kind of goes against the idea of not relying on JavaScript.

## Serialising the Shadow Dom

So, I need to come up with a way to transfer the Shadow Dom with the rest of the HTML. In my previous blog post ([Experimenting with rendering Web Components](https://www.petergoes.nl/blog/experimenting-with-rendering-web-components)) I explain that I took a lot of inspiration from [@treshugart](https://twitter.com/treshugart)'s [@skatejs/ssr](https://github.com/skatejs/skatejs/tree/master/packages/ssr).

Let me explain my approach, which is quite similar, but I can afford to use [Puppeteer](https://github.com/GoogleChrome/puppeteer) because I pre-render all my pages during build time.

### The problem

Lets look at the Shadow Dom of an `<x-hello>` Web Component:

```html
<x-html>
  World                  <!-- Light DOM -->
  #shadow-root(open)     <!-- Thing made up by DevTools -->
    <span>               <!-- Element in the Shadow DOM -->
      Hello
      <strong>
		    <slot>       <!-- Special element to host Light Dom -->
		      <#text>    <!-- reference to Light DOM -->
		    </slot>
		  </strong>
		  !
    </span>
</x-html>
```

As you can see DevTools visualises the Shadow DOM, but that is just so you can inspect it. It does not actually exist.

As a quick reference, as a user of the `<x-hello>` element this is how it looks in the source code:

```html
<x-hello>World</x-hello>
```

As you can see from the Shadow Dom example, the word _World_ is between `<strong>` tags, so it is displayed in bold. The word _Hello_ is also within the Shadow DOM. It's rendered, but when the Web Component has connected.

And like I said before, the Shadow DOM is not part of the HTML. So how do we let a non JavaScript browser know that it should render _World_ in bold, or _Hello_ at all?

### Breaking down the problem

I have the luxury that I can use [Puppeteer](https://github.com/GoogleChrome/puppeteer). Puppeteer is a headless Chrome browser, and Chrome happens to have support for Shadow DOM.

I can fire up a Puppeteer instance, load up my page, and then have it do things. Things like this:

<small>Quick note, I will explain only the concepts here using simplified code. If you want to take a look at the actual code, checkout my progress thus far in the repo [here](https://github.com/petergoes/ssr-web-components/tree/0d1b6d5121faf4009a70fed2e657b2c034307695). All references to the files in the repo, I will do at the current commit at the time of writing. It is not necessarily the most recent version of the file.</small>

First I need to get access to the `load`ed page

```js
const puppeteer = require('puppeteer')
const serialize = require('./lib/serialize')
const hydrate = require('./lib/hydrate')

(async (fileName) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  page.on('load', async onLoad (...args) => {
    /* Do things with the loaded HTML */
    
    /* Get the modified HTML */
    
    /* Write the modified HTML to a new file */
  })

  await page.goto('file://' + path.join(__dirname, fileName))
})('/public/index.html')
```

Lets fill in the blanks here

#### 1. Do things with the loaded HTML

This is the meat of the whole process. First lets get into the browser context

```js
await page.$eval('html', serialize)
```

`serialize` is a module I required from the `lib/` folder earlier and this is what it does ([here](https://github.com/petergoes/ssr-web-components/blob/0d1b6d5121faf4009a70fed2e657b2c034307695/lib/serialize.js) you can find the whole file):

```js
module.exports = function serialize (rootNode) {
  
  function serializeNode(node) {
    /* will explain later */
	} 
  
  [...rootNode.querySelectorAll('*')]
    .filter(element => /-/.test(element.nodeName))
    .forEach(serializeNode)
}
```

1. I get all the elements in the current `rootNode` (when it first runs, that would be `<html>`
2. I filter out all elements that do NOT have a `-` in their `nodeName`. Custom Elements are required to have a `-` in their tag name.
3. For each Custom Element I run the `serializeNode` function

** `serializeNode`: **

```js
function serializeNode (node) {
  const lightDomNodes = node.childNodes
  const lightDomHtml = node.innerHTML
  const templateDom = document.createElement('template')
  const scriptData = document.createElement('script')
  const slot = node.shadowRoot.querySelector('slot')
  const attributesProperties = node.getAttributeNames()
    .filter(name => name !== 'data-ssr')
    .reduce((obj, name) => {
      return {...obj, [name]: node[name] }
    }, {})

  templateDom.setAttribute('type', 'ssr-light-dom')
  templateDom.innerHTML = lightDomHtml

  scriptData.setAttribute('type', 'ssr-data')
  scriptData.innerHTML = JSON.stringify(attributesProperties)
  
  // ...
}
```

1. Get a reference to the current Light DOM (elements as well as `innerHTML`)
2. Create `template` and `script` tags
3. Get a reference to the `<slot>` element
4. Get a JSON object with all attributes with their value

Then:

```js
function serializeNode (node) {
  // ...

  /* move light nodes into shadowDom */
  lightDomNodes.forEach(lightNode => slot.parentNode.insertBefore(lightNode, slot))

  /* move shadowDom into root node */
  node.shadowRoot.childNodes.forEach(shadowNode => node.appendChild(shadowNode))

  /* remove slot element */
  if (slot) {
    slot.parentNode.removeChild(slot)
  }

  /* serialize custom element child nodes */
  serialize(node)

  /* add original lightDom as template */
  if (templateDom.innerHTML !== '') {
    node.appendChild(templateDom)
  }

  /* add the data as script */
  if (scriptData.innerHTML !== '{}') {
    node.appendChild(scriptData)
  }

  node.setAttribute('data-ssr', 'serialized')
}
```

1. Move Light DOM before the `<slot>` element of the Shadow DOM. The browser will also (sort of) move the Light DOM into the Shadow DOM. So let's mimic that. I don't place it inside of the `<slot>` because I will remove the `<slot>` later on
2. Move the (current) Shadow DOM (with the Light DOM added to it) into the Light DOM. We need to send the Shadow DOM over the wire. By placing its contents inside the Light DOM, its contents no longer are part of the Shadow DOM but become Light DOM
3. Remove the obsolete `<slot>` element
4. Trigger the same routine for the now-in-Light-DOM-elements as they might contain other Custom Elements
5. Add the original Light DOM in a `<template>` element. We need to preserve the original Light DOM because in the browser we should be able to reset everything to its original state
6. Add the (JSON) object containing all data as well to it to will gets send down the wire
7. Mark this Custom Element as `'serialized'` so the `hydrate` script in the browser knows this elements needs some work.

I move the original Light DOM inside of a `<template>` element, because the browser won't touch anything inside a `<template>`. In other words, it won't render duplicate content.

#### Get the modified HTML

Now that I am done with modifying the HTML in the browser context, let's get back in the Puppeteer script. I need the modified HTML:

```js
page.on('load', async (...args) => {
  // ...
  const pageContent = await page.content()
  // ...
})
```

Now I have the modified HTML in the Puppeteer context

#### Write the modified HTML to a new file

Lets write the modified HTML to the target file

```js
page.on('load', async (...args) => {
  // ...
  fs.writeFile(
    path.join(__dirname, fileName.replace('.html', '.ssr.html')),
    pageContent.replace('</body>', `${hydrate}</body>`),
    {encoding: 'utf8'},
    async (err) => {
      await browser.close();
    }
  )
})
```

1. Replace the current file extension to `*.ssr.html` so we know that this file is the modified version
2. Yet another slight mutation to the HTML: include the `hydrate` script.
3. When all is done, close the browser

So! Thats that! We now have a server side rendered version of all Web Components in a Light DOM fashion. Note that I did not do anything with CSS yet. I just focused on serialising the HTML!! The CSS part is something I still have to figure out.

But the browser has all these capabilities. It would be a shame to not use them. Lets have a look at the hydrate script to see how the process can be reverted client side

### Hydrate client side

```js
function hydrate() {
  [...document.querySelectorAll('[data-ssr="serialized"]')]
    .forEach(el => {
      const lightDom = el.querySelector('[type="ssr-light-dom"]')
      const lightDomContent = lightDom.content
      const dataElement = el.querySelector('[type="ssr-data"]')
      const dataContent = dataElement.innerText
      const data = JSON.parse(dataContent)

      el.childNodes.forEach(node => {
        if (node !== lightDom) {
          node.parentElement.removeChild(node)
        }
      })

      lightDomContent.childNodes.forEach(node => el.appendChild(node))
      lightDom.parentElement.removeChild(lightDom)
      dataElement.parentElement.removeChild(dataElement)
      Object.keys(data).forEach(key => {
        el[key] = data[key]
      })

      el.setAttribute('data-ssr', 'hydrated')
      }
    )
}

module.exports = `<script>${hydrate.toString()}; hydrate();</script>`
```

That is the script at once. I simplified it a bit by removing some is-this-value-non-empty-checks. The original source is [here](https://github.com/petergoes/ssr-web-components/blob/0d1b6d5121faf4009a70fed2e657b2c034307695/lib/hydrate.js) This is going on:

1. Get all elements on the page with a `[data-ssr="serialized"]` attribute.
2. For each element do:
3. Get a reference to the `<template>` and `<script>` elements and their contents, in the current Web Component element
4. Remove all elements except the `<template>`. Basically remove all would-be-Shadow-DOM
5. Move all elements in the `<template>` element (original Light DOM) back into their original place
6. Remove the now empty `<template>` element and `<script>` element
7. Loop over the data object to add all properties to the Web Components properties. This makes sure Array and Object properties are set via JavaScript
8. Update the `data-ssr` attribute to `'hydrated'` to indicate that this Web Component has been hydrated

And that's all there is to it. I am sure I can improve this code quite a lot. But it gets me started.

If you want to have a look at the full code, check out the repo [here](https://github.com/petergoes/ssr-web-components/tree/0d1b6d5121faf4009a70fed2e657b2c034307695).

Do you have any comments? Reach out to me at [@petergoes](https://twitter.com/petergoes)!