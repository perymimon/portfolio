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

In the previous tutorial, we used `1` for sand and `0` for empty cells. Now, with more materials, we need more numbers to represent them. To simplify, we’ll use letters:

```javascript
const symbols = 'ASW'; // Air, Sand, Water
```

Example: `ASWS` say Air near to Sand near to Water near to Sand  
This makes rules like `S` (sand) sinking into `W` (water) easier to reason about.

---

## Step 2: Expanded State Machine

Water requires checking **6 cells** (3 below, left, right, and above) because it flows sideways when blocked and sand sinks into it. To handle this, we introduce `wildcards` in the pattern:

* `s` for “swap” (if multiple possible `s` in the pattern , pick one)

* `x` for “any material”. or “don’t care” in logical language

* `f` as Full. opposite of empty cell ( other word cell with Air )

* `A` `S` `W` (Capitals) as explicit index on the `symbol` string

* `0` no change to that cell

* Spaces are visual and will be removed before processing.


Example: `'xWx xSx xxx'` means we don’t care about the materials in the `x` positions, but if there’s Water in the middle-bottom cell and Sand in the middle cell, we have a match.

In the end states will come from the grid as sequence of 9 digits (string or number depend on the implementation ) so we need helper function that translate between our pattern to all possible states it represent:

### The `DefineStates` helper

To avoid manually defining thousands of states, we create a helper function:

```javascript
//defineStates.js
export default function defineStates(stateMachine, pattern, nextStatePattern, materials) {
  // Implementation details (full code below)
}
```

[You can go ahead and read complete code here](#heading-building-the-rule-engine).

This function generates all possible states based on the pattern and wildcards. Here’s an example of how to use it:

```javascript
import defineStates from './defineStates.js'

const stateMachine = new Map();
//... 
// Sand Sinking into Water
defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols);
```

The pattern reads from bottom-left to top-right: In 3X3 grid, Water in middle-bottom (xWx) Sand in center (xSx). And the result is swaps sand (S) and water (W)

You can remove the old state definition now and we redefined theme again in the new way

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

Let's quickly redefine the sand rules using the new pattern method. Before that, let's restate the rules for `Sand`

### Sand Rules

1. **Flow Downward** if the cell below is empty.

2. **Flow Diagonal** if the cell below is full and one diagonal is empty.

3. **Settle on ground** if all three cells below are full.


```javascript
// falling-sand.js

const stateMachine = new Map();
/*  Sand Rules */
defineStates(stateMachine, 'x0x xSx xxx', '0s0', symbols) // Flow down
defineStates(stateMachine, '0f0 xSx xxx', 's0s', symbols) // Flow diagonal random
defineStates(stateMachine, 'ff0 xSx xxx', '00s', symbols) // Flow right diagonal
defineStates(stateMachine, '0ff xSx xxx', 's00', symbols) // Flow left diagoal
defineStates(stateMachine, 'fff xSx xxx', '000 0s0', symbols) // Settle
```

You can experiment with the rules and adjust the pattern accordingly. For example, you might specify that if all three bottom cells are empty, select one.

Now we can add the new material we want to explore.

Water behaves like sand but with two additional rules.

### Water Rules

1. **Flow Downward** like sand.

2. **Flow Sideways** if blocked below.

3. **Swap with Sand** when colliding.


```javascript
// falling-sand.js

/* Water Rules */
defineStates(stateMachine, 'x0x xWx xxx', '0s0', symbols) // Flow down
defineStates(stateMachine, '0f0 xWx xxx', 's0s', symbols) // Flow diagonal random
defineStates(stateMachine, 'ff0 xWx xxx', '00s', symbols) // Flow right diagonal
defineStates(stateMachine, '0ff xWx xxx', 's00', symbols) // Flow left diagoal
defineStates(stateMachine, 'fff xW0 xxx', '000 00s', symbols) // Flows right when empty
defineStates(stateMachine, 'fff 0Wf xxx', '000 s00', symbols) // Flows left when blocked right and left empty
defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols) // Swap with sand
```

As I defined them, water flows to the right, and if blocked, it flows to the left. There is room for exploration, of course. My rule creates the effect of a diagonal plate, giving the impression of water flowing to the right. This rule also allows for swapping water with sand when sand is above the water.

## Step 4: Updated Grid Class

Switching from numbers to strings changes the reading direction. We update the `Grid` class to handle 3x3 chunks as strings: reading from left to right unlike number from right to left

```javascript
// Grid.js
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
        if(!pattern) return null // you can change that to worning
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

I also removed the nextGrid. We now work with a single grid because materials can move arbitrarily to any surrounding cell, potentially landing on the same cell and erasing each other. To prevent this, I update the same grid to maintain a single source of truth about the grid's status.

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

In the previous implementation, we simply defined a color for "sand" in the draw function. However, with the introduction of multiple materials, we need to assign a distinct range of colors to each material to ensure they are easily distinguishable from one another.

```javascript
const symbols = 'ASW' // Air, Sand, Water
const materials = {
    symbols,
    S: { name: 'Sand', color: [60, 42] }, // Yellow hues
    W: { name: 'Water', color: [200, 210] }, // Blue hues
}

new FrameEngine(10, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, cellSize, cellSize, materials) //<- update
    update()
}).start()
```

Update the `draw` method to use these colors:

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

It will be convenient to add a UI element for selecting materials. So let's add one

```html
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

To use it we need update the pointer handler:

