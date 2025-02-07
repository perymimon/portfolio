![Falling sand cover](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/snon1km9z43i9940hfju.png)


# Building a Falling Sand Simulation with JavaScript and Canvas

In this article, we’ll explore how to build a **falling sand simulation** using JavaScript and the HTML5 Canvas API. We’ll start with a simple implementation, identify its limitations, and iteratively improve it step by step. By the end, you’ll have a smooth, interactive simulation that you can tweak and expand.

You can find the full code on my [GitHub](https://github.com/perymimon/portofolio/tree/main/projects/falling-sand) and try the working demo [here](https://perymimon.github.io/portofolio/projects/falling-sand/1).

<iframe src="https://perymimon.github.io/portofolio/projects/falling-sand/1"></iframe>

---

### Table of Contents
1. [Introduction](#introduction)
2. [Step 1: A Simple Grid](#step-1-a-simple-grid)
3. [Step 2: Adding Falling Sand](#step-2-adding-falling-sand)
4. [Step 3: Introducing Chunks](#step-3-introducing-chunks)
5. [Step 4: Making It Interactive and color the sand](#step-4:-making-it-interactive-and-color-the-sand)
6. [Step 5: Final touch: Adding an Auto Mouse Press Animation](#step-5:-final-touch:-adding-an-auto-mouse-press-animation)
7. [Final Code](#final-code)
8. [Extra: Optimizing Performance](#optimizing-performance)
9. [What’s Next?](#what’s-next)
10. [Conclusion](#conclusion)

---

### Introduction

Falling sand simulations are a type of cellular automata where particles (like sand, water, or fire) move and interact based on simple rules. These simulations are visually captivating and can be used in games, art, or educational tools.

In this project, we’ll use a **grid-based approach** to simulate falling sand. We’ll start with a basic grid, add sand particles, and gradually improve the simulation to make it nice and interactive.

---

### Step 1: A Simple Grid

Let’s start by creating an HTML page with a basic `canvas` element, a CSS file, and a JavaScript file.

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<style>
  body {
    display: flex;
    place-items: center;
  }
 
  canvas {
    width: 100dvw;
    height: 100dvh;
    aspect-ratio: 1;
    background-color: #331212;
  }
</style>
<head>
    <meta charset="UTF-8">
    <title>Falling Sand</title>
</head>
<body>
    <canvas id="canvas1"></canvas>
    <script type="module" src="falling-sand.js"></script>
</body>
</html>
```

For now, our JavaScript file will just initialize a basic grid to represent our simulation world. Each cell in the grid can be either empty (`0`) or filled with sand (`1`).

**falling-sand.js**
```javascript
import Grid from './Grid.js';

```

**Grid.js**
```javascript
export default class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
    }

    index(x, y) {
        return y * this.width + x;
    }

    getCell(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.cells[this.index(x, y)];
        }
        return 1; // Padding for out-of-bounds
    }

    setCell(x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.cells[this.index(x, y)] = value;
        }
    }
}
```

This grid is simple but effective. It handles out-of-bounds cells with padding of `1`.

---

### Step 2: Adding Falling Sand
Ok , Lets create a small grid 4X4 put grain of sand in the cell(2,1) and  draw  the grid to the screen by adding draw ability to Grid class.

**falling-sand.js**
```javascript
import Grid from './Grid.js';
const grid = new Grid(4, 4)
grid.setCell(2, 1, 1); // Place a sand particle

grid.draw(ctx, 20); // Render initial state
```
**Grid.js**
```javascript
export default class Grid {
    //....
    draw(ctx, cellSize) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = 'yellow'
        ctx.strokeStyle = 'white'
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
                if (this.getCell(x, y) === 1) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                }
            }
        }
    }
}
````
It everything go well and i not missing anything you should see a 4X4 grid  like this 


### Making the cell fall

let’s make the sand particles fall downward. We’ll update the grid in a animation loop, checking each cell and moving sand particles if the cell below them is empty.

**falling-sand.js**
```javascript
import Grid from './Grid.js';
const grid = new Grid(4, 4)
grid.setCell(2, 1, 1); // Place a sand particle

grid.draw(ctx, 20); // Render initial state

function update(grid) {
    for (let y = grid.height - 1; y >= 0; y--) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.getCell(x, y) === 1 && grid.getCell(x, y + 1) === 0) {
                grid.setCell(x, y, 0);
                grid.setCell(x, y + 1, 1);
            }
        }
    }
}

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
const cellSize = 10;
canvas.width = cols * cellSize
canvas.height = rows * cellSize
// Start simulation
function animation (timeStamp) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    update()
    Grid.draw(ctx, cellSize)
    requestAnimationFrame(animation)
}
requestAnimationFrame(animation)
```

This is simple and works, but if we want to add complex behavior like making the sand slide left or right when it possible, it quickly becomes complex and by adding more custom rules and Check cheks it will potentially slow for large grids.
---

### Step 3: Introducing Chunks

To improve performance and add more complex behavior,instead of using complex nested `if`s we’ll introduce **state-based operations**. A state is a chunk of 3x3 neighborhood of cells around the target cell that we can treat as a single unit. This is useful for implementing cellular automata rules.

the chunk can represent as a series of 9 chars but In this code, we treat the chunk as a series of 9 bits, or in other word a number between `0` and `511`. Because we have just one material (`sand`), let’s treat `0` as an empty cell and `1` as a full cell (with sand). For example:

```
000 // 3 cells above the target cell
010 // left cell, target cell, right cell
111 // 3 cells under the target cell
```

This can be written in JavaScript as `0b000_010_111` (or `0b111_010_000`, depending on the implementation).

**Grid.js**
```javascript
export default class Grid {
    //...

    getChunk (x, y) {
        let number = 0;
        let bit = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const cell = this.getCell(x + dx, y + dy);
                number |= cell << bit;
                bit++;
            }
        }
        return number;
    }

    setChunk (x, y, pattern) {
        let bit = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const value = (pattern >> bit) & 1;
                this.setCell(x + dx, y + dy, value);
                bit++;
            }
        }
    }
}
```

With chunks, we can define rules for how sand particles interact with their neighbors. For example, sand can fall diagonally if the cell below is blocked.
so lets do that : 

#### State Machine
The state machine maps the current state of a cell’s neighborhood to its next state. For simplicity, let’s define just the last 3 bits of the chunk as the state we care about.

```js
const stateMachine = new Map();
stateMachine.set(0b000, 0b010); // Fall down
stateMachine.set(0b001, 0b010); // Fall down
stateMachine.set(0b010, [0b100, 0b001]); // Randomly fall left or right
stateMachine.set(0b011, 0b100); // Fall left
stateMachine.set(0b100, 0b010); // Fall down
stateMachine.set(0b101, 0b010); // Fall down
stateMachine.set(0b110, 0b001); // Fall right
stateMachine.set(0b111, 0b010_000); // Stay in place
```

And lets update the `update` function to read a cell put it into the `stateMachine` and put back the state into the grid

```javascript
function update(grid) {
    for (let i = 0; i < grid.cells.length; i++) {
        const {x, y} = grid.xy(i);
        const cell = grid.getCell(x, y);
        if (!cell) continue;

        const state = grid.getChunk(x, y);
        let newState = stateMachine.get(state);
        if (Array.isArray(newState)) newState = randomItem(newState);
        grid.setChunk(x, y, newState);
    }
    
}
```
If you're running the code now you should see the grain of sand falling and stack to the ground. it not do infinity looping because we padding the outbond of the grid with 1 in the `grid.getCell` function.

that cool right ? 
 but it we more cool then that . if you put 3 grain of sand in the same column you should see them fall flat on the surface

```js
grid.setCell(2, 0, 1); // Place a sand particle
grid.setCell(2, 1, 1); // Place a sand particle
grid.setCell(2, 2, 1); // Place a sand particle
```

That is really cool .

### Step 4: Making It Interactive and color the sand

Our grid is very small 4X4, let bigger it to nice size of 400 X 400 and let’s make the simulation interactive by allowing users to add sand particles with a mouse click. I use the `Pointer` class from my collection, which you can find and copy [here](https://github.com/perymimon/portofolio/blob/main/projects/_glossary/Pointer.js).

```javascript
var pointer = new Pointer(canvas);
var hsl = 0
pointer.onPress = (({x, y}) => {
    const {width, height} = canvas.getBoundingClientRect();
    const ratioW = width / canvas.width;
    const ratioH = height / canvas.height;
    const cellX = Math.floor(x / (cellSize * ratioW));
    const cellY = Math.floor(y / (cellSize * ratioH));
    hsl = (hsl+1) % 80
    grid.setCell( cellX, cellY, 30 + hsl); // Add colorer sand
});
```

To make it work you need also update the `grid.draw` method of the grid, and the `grid.getChunk`

**Grid.js**
```javascript
export default class Grid {
   getChunk (x, y) {
     //...
     number |= (!!cell) << bit
     //...
   }
   //...
    draw(ctx, cellSize) {
     //...
     if (this.getCell(x, y) === 1) {
      ctx.fillStyle= `hsl(${cell} 50% 50% )` // <-- add this line
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
     }
    }
}
```


Now, users can draw sand particles directly onto the grid and watch them fall and interact.

### Step 5: Final touch: Adding an Auto Mouse Press Animation 

But how you user will know that it can be interacting?  
To make the falling-sand more engaging and guide the user to interact with it, let’s add an **auto mouse press animation** using HTML and CSS. This will simulate user interaction by automatically clicking on the canvas in a predefined pattern.
For that we go back to the HTML and update it a bit.

Add a `div` element for the fake mouse and style it with CSS animations:

```html
//...
//...
<canvas id="canvas1"></canvas>
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

Now the Div moved according to the css animation . what we are do is the track after it and call `onPress` psado event on the coordinates of the div

**falling-sand.js**
```javascript
//... 
// Auto mouse press animation
var fakeMouse = document.getElementById('mouse');

var trackingLoop = requstAnimationFrame(trakPointer)

function trakPointer() {
 var {x, y} = fakeMouse.getBoundingClientRect();
 pointer.onPress({x, y});
 trackingLoop = requstAnimationFrame(trakPointer)
}
// Stop animation on user tap
pointer.onTap = e => cancelAnimationFrame(trackingLoop)
```

Feel free to play with the CSS animation and give the `<div>` more life or any shape you like. You can even use AI to create path animations or custom mouse shapes.

#### Final Code

**falling-sand.js**
```javascript
import Grid from './Grid.js';
const grid = new Grid(400, 400)

function update(grid) {
    for (let y = grid.height - 1; y >= 0; y--) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.getCell(x, y) === 1 && grid.getCell(x, y + 1) === 0) {
                grid.setCell(x, y, 0);
                grid.setCell(x, y + 1, 1);
            }
        }
    }
}

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
const cellSize = 10;
canvas.width = cols * cellSize
canvas.height = rows * cellSize
// Start simulation
function animation (timeStamp) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    update()
    Grid.draw(ctx, cellSize)
    requestAnimationFrame(animation)
}
requestAnimationFrame(animation)

