---
layout: post
title: Zitch of Light - CSS Border Animation
date: 2025-04-06T07:41:00.000Z
tags: css-trick
author: pery
---
Lately I wanted certain cards to stand out—with a zitch of glowing light circling the border🌀.
The can be on hover or when user scroll the page depend if it mobile or desktop (portrait or landscape mode).\
\
I considered two approaches:

* [`border-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image) + [`conic-gradient`](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/conic-gradient) (what I used)
   or [`offset-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path) with a moving dot (discarded, probably can give nice rotating effect for another project)
*

```css
@property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: true;
}

@keyframes rotate-in {
    100% { --angle: 360deg; }
}

.glow-border {
    border: 1px solid transparent;
    box-sizing: content-box;
    --color: hsl(200 100% 70%);
    --angle: 0deg;
    border-image-source: conic-gradient(
        from var(--angle),
        transparent,
        var(--color) 10deg 15deg,
        transparent 18deg
    );
    border-image-slice: 3;
    border-image-outset: 0.3em;
    animation: rotate-in 1s ease-in 1;
}
```
