---
layout: post
title: Raw text from HTML Element
date:
  ? "{ now }"
author: pery
tags: text
---

It turn out that Browsers silently encode text inside HTML.
let assume we have this pice of code
```html
<div>
    <b>bold</b> & safe
</div>
```

Reading from `.innerHTML` often gives this:
```html
  &lt;b&gt;bold&lt;/b&gt; &amp; safe
```
and reading from `.textContent` gives this:
```html
bold safe
```

So what is the solution ? → use `textAreaElement`

```js
function decodeHtmlEntities(html) {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = html
    return textarea.value
}
```
why textarea element do the trick ? by GPT

>Because `<textarea/>` treats .innerHTML as raw HTML and .value as plain text.
>Browser uses it internally to decode entities:
>Setting textarea.innerHTML = "&lt;b&gt;" → stores encoded
>Reading textarea.value → gives decoded: `<b>`
>No rendering. No DOM parsing. Just plain text logic.
> It's a native, fast HTML decoder — no custom parser needed.

Amazing right?
