---
	title: Differentiate SSR states in a Web Component
	description: Can the mounted() function of a Vue component be mimicked in a Web Component?
	view: blog
	published: true
	created_at: 15-04-2019
---

## The problem

After my [previous blog post](/blog/my-stab-at-rendering-shadow-dom-server-side), I ended up in a discussion with [@harmenjanssen](https://twitter.com/harmenjanssen) in which he made the following point:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Most components will need Javascript to function, *after* needing Javascript to render, is what I mean. So using SSR to implement the JS *rendering* would leave the user in a sort of semi-enhanced experience?<br>At least I need some examples that show otherwise.</p>&mdash; Harmen Janssen (@harmenjanssen) <a href="https://twitter.com/harmenjanssen/status/1110196955672645632?ref_src=twsrc%5Etfw">March 25, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This got me thinking. I am used to writing Vue components. I use [Nuxt](https://nuxtjs.org) to server side render my applications and I did not encounter much issues like Harmen described.

Sure, we have created a `<no-ssr>` Vue component at [De Voorhoede](https://www.voorhoede.nl), but generally speaking, I don't think about it all that much. Most of the time it Just Works™️. 

To understand the point of view of Harmen, let's dive into [a blog post](https://grrr.tech/posts/hansel/) he wrote recently. I encourage you to read the post, it's really good. But the gist of it is this. By using the [enhancer pattern](https://hiddedevries.nl/en/blog/2015-04-03-progressive-enhancement-with-handlers-and-enhancers) you enhance a piece of html with JavaScript to make it interactive.

I don't know the stack Harmen uses, but my guess would be that a cms outputs html. The client side (vanilla) JavaScript then kicks in and enhances that html. My assumption is that the cms is not using a front-end framework like Vue or React to build that html. It is a vastly different approach to outputting html via a front-end framework like Vue or React where the same JavaScript runs both on the server and client (and JavaScript is the main language to write the component in).

In my attempt to server side render Web Components, the process is like this:

1. Write the component
2. Fire up a puppeteer instance and enhance it via server side JavaScript
3. Send the rendered component to the client
4. On the client, the component gets hydrated letting client side JavaScript take over

If you compare this flow to the workflow of enhancing html client side, my process enhances the component too early. As long as the client does not have the JavaScript downloaded, **the components html is enhanced, but does not have JavaScript yet to back it up**. That is the "semi-enhanced experience" Harmen is talking about.

How does a front-end framework like Vue handle this? Why did I not encounter this issue more often before?

## Life cycle methods in Vue

I take Vue as an example here since I have the most experience with it, but the concepts apply to React as well. 

A Vue component has the concept of life cycle methods. During various stages of its life, various methods are run. Let's look at the `mounted()` method. The [documentation](https://vuejs.org/v2/api/#mounted) of the `mounted` method tells us: 

> Called after the instance has been mounted

So, when the component is mounted in the DOM, this method is called. But a little further down, the documentation states:

> *This hook is not called during server-side rendering.*

So the `mounted` method only runs client side. This gives you the ability to make a difference between what is rendered server side, and what happens client side.

Further more, since Vue handles its components server side as well as client side, it can treat them differently based on the context.

When compared to the enhancer pattern, there are quite a lot of states a component can be in, in Vue. To name a few: 

* before-anything-happens server side
* rendered server side
* rendered server side on the client
* mounted on the client

Looking at the enhancer pattern there are only two states:

* non enhanced client side
* enhanced client side

As it turns out, I did encounter the issue before, but because Vue as a framework makes working with components both on server and client side so easy, I do not have to think about the differences between server and client environments. That is kind of the whole reason to go for a universal JavaScript approach in the first place.

In my attempt to render Web Components server side, I did not take the work Vue does here into account. Because I don't treat server and client environments as two separate environments, I actually spin up a client IN the server to render the output.

## Life cycle hooks in Web Components

But wait a minute, Web Components have life cycle hooks of their own. They are called [Custom Element Reactions](https://developers.google.com/web/fundamentals/web-components/customelements#reactions). There is a `constructor` and a `connectedCallback` among others. The `connectedCallback` maps to Vues `mounted` pretty close. From the documentation:

> Called every time the element is inserted into the DOM

That does not help me all that much though. I am still using an actual client when rendering server side. So although the `mounted` hook is not called server side in Vue. `connectedCallback` **does** get called in my implementation.

_sigh..._

So what are the options now? I really want this server side render thing I am building to _not_ introduce any new api by creating some sort of base class which you have to extend in order to get server side rendering working. It should work on any Web Component. 

## Using what I already have

But then I looked at what I am already doing to the component and realised, I have the answer right here. In fact. I already wrote it!

When I serialise a component server side, I include an attribute to the element: `data-ssr="serialized"`. When the hydration script takes over that attribute is updated to: `data-ssr="hydrated"`. So now I _do_ know which state my component is in!

Lets look at an example:

```js
class LifeCycle extends HTMLElement {
    static get observedAttributes() {
        return ['data-ssr'];
      }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <h1>I am server side rendered</h1>
        `
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-ssr' && newValue === 'hydrated') {
            this.shadowRoot.querySelector('h1').innerText = 'I am client side renderd'
        }
    }
}
window.customElements.define('x-life-cycle', LifeCycle);
```

What happens here: I listen for changes to the `data-ssr` attribute. When it does change I know I am on the client because the hydrate script sets it to `hydrated`.

Now I can update the component like I would in a `mounted` method in a Vue component.

## Closing thoughts

Is this an ideal solution? **No** far from it. The `data-ssr` attribute is something that I came up with, and it only works if you render the component server side with _my_ tool. It is by no means standardised. 

But, it gets the job done. And as long as there is no standardised way of server side rendering a Web Component, we will be tied to custom implementations like this one.

So, now that I got that out of my head, I am going to focus on serialising the css of the Web Component. That is something I am struggling with for quite some time now. 