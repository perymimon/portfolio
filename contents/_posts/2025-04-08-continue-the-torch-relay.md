---
layout: post
author: pery
html: ""
title: Continue the torch relay
date: 2025-04-08T07:15:00.000Z
tags: "css "
code_html: >
  <span style="color:lightblue;"> Move you mouse hover the orbits to accselerte
  them</span>

  <div class="solar-system">
      <div class="sun"></div>
      
      <div class="orbit orbit-3"  style="--size:100px;--color:#7d70ba; --dur:8s;"></div>
      <div class="planet planet-3"  style="--size:100px;--color:#7d70ba;--dur:8s;"></div>
    
      <div class="orbit orbit-2"  style="--size:70px;--color:#4ecdc4; --dur:5s;"></div>
      <div class="planet planet-2"  style="--size:70px;--color:#4ecdc4; --dur:5s;"></div>
    
      <div class="orbit orbit-1" style="--size:40px;--color:#ff6b6b; --dur:3s;"></div>
      <div class="planet planet-1" style="--size:40px;--color:#ff6b6b;--dur:3s"></div>
  </div>

  <style>

  body {
    margin: 0;
    display: flex;
    flex-direction:column;
    gap:2em;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #0a0a2a;
  }  

  </style>  
code_css: >
  @keyframes orbit {
    from { rotate: 0deg; }
    to { rotate: 360deg;  }
  }


  .solar-system {
    display:grid;
    position: relative;
    justify-items: center;
    align-items: center;
    width: 300px;
    height: 300px;
  }


  .sun, .orbit, .planet {
    position: absolute;
    border-radius: 50%;
  }


  .sun {
    width: 20px;
    height: 20px;
    background-color: #ffcc00;
    box-shadow: 0 0 10px 2px #ffcc00;
  }


  .orbit {
    border: 1px dashed rgba(255, 255, 255, 0.2);
    width: calc(var(--size) * 2);
    aspect-ratio: 1;
    &:hover{
      box-shadow: inset 0px 0px 5px var(--color), 0px 0px 5px var(--color);
    }
  }


  .planet {
    width: 10px;
    height: 10px;
    transform-origin: calc(var(--size) * -1) 0;
    translate: var(--size) 0;
    background-color: var(--color);
    animation-composition: accumulate;
    animation: orbit var(--dur) linear infinite, orbit var(--dur) linear infinite;
    animation-play-state: running, paused;
  }


  .orbit:hover + .planet{
    animation-play-state: running, running;
  }
---

In my [About][1], I added the [Zitch of Light][2] effect around important sections. This animation is tied to mouse hover, but on mobile, the hover state isn’t reliable. So I connected it to page scroll instead. Then I realized — it actually looks good on desktop too.



This led me to a point where I needed both behaviors. That means running two animations simultaneously and somehow combining their results — something like `--angle = --a1 + --a2`. I tried using `@property` and animated variables, but it turned into a mess. Too many definitions, too many places for errors.



Luckily, I found a much simpler approach.



If I run both animations but set them to `paused` (i.e., not removed the `animation` keyword), their current state is saved. Then I can combine them using `animation-composition: accumulate;` — natively 💫



[1]: {{ "/projects/curriculum-vitae" | relative_url }}

[2]: {% post_url 2025-04-06-zitch-of-light %}