var pointer = new Pointer(canvas);
pointer.onPress = (({x, y}) => {
    const {width, height} = canvas.getBoundingClientRect();
    const ratioW = width / canvas.width;
    const ratioH = height / canvas.height;
    const cellX = Math.floor(x / (cellSize * ratioW));
    const cellY = Math.floor(y / (cellSize * ratioH));
    grid.setCell(cellX, cellY, 1); // Add sand
});

```
**Grid.js**
```javascript
export default class Grid {
 constructor(width, height) {
  this.width = width;
  this.height = height;
  this.cells = new Uint8Array(width * height);
 }

 index(x, y) {
  return y * this.width + x;
 }

 getCell(x, y) {
  if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
   return this.cells[this.index(x, y)];
  }
  return 1; // Padding for out-of-bounds
 }

 setCell(x, y, value) {
  if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
   this.cells[this.index(x, y)] = value;
  }
 }
 getChunk (x, y) {
  let number = 0;
  let bit = 0;

  for (let dy = -1; dy <= 1; dy++) {
   for (let dx = -1; dx <= 1; dx++) {
    const cell = this.getCell(x + dx, y + dy);
    number |= (!!cell) << bit;
    bit++;
   }
  }
  return number;
 }

 setChunk (x, y, pattern) {
  let bit = 0;
  for (let dy = -1; dy <= 1; dy++) {
   for (let dx = -1; dx <= 1; dx++) {
    const value = (pattern >> bit) & 1;
    this.setCell(x + dx, y + dy, value);
    bit++;
   }
  }
 }
 draw(ctx, cellSize) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = 'yellow'
  ctx.strokeStyle = 'white'
  for (let y = 0; y < this.height; y++) {
   for (let x = 0; x < this.width; x++) {
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
    if (this.getCell(x, y) === 1) {
     ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
   }
  }
 }
}
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Falling Sand</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="canvas1"></canvas>
  <script type="module" src="falling-sand.js"></script>
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
</body>
</html>
````

