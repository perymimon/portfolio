---
layout: post
title: Raw text from HTML Element
date: 2025-04-10T12:01:00.000Z
author: pery
tags: html
code_html: |-
  <div id="test">
    <b>bold</b> & safe
  </div>
  <div id="result1"></div>
  <div id="result2"></div>
  <script>
      result1.textContent = test.innerHTML;
      result2.textContent = test.textContent;
  </script>
---
Sounds obvious, right? It turns out that browsers silently encode text inside HTML.
<!--more-->



What is mean. Let’s say we have this piece of code:

```html
<div>
    <b>bold</b> & safe
</div>
```

Reading with `.innerHTML` often gives:

```html
'\n  <b>bold</b> &amp; safe\n'
```

Reading with `.textContent` gives:

```html
\n  bold & safe\n
```

**So how to got the raw text from that element? what’s the solution?** Using a `<textarea>`:

```js
function decodeHtmlEntities(html) {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = html
    return textarea.value
}
```

### Why does `<textarea>` do the trick?

> (from GPT):
> `<textarea>` treats `.innerHTML` as raw HTML and `.value` as plain text.
> Setting `textarea.innerHTML = "&lt;b&gt;"` stores encoded.
> Reading `textarea.value` returns decoded: `<b>`
> No rendering. No DOM parsing. Just plain text logic.
> Native, fast HTML decoder — no custom parser needed.

Amazing, right?
