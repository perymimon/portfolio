
Building a Falling Sand Simulation with HTML Canvas
==========================================
[pery mimon](https://hashnode.com/@perymimon)

·[Feb 8, 2025](https://perymimon.hashnode.dev/building-a-falling-sand-simulation-with-html-canvas)·

![Building a Falling Sand Simulation with HTML Canvas](https://cdn.hashnode.com/res/hashnode/image/upload/v1738976290866/bec0af14-dad8-433a-b707-6a9a93d1bba1.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp)

In this article, we’ll explore how to build a **falling sand simulation** using JavaScript and the HTML5 Canvas API. We’ll start with a simple implementation, identify its limitations, and iteratively improve it step by step. By the end, you’ll have a smooth, interactive simulation that you can tweak and expand.

You can find the full code on my [GitHub](https://github.com/perymimon/portofolio/tree/main/projects/falling-sand) and try the working demo [here.](https://perymimon.github.io/portofolio/projects/falling-sand/1)

* * *


### Table of Contents

1.  [Introduction](https://markdown-to-medium.surge.sh/#introduction)

2.  [Step](https://markdown-to-medium.surge.sh/#introduction) [1: A Simp](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)[le Grid](https://markdown-to-medium.surge.sh/#introduction)

3.  [S](https://markdown-to-medium.surge.sh/#introduction)[tep](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid) [2: Adding Fa](https://markdown-to-medium.surge.sh/#introduction)[lling Sand](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)

4.  [Step 3: Int](https://markdown-to-medium.surge.sh/#introduction)[roduc](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)[ing](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand) [Chunks](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)

5.  [Step 4: Maki](https://markdown-to-medium.surge.sh/#introduction)[ng It Int](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand)[eractive](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid) [and color th](https://markdown-to-medium.surge.sh/#introduction)[e](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand) [sand](https://markdown-to-medium.surge.sh/#step-3-introducing-chunks)

6.  [Step 5: Final touch:](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid) [A](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand)[ddin](https://markdown-to-medium.surge.sh/#step-3-introducing-chunks)[g an](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand) [Auto Mouse](https://markdown-to-medium.surge.sh/#introduction) [Press Ani](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand)[mation](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)

7.  [Final Code](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)

8.  [Ext](https://markdown-to-medium.surge.sh/#step-3-introducing-chunks)[ra: Optimizin](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand)[g Performanc](https://markdown-to-medium.surge.sh/#introduction)[e](https://markdown-to-medium.surge.sh/#step-2-adding-falling-sand)

9.  [What’s Ne](https://markdown-to-medium.surge.sh/#introduction)[xt?](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)

10.  [Conclusion](https://markdown-to-medium.surge.sh/#step-1-a-simple-grid)


* * *

### Introduction

Falling sand simulations are a type of cellular automata where particles (like sand, water, or fire) move and interact based on simple rules. These simulations are visually captivating and can be used in games, art, or educational tools.

In this project, we’ll use a **grid-based approach** to simulate falling sand. We’ll start with a basic grid, add sand particles, and gradually improve the simulation to make it nice and interactive.

### Step 1: A Simple Grid

Let’s start by creating an HTML page with a basic `canvas` element, a CSS file, and a JavaScript file.

```js
    <!DOCTYPE html>
    <html lang="en">
    <style>
        body {
            display: flex;
            place-items: center;
            padding: 0;
            margin: 0;
            background: hsl(40deg 30% 60%);
        }
        canvas {
            width: 100dvw;
            height: 100dvh;
            aspect-ratio: 1;
            background: hsl(230deg 14% 40%)
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

Now, let crate the `Grid.js` file and call it from `falling-sand.js`. Our JavaScript file for now just initialize a small 4X4 grid to represent our simulation world. Each cell in the grid can be either empty (`0`) or filled with sand (`1`). later we can Increase the grid size to enjoy higher resolution.

```js
    // falling-sand.js
    import Grid from './Grid.js';
    
    const cols = 4, rows = 4;
    const grid = new Grid(cols, rows)
 ```   

```js
    // Grid.js
    export default class Grid {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.cells = new Uint8Array(width * height);
        }
    
        index(x, y) {
            return y * this.width + x;
        }
    
        xy (index) {
            var x = index % this.width, y = Math.floor(index / this.width)
            return {x, y}
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

That nice, this grid is simple but effective. It handles out-of-bounds cells with padding of `1`.

But we can’t see it. we should add a draw function to it and call `grid.draw` with a proper `ctx` canvas
```js
    //Grid.js
    export default class Grid {
        //....
        draw (ctx, cellSize) {
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

```js
    //falling-sand.js
    import Grid from './Grid.js';
    const cols = 4, rows = 4;
    const grid = new Grid(cols, rows)
    
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    const cellSize = 10;
    canvas.width = cols * cellSize
    canvas.height = rows * cellSize
    
    grid.draw(ctx, cellSize); // Render initial state
 ```   

###  Step 2: Adding Falling Sand

Ok , it empty lets put grain of sand in the cell(2,1)

```js
    grid.setCell(2, 1, 1); // Place a sand particle
    
    grid.draw(ctx, cellSize); // Render initial state
 ```   

It everything go well you should see a 4X4 blurring grid like this:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1739091709421/a4da5c85-f489-439a-b09f-7cbfc404d1af.png?auto=compress,format&format=webp)

If not add the grid a `toString` function and use `console.log(grid.toString())` or `console.log(‘‘+grid)` to print the `grid.cells` to the console

```js
    // Grid.js
    class Grid{
     //...
        toString(){
            var bits = []
    
            for (let i = 0 ; i < this.cells.length ; i+=this.width) {
                var rows = this.cells.subarray(i,  i + this.width)
                bits.push(rows.join('\t'))
            }
            return bits.join('\n')
        }
    }
  ```  

So we got the huge blurred grid … It ok . we will rise the resolution later and it be look nice.

### Making the cell fall

For now we have a particle in cell (2,1) let’s make it fall downward.  
To do so we start with update the `grid` inside a animation loop, checking each cell and set sand particles one cell down if the cell below them is empty.

**falling-sand.js**

```js
    // ...
    
    function update() {
        for (let y = grid.height - 1; y >= 0; y--) {
            for (let x = 0; x < grid.width; x++) {
                if (grid.getCell(x, y) === 1 && grid.getCell(x, y + 1) === 0) {
                    grid.setCell(x, y, 0);
                    grid.setCell(x, y + 1, 1);
                }
            }
        }
    }
    
    // Animation Loop
    function animation (timeStamp) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        grid.draw(ctx, cellSize)
        update()
        requestAnimationFrame(animation)
    }
    requestAnimationFrame(animation)
``` 

This is simple and works, a little bit fast for my taste but we can fix that later. But it just fall down, if we add another grain they just stack up. If we want to add more complex behavior like making the sand slide left or right when it possible, it possible but it quickly becomes complex and tedious.

###  Step 3: Introducing Chunks

To add more complex behavior and improve performance in large grids, it's beneficial to use a dead simple algorithm that avoids numerous if-branches. Instead of using complex nested `if`s we’ll introduce **state-based operations**. we give the state hash our state and get back new state.

In our case a `state` is a chunk of 3x3 neighborhood of cells around the target cell that we can treat as a single unit that we call `state` we can use it for implementing cellular automata rules.

specific In this case, each 3x3 chunk of cells will represented as a series of 9 bits, which can be interpreted as a number between 0 and 511. This binary representation allows for efficient state management and rule application in cellular automata. For instance, if you have a single material like sand, you can represent an empty cell as 0 and a full cell (with sand) as 1. This method simplifies the process of determining the state of a cell's neighborhood and applying the corresponding rules, making it easier to implement complex behaviors without relying on numerous conditional statements. For example:

```js
    000 // 987 | 3 cells above the target cell        
    010 // 654 | left cell, target cell, right cell   
    111 // 321 | 3 cells under the target cell
```

Can be written as `0b000_010_111` (or `0b111_010_000`, depending on the implementation).

Lets implement the chunk operation.

```js
    //Grid.js
    export default class Grid {
        //...
    
        getChunk (x, y) {
            let number = 0;
            let bit = 0;
    
            for (let dy = 1; dy >= -1; dy--) {
                for (let dx = 1; dx >= -1; dx--) {
                    const cell = this.getCell(x + dx, y + dy);
                    number |= cell << bit;
                    bit++;
                }
            }
            return number;
        }
    
        setChunk (x, y, pattern) {
            let bit = 0;
            for (let dy = 1; dy >= -1; dy--) {
                for (let dx = 1; dx >= -1; dx--) {
                    const value = (pattern >> bit++) & 1;
                    if(!value) continue
                    this.setCell(x + dx, y + dy, value);
                }
            }
        }
    
    }
``` 

Now with the ability to use chunks, we can define rules for how sand particles interact with their neighbors. In our case, sand can fall diagonally if the cell below is blocked.

But to determine the next state we can look just on the 3 first bit of the chunk. Although the state is defined as 9 bits, just the first 3 bit we care about ( what happened beneath the cell ). so to make a decision about what the next state will be we just need to look on them.

Lets add our `stateMachine` to the file

```js
    //falling-sand.js
    //...
    //State Machine
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

To use it we need to update the `update` function. For each cell, we read it value. If it is not empty, we call for a full `state`. when we getting it we **mask** out the important bits we care about ( the first 3 ). And then, we simply put it into the `stateMachine` getting the new state, and put it back to the grid .

```js

    function update() {
        for (let i = grid.cells.length -1 ; i >0 ; i--) {
            const {x, y} = grid.xy(i);
            const cell = grid.getCell(x, y);
            if (!cell) continue;
    
            grid.setCell(x, y, 0)
            const state = grid.getChunk(x, y) & 0b111
            let newState = stateMachine.get(state);
            if (Array.isArray(newState)) newState = randomItem(newState);
            grid.setChunk(x, y, newState);
        }
    }
    
    function randomItem (array) {
        return array[Math.floor(Math.random() * array.length)];
    }
```    

If you're running the code now you should see the grain of sand falling and stack to the ground. it not do infinity looping of falling because we padding the outbound of the grid with 1 in the `grid.getCell` function.

> If you try to debug the state you will get a number that give you a hard time to understand what the actually the state is. To see the state as a series of binary number in a size of 9 bit write this: `state.toString(2).padStart(9,0)`

that cool right ? but it be more cool then that . If you put 3 grain of sand in the same column we should see them fall flat on the surface

```js
    grid.setCell(2, 0, 1); // Place a sand particle
    grid.setCell(2, 1, 1); // Place a sand particle
    grid.setCell(2, 2, 1); // Place a sand particle
```    

What you think on that ?

Step 4: Making It Interactive and color the sand
---------------------------------------------------------------------------------------------------------------------------------

Our grid is very small 4X4, let bigger it to nice size of 400 X 400 and let’s make the simulation interactive by allowing users to add sand particles with a mouse click. I use the `Pointer` class from my collection, which you can find and copy [here](https://github.com/perymimon/portofolio/blob/main/projects/_glossary/Pointer.js).

```js

    import Pointer from 'https://perymimon.github.io/portofolio/projects/_glossary/Pointer.js'
    // ^ put in on top of the file
    
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

As you can see the number of the sand is saved as `hsl` value between 30 to 110 let use it to draw a better sand color ( and remove the stroke around the rectangles if we already there )

```js

    //Grid.js
    export default class Grid {
       getChunk (x, y) {
         //...
         number |= (!!cell) << bit
         //...
       }
       setChunk (x, y, pattern, value = 1) {
            let bit = 0;
            for (let dy = 1; dy >= -1; dy--) {
                for (let dx = 1; dx >= -1; dx--) {
                    const pass = (pattern >> bit++) & 1;
                    if(!pass) continue
                    this.setCell(x + dx, y + dy, pass * value);
    
                }
            }
        }
       //...
        draw(ctx, cellSize) {
         //...
         // ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
          var cell = this.getCell(x, y)
          if (cell) {
             ctx.fillStyle= `hsl(${cell} 50% 50% )`
             ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
          }          
        }
    }
 ```   


```js
    //falling-sand.js
    update(){
        ...
        // grid.setChunk(x, y, newState);
        grid.setChunk(x, y, newState, cell) // <- update the setChunk to save the color of the sand
    }
```    

Now, you can draw sand particles directly onto the grid and watch them fall and interact.  
if you like the spread be bigger you can use `grid.setChunk` instead of `grid.setCell`. for example



    pointer.onPress = (({x, y}) => {
     //...
     grid.setChunk(cellX, cellY, 0b101010101, 30 + hsl)
    })


### Step 5: Final touch: Adding an Auto Mouse Press Animation

Now we start with a blank sandbox… how the user will know that those brown rectangle is interactive?  
To make the falling-sand more engaging and guide the user to interact with it, let’s add an **auto mouse press animation** using HTML and CSS. This will simulate user interaction by automatically clicking on the canvas in a predefined pattern that created with nice CSS animation

For that we go back to the HTML and update it a bit.

Add a `div` element for the fake mouse and style it with CSS animations:

```js
    //...
    <canvas id="canvas1"></canvas>
    //...
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

Now the invisible \`div\` moved according to the CSS animation ( you can draw it for debugging propose if you like ) . the trick is we can track after the `div` and call `onPress` pesado event on it’s coordinate

```js
    //falling-sand.js
    //... 
    // Auto mouse press animation
    var fakeMouse = document.getElementById('mouse');
    
    var trackingLoop = requestAnimationFrame(trakPointer)
    
    function trakPointer() {
        var {x, y} = fakeMouse.getBoundingClientRect();
        pointer.onPress({x, y});
        trackingLoop = requestAnimationFrame(trakPointer)
    }
    // Stop animation on user tap
    pointer.onTap = e => cancelAnimationFrame(trackingLoop)
```

Cool right?

Feel free to play with the CSS animation and give the `<div>` more life or any pattern you like. You can also use some AI to create better path animations or custom mouse shapes.

Final Code
------------------------------------------------------

```js

    //falling-sand.js
    import Pointer from 'https://perymimon.github.io/portofolio/projects/_glossary/Pointer.js'
    import Grid from './Grid.js';
    
    const cols = 400, rows = 400
    const grid = new Grid(cols, rows)
    
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    const cellSize = 10;
    canvas.width = cols * cellSize
    canvas.height = rows * cellSize
    
    grid.setCell(2, 0, 1); // Place a sand particle
    grid.setCell(2, 1, 1); // Place a sand particle
    grid.setCell(2, 2, 1); // Place a sand particle
    
    grid.draw(ctx, cellSize); // Render initial state
    
    function update() {
        for (let i = grid.cells.length -1 ; i >0 ; i--) {
            const {x, y} = grid.xy(i);
            const cell = grid.getCell(x, y);
            if (!cell) continue;
    
            grid.setCell(x, y, 0)
            const state = grid.getChunk(x, y) & 0b111
            let newState = stateMachine.get(state);
            if (Array.isArray(newState)) newState = randomItem(newState);
            // grid.setChunk(x, y, newState);
            grid.setChunk(x, y, newState, cell)
        }
    }
    
    function randomItem (array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Animation Loop
    function animation (timeStamp) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        grid.draw(ctx, cellSize)
        update()
        requestAnimationFrame(animation)
    }
    requestAnimationFrame(animation)
    
    //State Machine
    const stateMachine = new Map();
    stateMachine.set(0b000, 0b010); // Fall down
    stateMachine.set(0b001, 0b010); // Fall down
    stateMachine.set(0b010, [0b100, 0b001]); // Randomly fall left or right
    stateMachine.set(0b011, 0b100); // Fall left
    stateMachine.set(0b100, 0b010); // Fall down
    stateMachine.set(0b101, 0b010); // Fall down
    stateMachine.set(0b110, 0b001); // Fall right
    stateMachine.set(0b111, 0b010_000); // Stay in place
    
    var pointer = new Pointer(canvas);
    var hsl = 0
    pointer.onPress = (({x, y}) => {
        const {width, height} = canvas.getBoundingClientRect();
        const ratioW = width / canvas.width;
        const ratioH = height / canvas.height;
        const cellX = Math.floor(x / (cellSize * ratioW));
        const cellY = Math.floor(y / (cellSize * ratioH));
        hsl = (hsl+1) % 80
        // grid.setCell( cellX, cellY, 30 + hsl); // Add colorer sand
        grid.setChunk(cellX, cellY, 0b101010101, 30 + hsl)
    });
    
    // Auto mouse press animation
    var fakeMouse = document.getElementById('mouse');
    
    var trackingLoop = requestAnimationFrame(trakPointer)
    
    function trakPointer() {
        var {x, y} = fakeMouse.getBoundingClientRect();
        pointer.onPress({x, y});
        trackingLoop = requestAnimationFrame(trakPointer)
    }
    // Stop animation on user tap
    pointer.onTap = e => cancelAnimationFrame(trackingLoop)
```    
```js
    //Grid.js
    export default class Grid {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.cells = new Uint8Array(width * height);
        }
    
        index(x, y) {
            return y * this.width + x;
        }
    
        xy (index) {
            var x = index % this.width, y = Math.floor(index / this.width)
            return {x, y}
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
        draw (ctx, cellSize) {
            ctx.fillStyle = 'yellow'
            ctx.strokeStyle = 'white'
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    // ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
                    var cell = this.getCell(x, y)
                    if (cell) {
                        ctx.fillStyle= `hsl(${cell} 50% 50% )`
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                    }
                }
            }
        }
        getChunk (x, y) {
            let number = 0;
            let bit = 0;
    
            for (let dy = 1; dy >= -1; dy--) {
                for (let dx = 1; dx >= -1; dx--) {
                    const cell = this.getCell(x + dx, y + dy);
                    number |= cell << bit;
                    bit++;
                }
            }
            return number;
        }
    
        setChunk (x, y, pattern, value = 1) {
            let bit = 0;
            for (let dy = 1; dy >= -1; dy--) {
                for (let dx = 1; dx >= -1; dx--) {
                    const pass = (pattern >> bit++) & 1;
                    if(!pass) continue
                    this.setCell(x + dx, y + dy, pass * value);
    
                }
            }
        }
    
        toString(){
            var bits = []
    
            for (let i = 0 ; i < this.cells.length ; i+=this.width) {
                var rows = this.cells.subarray(i,  i + this.width)
                bits.push(rows.join('\t'))
            }
            return bits.join('\n')
        }
    }
    

    <!DOCTYPE html>
    <html lang="en">
    <style>
      body {
        display: flex;
        place-items: center;
        padding: 0;
        margin: 0;
        background: hsl(40deg 30% 60%);
      }
      canvas {
        width: 100dvw;
        height: 100dvh;
        aspect-ratio: 1;
        background: hsl(230deg 14% 40%)
      }
    </style>
    <head>
      <meta charset="UTF-8">
      <title>Falling Sand</title>
    </head>
    <body>
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
    
    <script type="module" src="falling-sand.js"></script>
    </body>
    </html>
    

### Optimizing Performance

Maybe the speed animation is to fast for you… or you want control more precisely on the performance. For that you can limit the update rate with the [`FrameEngine`](https://github.com/perymimon/portofolio/blob/main/projects/_glossary/FrameEngine.js) from my repository

replace the `animation` function and the two `requestAnimationFrame(animation)` with this snippet

Copy

    import {FrameEngine} from 'https://perymimon.github.io/portofolio/projects/_glossary/FrameEngine.js' // or copy it
    // ^ put that on top of the file
    
    new FrameEngine(60 /*or 10 fps*/, function animation() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        grid.draw(ctx, cellSize)
        update()
    }).start()
    

Another thing is to use **double buffering** or in our case **double Grids. in complex cases it can also improve performance.**

Copy

    const cols = 400, rows = 400
    var grid = new Grid(cols, rows)
    var nextGrid = new Grid(cols, rows)
    
    function swapBuffers () {
        let temp = nextGrid
        nextGrid = grid
        grid = temp
        nextGrid.cells.fill(0)
    }
    //....
    function update() {
        for (let i = grid.cells.length -1 ; i >0 ; i--) {
            const {x, y} = grid.xy(i);
            const cell = grid.getCell(x, y);
            if (!cell) continue;
    
            // grid.setCell(x, y, 0)
            const state = grid.getChunk(x, y) & 0b111
            let newState = stateMachine.get(state);
            if (Array.isArray(newState)) newState = randomItem(newState);
            // grid.setChunk(x, y, newState);
            nextGrid.setChunk(x, y, newState, cell)
        }
        swapBuffers()
    }
    

* * *

### [Permalink](#heading-exploring-the-code "Permalink")Exploring the Code

All the utilities used in this project, including the `FrameEngine` and the `Pointer`, among others, are available in my [GitHub repository](https://github.com/perymimon/portofolio/blob/main/projects/_glossary/FrameEngine.js). These tools were written from scratch and are designed to be modular and reusable. Here’s a quick overview of what’s included:

*   `FrameEngine`: A utility for managing frame-based animations and updates.
    
*   `Pointer`: A helper for handling mouse and touch input seamlessly.
    
*   `Timer`: A utility that can set a timer that can be paused and resumed with a callback at the end.
    
*   `Recorder`: A utility that can record a canvas to a video file. Let me know if you want to know more.
    

Feel free to explore the repository and use these tools in your own projects as demonstrated above. You can do this by copying and pasting the files, and please remember to give some credit.

* * *

### [Permalink](#heading-whats-next "Permalink")What’s Next?

In **Part 2**, we’ll dive deeper into the simulation by adding a new material.

We’ll also explore how to extend the state machine to handle these new behaviors and make the simulation even more dynamic and interactive.

* * *

### [Permalink](#heading-conclusion "Permalink")Conclusion

In this article, we’ve built a falling sand simulation from scratch, starting with a simple grid and gradually adding features like chunk-based operations, performance optimizations, and interactivity. We’ve also added a cool auto mouse press animation to demonstrate the simulation in action.

You can find the full code on my [GitHub](https://github.com/perymimon/portofolio/tree/main/projects/falling-sand) and try the working demo [here](https://perymimon.github.io/portofolio/projects/falling-sand).

Stay tuned for **Part 2**, where we’ll add the Matrix Material and explore even more advanced simulation techniques. Happy coding! 😊

Feel free to experiment with the code and share your creations!

* * *

### [Permalink](#heading-further-reading "Permalink")Further Reading

*   [Cellular Automata](https://en.wikipedia.org/wiki/Cellular_automaton): Learn more about the theory behind simulations like this.
    
*   [Coding Challenge 180: Falling Sand](https://youtu.be/L4u7Zy_b868?si=Tl7T8j5_VnRH8exS)
    
*   [https://sandspiel.club/](https://sandspiel.club/)
    
*   [Coding Challenge 179: Elementary Cellular Automata](https://www.youtube.com/watch?v=Ggxt06qSAe4&ab_channel=TheCodingTrain)
    