### Optimizing Performance

To control more precisely on the speed of the animation you can limit the update rate with the [`FrameEngine`](https://github.com/perymimon/portofolio/blob/main/projects/_glossary/FrameEngine.js) from my repository

```js
import FrameEngine from "https://perymimon.github.io/portofolio/projects/_glossary/FrameEngine.js" // or copy it

new FrameEngine(60 /*or 10 fps*/, function () {
 ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
 grid.draw(ctx, cellSize, {
  strokeStyle: 'black',
 })
 update()
}).start()
```

On uge grid To make the simulation run smoothly you can use **double buffering**  

```javascript
const cols = 400, rows = 400
var grid = new Grid(cols, rows)
var nextGrid = new Grid(cols, rows)

function swapBuffers () {
 let temp = nextGrid
 nextGrid = grid
 grid = temp
 nextGrid.clear()
}
function update () {
    console.time('update') 
    for (let i = 0; i < grid.cells.length; i++) {
     let {x, y} = grid.xy(i)
     let cell = grid.getCell(x, y)
     if (!cell) continue

     const state = grid.getChunk(x, y);
     let newState = stateMachine.get(state)
     if (Array.isArray(newState)) newState = randomItem(newState)
     nextGrid.setChunk(x, y, newState);
    }
    swapBuffers()
    console.timeEnd('update')
}
```
This approach ensures that the simulation runs at a consistent frame rate, even for large grids.

---

### Exploring the Code

All the utilities used in this project, including the `FrameEngine` and the `Pointer`, are available in my [GitHub repository](https://github.com/perymimon/portofolio/blob/main/projects/_glossary/FrameEngine.js). These tools were written from scratch and are designed to be modular and reusable. Here’s a quick overview of what’s included:

- **`FrameEngine`**: A utility for managing frame-based animations and updates.
- **`Pointer`**: A helper for handling mouse and touch input.

Feel free to explore the repository and use these tools in your own projects by copying and pasting the files or use one of cdns that scattered the internet (no compiler needed).

---

### What’s Next?

In **Part 2**, we’ll dive deeper into the simulation by adding a new material called the **Matrix Material**. This material will introduce complex behaviors like:
- **Phasing through other materials**.
- **Dispersing and collapsing surrounding particles**.
- **Dynamic state transitions** based on interactions.

We’ll also explore how to extend the state machine to handle these new behaviors and make the simulation even more dynamic and interactive.

--- 

### Conclusion

In this article, we’ve built a falling sand simulation from scratch, starting with a simple grid and gradually adding features like chunk-based operations, performance optimizations, and interactivity. We’ve also added a cool auto mouse press animation to demonstrate the simulation in action.

You can find the full code on my [GitHub](https://github.com/perymimon/portofolio/tree/main/projects) and try the working demo [here](https://perymimon.github.io/portofolio/projects/falling-sand).

Stay tuned for **Part 2**, where we’ll add the Matrix Material and explore even more advanced simulation techniques. Happy coding! 😊

Feel free to experiment with the code and share your creations!

---

### Further Reading

- [Cellular Automata](https://en.wikipedia.org/wiki/Cellular_automaton): Learn more about the theory behind simulations like this.
- [Coding Challenge 180: Falling Sand](https://youtu.be/L4u7Zy_b868?si=Tl7T8j5_VnRH8exS)
- https://sandspiel.club/
- [Coding Challenge 179: Elementary Cellular Automata](https://www.youtube.com/watch?v=Ggxt06qSAe4&ab_channel=TheCodingTrain)