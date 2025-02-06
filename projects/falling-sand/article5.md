# Building a Falling Sand Simulation with JavaScript and Canvas (Part 1)

In this article, we’ve built a **falling sand simulation** step by step, starting with a simple grid and gradually adding features like chunk-based operations, performance optimizations, and interactivity. Along the way, we’ve explored the challenges of simulating particle behavior and learned how to make the simulation smooth and responsive.

In this final section, we’ll add a **cool auto mouse press animation** to demonstrate the simulation in action and link to the full code and utilities on GitHub.

---

## Adding an Auto Mouse Press Animation

To make the simulation more engaging, let’s add an **auto mouse press animation** using HTML and CSS. This will simulate user interaction by automatically clicking on the canvas in a predefined pattern.

### HTML and CSS
Add a `div` element for the fake mouse and style it with CSS animations:

```html
<div id="mouse"></div>
<style>
  #mouse {
    position: absolute;
    animation: moveAlongPath 4s linear infinite alternate,
               moveAlongPath2 30s linear infinite alternate;
    offset-path: path("M25,50 C50,10 75,10 75,50 C75,90 25,90 25,50 Z");
  }

  @keyframes moveAlongPath {
    0% { offset-distance: 0%; }
    100% { offset-distance: 100%; }
  }

  @keyframes moveAlongPath2 {
    0% { left: 2em; }
    100% { left: calc(100% - 5em); }
  }
</style>
```

### JavaScript
Update the `pointer.onPress` logic to include the auto mouse press animation:

```javascript
var hsl = 0;
pointer.onPress = (({x, y}) => {
  let {width, height} = canvas.getBoundingClientRect();
  let ratioW = width / canvas.width;
  let ratioH = height / canvas.height;
  let cellX = Math.floor(x / (cellSize * ratioW));
  let cellY = Math.floor(y / (cellSize * ratioH));
  hsl = (hsl + 1) % 80;
  grid.setChunk2(30 + hsl, cellX, cellY, 0b101010101, 'pad');
});

// Start simulation
new FrameEngine(60, function () {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  grid.draw(ctx, cellSize, {
    strokeStyle: 'black',
  });
  update();
}).start();

// Auto mouse press animation
var fakeMouse = document.getElementById('mouse');
var animationMouse = new FrameEngine(60, function () {
  var {x, y} = fakeMouse.getBoundingClientRect();
  pointer.onPress({x, y});
}).start();

// Stop animation on user tap
pointer.onTap = e => animationMouse.stop();
```

---

## Exploring the Code

All the utilities used in this project, including the `FrameEngine`, are available in my [GitHub repository](https://github.com/perymimon/portofolio/tree/main/projects/_glossary). These tools were written from scratch and are designed to be modular and reusable. Here’s a quick overview of what’s included:

- **`FrameEngine`**: A utility for managing frame-based animations and updates.
- **`Pointer`**: A helper for handling mouse and touch input.
- **Math Utilities**: Functions like `randomItem` and `exceedsLimits` for common math operations.

Feel free to explore the repository and use these tools in your own projects!

---

## What’s Next?

In **Part 2**, we’ll dive deeper into the simulation by adding a new material called the **Matrix Material**. This material will introduce complex behaviors like:
- **Phasing through other materials**.
- **Dispersing and collapsing surrounding particles**.
- **Dynamic state transitions** based on interactions.

We’ll also explore how to extend the state machine to handle these new behaviors and make the simulation even more dynamic and interactive.

---

## Conclusion

In this article, we’ve built a falling sand simulation from scratch, starting with a simple grid and gradually adding features like chunk-based operations, performance optimizations, and interactivity. We’ve also added a cool auto mouse press animation to demonstrate the simulation in action.

You can find the full code on my [GitHub](https://github.com/perymimon/portofolio/tree/main/projects) and try the working demo [here](https://perymimon.github.io/portofolio/projects/falling-sand).

Stay tuned for **Part 2**, where we’ll add the Matrix Material and explore even more advanced simulation techniques. Happy coding! 😊