```javascript
// falling-sand.js
pointer.onPress = ({x, y}) => {
    let {width, height} = canvas.getBoundingClientRect()
    let cellX = Math.floor(x/ (cellSize * (width / canvas.width)))
    let cellY = Math.floor(y/ (cellSize * (height / canvas.height)))
    let material = getSelectedMaterial() // < update
    grid.setCell(cellX, cellY, material)
}

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector input[type=radio]:checked')
    return materials.symbols.indexOf(input.value)
}
```

---

## Step 7: Testing the Simulation

Last step before implementing `defineState` is to reduce the grid size from 400x400 to 10x10. This simplifies debugging and helps verify basic functionality with a single grain of sand first. Once confident with sand achieved, we can explore water interactions in the simulation.

Remember to comment out the mouse animation if it's still running.

```javascript
// falling-sand.js
const cols = 10, rows = 10
var grid = new Grid(cols, rows)

/* replace code like this
grid.setCell(2, 0, 1) // Place a sand particle
with:
*/

//grid.setCell(5, 5, symbols.indexOf('W')); // secound test : Water at (5,5)
grid.setCell(2, 0, symbols.indexOf('S')); // first test : Sand at (2,0)
```

> You can place a cell into the grid using the developer tools by adding the grid to the window: `window.grid = grid`.`window`

finally.. we ready

## Building the Rule Engine

## `defineState()`

Let's face it—manually coding hundreds of rules for sand, water, and other materials sounds like a nightmare. In this section, we’ll break down `defineStates`, a pattern-based helper that allows you to define complex material interactions with just a few lines of code. This reduces human error and opens the door for scalability, such as adding lava or gas, and lays the foundation for higher-level functions like `fall('w')` or `liquid('w')`.

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
const explicit = (symbols) =>
    (c) => symbols.includes(c) ? symbols.indexOf(c) : c

export default function defineStates (stateMachine, pattern, newState, symbols) {
    pattern = pattern.replaceAll(' ', '') // remove space as they not count
    var target = pattern[4] // now we can count and have access to main symbol. the one in the center
    var symIndex = symbols.indexOf(target)

    pattern = pattern.replaceAll(/./g, explicit(symbols)) // Explicit reference
    var base = newState.replaceAll(' ', '').replaceAll(/./g, explicit(symbols))

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

That is the function and it use two helper :

1. `replicaPatterns`: Generates all possible patterns by replacing wildcards.

2. `pivotPattern`: Resolves patterns with `s` (swap) by replacing one `s` at a time.


### ReplicaPatterns generator

This helper take a pattern, character, and range, and return an iterator that generates all possible patterns. We use it to handle wildcards (x, f) And replace them with all appropriate range of material that defined in the symbols string

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

The core principle is to calculate how many replicas we will create and start counting them using the range as the base, rather than base 10. Ensure the number has as many digits as the number of symbols in the pattern. For example, if the range is 3 (possible values 0, 1, 2) and the symbol appears twice, the counting will be 3²: 00, 01, 02, 10, 11, 12, 20, 21, and 22. Iterating through all possible values, and replacing the wildcards with each digit.

How we know where to put each digit? The next principle is split the pattern around the wildcard, creating fragments of a string without the wildcard itself. Then, unite the array around the digits of the number created.

**Example:**

Input: `pattern = "x0x"` `wild= "x"` `min = 0` `max = 3`

steps:

1. Split the pattern : `pattern.split("x") → ["", "0", ""]`

2. `pattern.length == 3` : There are **2 wildcards**

3. Total Iterations : `Math.pow(3, 2) → 9`

4. **Loop through iterations** each one yield

   1. `i = 0` → `00` → **000**

   2. `i = 1` → `01` → **010**

   3. `i = 2` → `02` → **020**

   4. `i = 3` → `10` → **100**

   5. `i = 4` → `11` → **110**

   6. `i = 5` → `12` → **120**

   7. `i = 6` → `20` → **200**

   8. `i = 7` → `21` → **210**

   9. `i = 8` → `22` → **220**


**Edge Cases:**

* When `range == 1` return pattern.replaceAll(symbol, min)

  e.g. `pattern="x0x", symbol="x", min=0, max=1` → `"000"`.

* If no wildcard, yield as-is


#### Notes

1. **Flexibility**: Works for any wildcard and range.

2. **Efficiency**: Minimal iteration, not brute force.

3. **Scalability**: Handles multiple wildcards.


---

### `pivotPattern` Resolving symbol that can appear only one

When defining next-state patterns, we use the `s` character to indicate a swap. A material can swap to only one position at a time, so `pivotPattern` returns a generator that iterates through all permutations where the wildcard symbol appears only once. It replaces this wildcard with the actual symbol (the material number in our case), while other wildcard symbols are replaced with `clearSymbol` (Air in our case).

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

The function works by first replacing all wildcard characters with the `clearSymbol`. Then, one by one, it assigns the pivot on a copy of the `basePattern` and yields the result.

#### **Example:**

Input `pattern = "s0s"` `wild = "s"` `clearSymbol= "0"` `symbol = "1"`

1. Create `basePattern`: Replace all `s` with `0` → `["0", "0", "0"]`

2. Loop through matches, yielding

   * First `s` (index 0): Replace `basePattern[0]` with `1` → `["1", "0", "0"]` → Yield `"100"`

   * Second `s` (index 2): Replace `basePattern[2]` with `1` → `["0", "0", "1"]` → Yield `"001"`


#### Notes

1. **Efficiency**: Generates all valid swap outcomes without redundant work.

2. **Memory-Friendly**: Uses a single base pattern and modifies it in place.


---

## What Next

