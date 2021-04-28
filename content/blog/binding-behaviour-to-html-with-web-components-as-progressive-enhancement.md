---
layout: blog
permalink: "{{ page.filePathStem }}/index.html"
title: Binding behaviour to HTML with Web Components as Progressive Enhancement
description: An enhancement on the enhancer / handler pattern for JavaScript
tags:
  - blog
  - webcomponents
date: 2021-04-28T17:48:36.052Z
tweetUrl: https://twitter.com/petergoes/status/1387491272869523456
---
For a couple of years now, I have been working with front-end frameworks almost exclusively. At [De Voorhoede](https://www.voorhoede.nl), we adopted the componentised way of working early on. We moved from binding JavaScript to the DOM via `data-*` attributes on to using Angular.JS and from there to React and Vue. 

Each step of the way felt like a great step forwards. The concept of components spoke to me because I could focus on a single feature and have all relevant parts close by. The HTML, CSS and JavaScript moved closer and closer together, making it easier to work on isolated features / UI elements. The tooling became better and better. For the bigger projects that we do, this way of working fits us good.

But the downside is that it requires a lot of build steps, and results in pretty heavy JavaScript bundles.

For smaller (or simpeler) sites, that do not require a lot of JavaScript (like this website), a large Front-end framework is overkill. The question becomes again: "How do you manage JavaScript when you use a HTML templating language?"

The folks over at [Grrr](https://grrr.nl) (checkout [Grrr's tech blog](https://grrr.tech)!), have released  
[Hansel](https://github.com/grrr-amsterdam/hansel) to deal with this. I have used that for a couple of projects, and I like the philosophy behind it. But for this website, I wanted a build step free developer experience. By using a small set of features of the Custom Elements spec, I think I hit the sweet spot.

## Componentised UI with a HTML templating engine

To explain the concept, I'll use the [`tag-list` component](https://github.com/petergoes/petergoes.nl/tree/main/_includes/components/tag-list) from the [/bookmarks](/bookmarks) page. On this page, I'll store bookmarks, which have _tags_ on them. The tags are not yet displayed when I write this though. 

Besides the big list of all bookmarks, I wanted a way to filter them by tag. Eleventy gave me a hard time in doing this during build time. Because of that, I wanted to do it with JavaScript.

First, lets look at the template side:

{% raw %}
```twig
<my-tag-list class="tag-list">
  <details>
    <summary>All tags ({{ tags.length }})</summary>
    <ul class="tag-list__list">
      {% for tag in tags %}
        <li class="tag-list__item">
          <a
             class="tag"
             href="/bookmarks/tags/{{ tag.slug | slug }}/"
          >
          {{ tag.label }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </details>
</my-tag-list>
```
{% endraw %}

A `details`/`summary` combination is used to show / hide the tags. Nunjucks templating is used to render the tags. For each tag, a link to an overview page of that tag is rendered.

But to see anything when you clink on that link, you'll have to have JavaScript enabled. Not only enabled, but it should be run in a browser which can run ES6. Because the page `/bookmarks/tags/:tagName` requirers it.

I want to hide the whole tag list from users that do not have JavaScript enabled, but display it to users that do.

The CSS for this logic looks like this:

```css
.tag-list {
  min-height: var(--line-height);
}

.tag-list details {
  display: none;
}

.tag-list--show details {
  display: initial;
}
```

First I define the `.tag-list` class. It gets a `min-height` because I want to reserve space for the `summary` when it will appear. That way, it does reflow the page when the component is loaded.

Next, I hide the whole `details` element. Users without JavaScript will not know it's there.

But then I define the `.tag-list--show` selector which resets the hiding of the `details` element. I need to apply that class with JavaScript.

This is how I do that with JavaScript:

```js
class MyTagList extends HTMLElement {
  connectedCallback() {
    this.classList.add('tag-list--show')
  }
}

customElements.define('my-tag-list', MyTagList)
```

Here I define the Custom Element `MyTagList`. When the element is mounted into the DOM, the `connectedCallback` fires. Because this is a Custom Element, the `this` refers to the _instance_ of `my-tag-list` in the DOM. Within the `connectedCallback` I can do as much DOM manipulation as I please. It is guaranteed that all the DOM inside the `my-tag-list` element is ready.

Using a Custom Element here provides me with a couple of benefits:

## Benefits
- I don't have to write the boilerplate code of `querySelect`-ing elements matching a data attribute and triggering functions
- When elements are dynamically added to the page, I don't have to rerun that boilerplate code
- By using Custom Elements, I need to provide the `type="module"` attribute when I load the script. This means, that older browsers do not run that code at all. I don't have to worry about transpiling my code back to ES5.

## Closing thoughts
This is a small example, but I hope it illustrates the use case. I am sure there are downsides to this method but, for now, I like it and want to try it out on more projects.

What do you think? Did I mis anything?