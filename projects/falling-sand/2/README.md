In the [first part of this series](https://perymimon.hashnode.dev/building-a-falling-sand-simulation-with-html-canvas), we built a basic falling sand simulation using HTML Canvas and cellular automata. Now, we’ll expand the simulation to support **multiple materials** (specifically water) and introduce a more sophisticated state machine to handle complex interactions.

---

<iframe src="https://perymimon.github.io/portofolio/projects/falling-sand/2/index.html" style="width:100vw;height:300px"></iframe>

## Introduction

Our previous simulation focused on sand particles that fell downward or diagonally based on three cells below them. Water, however, behaves differently—it flows sideways, swaps places with sand, and requires checking more neighboring cells. To support this, we’ll:

1. Use **symbols** (`A`, `S`, `W`) instead of numbers for clarity.
2. Expand the state machine to handle **all 8 neighboring cells** + **Target cell** (9 cell now istead of 3).
3. Introduce helper functions to **auto-generate state transitions**, avoiding manual definitions for 729+ states.


Let’s dive in!

---

## Step 1: Symbolic Representation

In the previous tutorial, we used `1` for sand and `0` for empty cell.  Now, with more materials, we need more numbers to represent them. also  new materials can look around them to take decision. `Sand` just need to look down to decide if it “fall” down or diagonal so this state is just 3 cell we can mask from the whole 8 cells around the target cell and the definition of the sate can be represent with one int number in a bit level: `0b110` for example

So if we need more numbers for the materials and the state should include 8 or 9 cells . it lead to very long  
list of permutations just very hard to write by hand. 3^9 is 19,684 permutations! and when we add fourte material 4^9 is 262,144 permutations. like :`012 222 012`

We can tackle this with mask, as we do before, and focus just on the cells we want to test each time, and probably we will do that later.

But now i want to focus on brute force and and make easy for us define state.

First we need easy way to follow each material number.  
I choose to do so by using simple string. each material get a letter and each letter in the string have a built-in index that will represent the number of the the material in the grid. that very easy to retrieve by using `symbols.indexOf(‘W')`

```javascript
const symbols = 'ASW'; // Air, Sand, Water
```

Example: `ASWS` say Air near to Sand near to Water near to Sand  
This makes rules like `S` (sand) sinking into `W` (water) easier to reason about.

---

## Step 2: Expanded State Machine

the second thing we need is to easy about is how we define 9 cell state. we really need it even for just adding Water because Water requires checking **6 cells** (3 below like sand and left, right, and above) because water and flow left and right when they block from below and Sand sink into them so we need to check also if there is Sand above them. but for checking if below is empty we not care what on the sides. and when we check on the sides we not care what is really

To rich our vocabulary i introduce `wildcards` in the pattern:

* `s` for “swap” (if multiple possible `s` in the pattern , pick one)

* `x` for “any material”. or “don’t care” in logical language

* `f` as Full. opposite of empty cell ( other word cell with Air )

* `A` `S` `W` (Capitals) as explicit index on the `symbol` string

* “ “(space) are just visual and will remove before processing


Example: `'xWx xSx xxx'`.  
Explain: we not care about the all material in the x positions. but if there is Water in the middle bottom cell and Sand in the middle cell (target cell ) we have a match!.

but in the end states will come from the grid as sequence of 9 digits (string or number depend on the implementation ) so we need helper function that translate between our pattern to all possible states it represent : `020 112 212` `121 111 111` and more 2187 permutation.

### The `DefineStates` helper

To tackle this JS come to rescue ! as a script language we can define a method to get patterns and using wildcards to fill our `statesMachine` with all details pattern.

create a new file `defineStates.js` and import it into `falling-sand.js`

```javascript
//defineStates.js
export default function defineStates(stateMachine, pattern, nextStatePattern, materials) {
  // Implementation details (full code bellow at the article end)
}
```

It actually a bit of complex so i just show the signature here. I continue with the reset that need to do and we come into implementation technics at the end. but [You can go ahead and read the complete code below](#heading-building-the-rule-engine).

before that here some example of using

```javascript
import defineStates from './defineStates.js'

//State Machine
const stateMachine = new Map();
//... 
// Sand Sinking into Water
defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols);
// The pattern reading from bottom-left to top-right.
// and it say: In 3X3 grid, Water is in the middle-bottom (xWx) Sand in the middle (xSx).
// And the result is swaps sand (S) and water (W) 
```

you can remove the old state definition now:

```javascript
// old states, should be removed
/*
stateMachine.set(0b000, 0b010); // Fall down
stateMachine.set(0b001, 0b010); // Fall down
stateMachine.set(0b010, [0b100, 0b001]); // Randomly fall left or right
stateMachine.set(0b011, 0b100); // Fall left
stateMachine.set(0b100, 0b010); // Fall down
stateMachine.set(0b101, 0b010); // Fall down
stateMachine.set(0b110, 0b001); // Fall right
stateMachine.set(0b111, 0b010_000); // Stay in place 
*/
```

## Step 3: Rules

lets move quickly and define again the sand rules in the new pattern method, before that lets define again what are the rules of `Sand`

### Sand Rules

1. **Flow Downward** if the direct cell below is empty.

2. **Flow Diagonal** if direct below is full and one diagonal is empty

3. **Settle on ground** if 3 cells below full


#### copy that code under state Machine

```javascript
// falling-sand.js

const stateMachine = new Map();
/* Sand */
// flows down
defineStates(stateMachine, 'x0x xSx xxx', '0s0', symbols) // direct cell below empty
defineStates(stateMachine, '0f0 xSx xxx', 's0s', symbols) // two diagonals empty
defineStates(stateMachine, 'ff0 xSx xxx', '00s', symbols) // right diagonal empty
defineStates(stateMachine, '0ff xSx xxx', 's00', symbols) // left diagoal empty
// Settle on ground
defineStates(stateMachine, 'fff xSx xxx', '000 0s0', symbols) // 3 cells are not empty
```

you can play with that rules and change the pattern accordantly. for example you can say `if three bottom cells empty pick one`

now we can add the new matrial we want to explore. `Water` behevie like sand with new 2 more rules:

### Water Rules

1. **Flow Downward** if the cell below is empty like sand.

2. **Flow Sideways** if blocked below.

3. **Swap with Sand** when colliding.


#### copy that code under sand definition under state Machine

```javascript
// falling-sand.js

/* Water */
// flows down
defineStates(stateMachine, 'x0x xWx xxx', '0s0', symbols)
defineStates(stateMachine, '0f0 xWx xxx', 's0s', symbols)
defineStates(stateMachine, 'ff0 xWx xxx', '00s', symbols)
defineStates(stateMachine, '0ff xWx xxx', 's00', symbols)
// Water flows sideways when blocked
defineStates(stateMachine, 'fff xW0 xxx', '000 00s', symbols) // Right
defineStates(stateMachine, 'fff 0Wf xxx', '000 s00', symbols) // Left
// Swap with sand
defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols)
```

as you can see water start as a sand but add 3 more rules , 2 for flow right and if it block flow left.  
there is room for explorer of course . that rule give the filling of diagonal plate. the last rule is for swapping Water with sand when the last is above water.

## Step 4: Updated Grid Class

Switching from numbers to strings changes the reading direction: strings start from the left, while numbers often consider the rightmost digit as the starting point. and because the grid read the cell and convert them to pattern it we be easier if we read the there cell also from left to right bottom to top

```javascript
// Grid.js
//modify the Grid class to handle 3x3 chunks as strings (e.g., AASWWAAAS):
class Grid {
  getChunk(x, y) {
        // Returns a 9-character string representing the 3x3 neighborhood
        let pattern = []
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx <= 1; dx++) { // left to right
                const cell = this.getCell(x + dx, y + dy)
                pattern.push(cell)
            }
        }
        return pattern.join('')
    }

    setChunk(x, y, pattern) {
        // Updates cells based of the pattern ( 9 byte )
        if(!pattern) return null
        let index = -1
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx <= 1; dx++) {  // left to right
                ++index
                let symbol = pattern[index] // < updated
                if(symbol === undefined) continue // < update
                if (symbol === '0') continue  // < update
                this.setCell(x + dx, y + dy, symbol )
            }
        }
    }
}
```

by the way because now materials can move arbitrary to any cell around. easily they can land on same cell and erase each other. to prevent that is better if they update the same grid so there by one source of true about the grid status. so i remove the `nextGrid` and we return to work on one grid

```javascript
//falling-sand.js
function update () {
    for (let i = grid.cells.length - 1; i > 0; i--) {
        const {x, y} = grid.xy(i)

        const cell = grid.getCell(x, y)
        if (!cell) continue

        const state = grid.getChunk(x, y)
        let newState = stateMachine.get(state)
        if (Array.isArray(newState)) newState = randomItem(newState)
        if(!newState) continue
        grid.setCell(x, y, 0)
        grid.setChunk(x, y, newState)
    }
}
```

---

## Step 5: Visualizing Materials

Another thing.

In the previous implementation, we simply defined a color for "sand" in the draw function. However, with the introduction of multiple materials, we need to assign a distinct range of colors to each material to ensure they are easily distinguishable from one another. This involves selecting specific hues or shades for each material type so that they can be visually differentiated

### Color Coding

Define that above the the `FrameEngine` and update the `grid.draw` to use it. we use that color to assign hues to materials for visual distinction:

```javascript
const symbols = 'ASW' // Air, Sand, Water
const materials = {
    symbols,
    S: { name: 'Sand', color: [60, 42] }, // Yellow hues
    W: { name: 'Water', color: [200, 210] }, // Blue hues
}
// Start simulation
new FrameEngine(10, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, cellSize, cellSize, materials) //<- update
    update()
}).start()
```

If there is more calls to `grid.draw` you can remove them.

### Updated Rendering

```javascript
// grid.js
class Grid {
  draw(ctx, cellWidth, cellHeight, materials) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[this.index(x, y)];
        if (cell === 0) continue; // Skip air
        const symbol = materials.symbols[cell];
        const [hueStart, hueEnd] = materials[symbol].color;
        ctx.fillStyle = `hsl(${hueStart + (x + y) % (hueEnd - hueStart)} 70% 50%)`;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}
```

---

## Step 6: Adding a Material Selector

Another thing, it will be convenient to add a UI element for selecting different materials. This will allow us to choose if we want to draw with sand or water.

### HTML & CSS

Add this HTML above the canvas and style it appropriately:

```xml
# index.html
<div class="group-base" id="material-selector">
  <label class="label-base">
    <input type="radio" name="material" value="S" checked>
    Sand
  </label>
  <label class="label-base">
    <input type="radio" name="material" value="W">
    Water
  </label>
</div>
<canvas id="canvas1"></canvas>
<div id="mouse"></div>
<style>
    canvas {
        flex: 1;
        position: relative;
        overflow: clip;
        min-height: 0;
    }

    #material-selector {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 2;
        background: rgba(255, 255, 255, 0.5);
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    .label-base {
        cursor: pointer;
        display: block;
        margin: 0.25rem 0;
    }

</style>
<style> privius style,... </style>
```

to this take effect we need also update the pointer handler

```javascript
// falling-sand.js
pointer.onPress = ({x, y}) => {
    let {width, height} = canvas.getBoundingClientRect()
    let ratioW = width / canvas.width
    let ratioH = height / canvas.height
    let cellX = Math.floor(x/ (cellSize * ratioW))
    let cellY = Math.floor(y/ (cellSize * ratioH))
    var material = getSelectedMaterial() // < update
    grid.setCell(cellX, cellY, material)
}

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector').querySelector('input[type=radio]:checked')
    return materials.symbols.indexOf(input.value)
}
```

## Step 7: Testing the Simulation

Last step before implementation of the `defineState` it to reduce the size of the grid from 400X400 to 10X10, it simplify the debugging and will easy on the performance. Also this can help you focus on verifying the basic functionality with a single grain of sand first. Once you're confident that the sand behaves as expected, you might want to explore how water interacts within the simulation.

```javascript
// falling-sand.js
const cols = 10, rows = 10
var grid = new Grid(cols, rows)

/* replace this
grid.setCell(2, 0, 1) // Place a sand particle
grid.setCell(2, 1, 1) // Place a sand particle
grid.setCell(2, 2, 1) // Place a sand particle
*/

//grid.setCell(5, 5, symbols.indexOf('W')); // secound test : Water at (5,5)
grid.setCell(2, 0, symbols.indexOf('S')); // first test : Sand at (2,0)
```

also not forget to comment the mouse animation if it still running.

> you can put cell into the grid using the devtool if you add the grid to `window` : `window.grid = grid`

finally.. we ready for the last step

## **Building the Rule Engine**

## `defineState()`

Let’s face it—manually coding hundreds of rules for sand, water, and other materials sounds like a nightmare. In this section, we’ll break down the `defineStates` system, a pattern-based helper that lets you define **complex material interactions** with just a few lines of code and reduce Human Error and open the gate for Scalability : Adding lava/gas and build the ground for more high level function like `fall(‘w’)` or `liquid('w')`

copy that to `defineStates.js`

```javascript
//defineState.js
/*
vocabulary:
- “ “(space) =  are just visual and will remove before processing
- s = “swap” (if multiple possible s in the pattern , pick one)
- x = Any material (air, sand , water, etc.), or not-care
- f = Not Air material (sand, water, etc. )
- A S W (Capitals) =  as explicit index on the symbol string
*/
export default function defineStates (stateMachine, pattern, newState, symbols) {
    pattern = pattern.replaceAll(' ', '') // remove space as they not count
    var target = pattern[4] // now we can count and have access to main symbol. the one in the center
    var symIndex = symbols.indexOf(target)

    pattern = pattern.replaceAll(/./g, explicit(symbols)) // Explicit reference
    let base = newState.replaceAll(' ', '').replaceAll(/./g, explicit(symbols))

    // Step 2: Generate replica patterns for 's' (if any)
    var nextStates = base.matchAll(/s/g).toArray().length > 1 ?
        pivotPattern(base, 's', 0, symIndex).toArray() :
        base.replace('s', symIndex)

    for (let pattern1 of replicaPatterns(pattern, 'x', 0, symbols.length)) {
        for (let pattern2 of replicaPatterns(pattern1, 'f', 1, symbols.length)) {
            stateMachine.set(pattern2, nextStates)
        }
    }
}
```

So that is the function and it use two helper functions: `replicaPatterns` `pivotPattern`

### 1\. ReplicaPatterns generator

**this helper can take a pattern, char and range and return iteratator that iterate all possible patterns. we use it to take care of the Wildcards (**`x`, `f`) that let you write **one rule** that represents **many states**.

```javascript
/**
 * Generates all possible patterns by replacing wildcards in the input pattern.
 *
 * @param {string} pattern - A string with one type of wildcard (e.g., x0x).
 * @param {string} wild - The wildcard character to replace (e.g., x or f).
 * @param {number} min - The starting value for replacements (e.g., 0 for air).
 * @param {number} max - The ending value (exclusive) for replacements (e.g., 3 for air, sand, water).
 */
function* replicaPatterns (pattern, wild, min, max) {
    const range = max - min; // the `base` of numbers to replace 'symbol'
    if (range === 1) return yield pattern.replaceAll(wild, String(min))

    var parts = pattern.split(wild) // Split the pattern between the symbols
    // If no wildcards are present, yield the pattern as-is
    if (parts.length === 1) return yield pattern

    const numWildcards = parts.length - 1   // Number of wildcards in the pattern
    const totalIterations = Math.pow(range, numWildcards ) // Total combinations to generate

    // Loop through all possible combinations
    for (let i = 0; i < totalIterations; i++) {
        const digits = i.toString(range).padStart(numWildcards, '0').split('')
        yield digits.reduce((res, d, i) => res + (min + +d) + parts[i + 1], parts[0])
    }
}
```

### How it Work:

The core principle is calculate how match replicas we will create and start `counting` them, but not using base 10, using `range` as the *base* and make sure the number have digits as the number of `symbols` appears in the pattern. that create for up the replacement with need for each iteration. For example if the range is 3 (possible values 0,1,2) and the symbol appears 2 times, the counting will be 2³: `00` `01` `02` `10` `11` `12` `20` `21` and `22`. This achieved by treating each combinations as numbers in a base equal to the range, iterating through all possible values, and replacing the wildcards each with each digit

How we know where to put each digit? The next principle is split the pattern around the `wildcard` so we got fragments of a string around the wild symbol without the wild symbol itself. And what's left for us is to unite the array around the digits of the number we created above.

**Example:**

Input: `pattern = "x0x"` `wild= "x"` `min = 0` `max = 3`

steps:

1. Split the pattern : `pattern.split("x") → ["", "0", ""]`

2. `pattern.length == 3` : There are **2 wildcards**

3. Total Iterations : `Math.pow(3, 2) → 9`

4. **Loop through iterations** each one yield

    1. `i = 0` → `00` → Replace `x`s → `0` `0` → **000**

    2. `i = 1` → `01` → Replace `x`s → `0` `1` → **010**

    3. `i = 2` → `02` → Replace `x`s → `0` `2` → **020**

    4. `i = 3` → `10` → Replace `x`s → `1` `0` → **100**

    5. `i = 4` → `11` → Replace `x`s → `1` `1` → **110**

    6. `i = 5` → `12` → Replace `x`s → `1` `2` → **120**

    7. `i = 6` → `20` → Replace `x`s → `2` `0` → **200**

    8. `i = 7` → `21` → Replace `x`s → `2` `1` → **210**

    9. `i = 8` → `22` → Replace `x`s → `2` `2` → **220**


**Edge Cases:**

* When `range == 1` return pattern.replaceAll(symbol, min)

  Example: `pattern="x0x", symbol="x", min=0, max=1` → `"000"`.

* When pattern doesn’t contain the wildcard, yield it as-is:  
  `if (pattern.length === 1) return yield` [`pattern.at`](http://pattern.at)`(0)`


#### Notes

1. **Flexibility**: Works for any wildcard (`x`, `f`, etc.) and any range of values.

2. **Efficiency**: Generates combinations with minimal iteration instead of brute-forcing loops.

3. **Scalability**: Handles patterns with multiple wildcards (e.g., `xxffx`).


---

### 2\. `pivotPattern` Resolving symbol that can appear only one

When defining next-state patterns, we can use `s` character to indicate a **swap**. material can swap to just one place in a time so `pivotPattern` return generator that iterate all parmutation where `wildsymbol` appear only one replace it with the real symbol, material number in our case, and other `wildsymbol` replaced with `clearSymbol`, Air in our case

For example: `s0s` means "swap the current material with the material in the first or third position. However, the state machine needs **concrete patterns** to work with, not symbolic placeholders.

```javascript
/**
 * A generator that yields all valid permutations of the pattern with pivotChar
 * replaced one at a time.
 *
 * @param {string} pattern: The pattern to process (e.g., s0s).
 * @param {string} pivotSymbol: The character to replace (e.g., s).
 * @param {string} clearSymbol: The character to use for non-pivot positions (e.g., 0).
 * @param {string} symbol: The character to replace pivotChar with (e.g., 1).
 */
function* pivotPattern (pattern, wild, clearSymbol, symbol = wild) {
    const basePattern = pattern.replaceAll(wild, clearSymbol).split('')

    for (let m of pattern.matchAll(wild)) {
        yield basePattern.with(m.index,symbol).join('')
    }
}
```

The function work by first replacing all pivot char with the clear char and then one by one sign the pivot on a copy of the `basePattern` and yield the result

#### **Example:**

Input `pattern = "s0s"` `wild = "s"` `clearSymbol= "0"` `symbol = "1"`

1. `basePattern = "s0s".replaceAll("s", "0").split('')` → `["0", "0", "0"]`

2. Loop through matches each one yield:

    * First `s` (index 0):

        * Replace clone of`basePattern[0]` with `1` → `["1", "0", "0"]`.

        * Yield `"100"`.

    * Second `s` (index 2):

        * Replace clone of`basePattern[2]` with `1` → `["0", "0", "1"]`.

        * Yield `"001"`.


#### Notes

1. **Efficiency**: Generates all valid swap outcomes without redundant work.

2. **Memory-Friendly**: Uses a single base pattern and modifies it in place.


---