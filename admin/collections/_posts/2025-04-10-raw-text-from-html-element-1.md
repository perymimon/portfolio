---
layout: post
title: Raw text from HTML Element
date:
  ? "{ now }"
author: pery
tags: text
---
It turns out that browsers silently encode text inside HTML.

Let’s say we have this piece of code:
```html
<div>
    <b>bold</b> & safe
</div>
```

Reading with `.innerHTML` often gives:
```html
&lt;b&gt;bold&lt;/b&gt; &amp; safe
```

Reading with `.textContent` gives:
```html
bold safe
```

**So what’s the solution?** → Use a `<textarea>`:

```js
function decodeHtmlEntities(html) {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = html
    return textarea.value
}
```

### Why does `<textarea>` do the trick? 
    

(from GPT):
> `<textarea>` treats `.innerHTML` as raw HTML and `.value` as plain text.
> Setting `textarea.innerHTML = "&lt;b&gt;"` stores encoded.
> Reading `textarea.value` returns decoded: `<b>`
> No rendering. No DOM parsing. Just plain text logic.
> Native, fast HTML decoder — no custom parser needed.

Amazing, right?
