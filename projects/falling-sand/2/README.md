In the [first part](https://perymimon.hashnode.dev/building-a-falling-sand-simulation-with-html-canvas) [of this se](https://perymimon.hashnode.dev/building-a-falling-sand-simulation-with-html-canvas)ries, we built a basic falling sand simulation using HTML Canvas and cellular automata. Now, we’ll expand the simulation to support **multiple materials** (like water) and introduce a more sophisticated state machine to handle complex interactions.

* * *

Introduction
------------

Our previous simulation focused on sand particles that fell downward or diagonally based on three cells below them. But water behaves differently—it flows sideways, swaps places with sand, and requires checking more neighboring cells. checking more cell lead to bigger paramutations and complexity to support this, we’ll:

1.  Use **symbols** (`A`, `S`, `W`) instead of numbers for clarity.

2.  Expand the state machine to handle **full 8 neighboring cells** + **Target cell** (up from 3).

3.  Introduce helper functions to **auto-generate state transitions**, avoiding manual definitions for 729+ states.


Let’s dive in!

* * *

Step 1: Symbolic Representation
-------------------------------

If we define 0 for Air and 1 for Sand now we have 2 for Water, but instead of using `0`, `1`, `2` for materials, we’ll map them to letters for readability:

JavaScript

    const symbols = 'ASW'; // Air, Sand, Water

This makes rules like `S` (sand) sinking into `W` (water) easier to reason about. so for example: `ASS` say Air near to Sand near to Sand

* * *

Step 2: Expanded State Machine
------------------------------

### Why Expand?

Sand only needed to check the three cells below it. Water requires checking **6 cells** (3 below like the sand and left, right, and above), increasing possible states to `3^6 = 729`. Manually defining these is impractical, so we’ll auto-generate them.

### The `defineStates` Helper

to tackle this JS to rescue! as a script language we can define a function that take patterns and their outcomes using wildcards and fill the `SatateMachine` with all details pattern

*   `s` for “swap” (if multiple possible `s` in the pattern , pick one)

*   `x` for “any material” or “don’t care” in logical language

*   `A` `S` `W` (Capitals) as explicit index on the `symbol` string


JavaScript

    export function defineStates(stateMachine, pattern, nextStatePattern, materials) {
      // Implementation details (see full code bellow)
    }

#### Example Rule: Sand Sinking into Water

JavaScript

    defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols);

This swaps sand (`S`) and water (`W`) when sand is above water.

* * *

Step 3: Updated Grid Class
--------------------------

Switching from numbers to strings changes the reading direction: strings start from the left, while numbers often consider the rightmost digit as the starting point. so we need to update the `Grid` also


JavaScript

    // Grid.js
    //We’ll modify the Grid class to handle 3x3 chunks as strings (e.g., AASWWAAAS):
    class Grid {
      getChunk(x, y) {
        // Returns a 9-character string representing the 3x3 neighborhood
        let pattern = [];
         for (let dy = 1; dy >= -1; dy--) {
          for (let dx = -1; dx <= 1; dx++) { // left to right
            const cell = this.getCell(x + dx, y + dy);
            pattern.push(symbols[cell]);
          }
        }
        return pattern.join('');
      }
    
      setChunk(value, x, y, pattern) {
        // Updates cells based on the pattern ( 9 byte )
        let index = -1;
        for (let dy = 1; dy >= -1; dy--) {
          for (let dx = -1; dx <= 1; dx++) {
             let symbol = pattern[++index] // <- updated
             if (symbol === '0') continue  // <- update
             this.setCell(x + dx, y + dy, symbol );
          }
        }
      }
    }

* * *

Step 4: Sand Behavior Rules
---------------------------

define again the sand rules in the new pattern method

### Key Sand Rules

1.  **Flow Downward** if the direct cell below is empty.

2.  **Flow Diagonal** if direct below is full and one diagonal is empty

3.  **Settle on ground** if 3 cells below full


#### Code Implementation

JavaScript

    // Sand flows down
    defineStates(statesMachine, 'x0x xSx xxx', '0s0', symbols) // direct cell below empty
    defineStates(statesMachine, '0f0 xSx xxx', 's0s', symbols) // two diagonals empty
    defineStates(statesMachine, 'ff0 xSx xxx', '00s', symbols) // right diagonal empty
    defineStates(statesMachine, '0ff xSx xxx', 's00', symbols) // left diagoal empty
    // Settle on ground
    defineStates(statesMachine, 'fff xSx xxx', '000 0s0', symbols) // 3 cells are not empty

Step 4: Water Behavior Rules
----------------------------

### Key Water Rules

1.  **Flow Downward** if the cell below is empty.

2.  **Flow Sideways** if blocked below.

3.  **Swap with Sand** when colliding.


#### Code Implementation

JavaScript

    // Water flows down
    defineStates(stateMachine, 'x0x xWx xxx', '0s0', symbols);
    
    // Water flows sideways when blocked
    defineStates(stateMachine, 'fff xW0 xxx', '000 00s', symbols); // Right
    defineStates(stateMachine, 'fff 0Wf xxx', '000 s00', symbols); // Left
    
    // Swap with sand
    defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols);

* * *

Step 5: Visualizing Materials
-----------------------------

In the previous implementation, we simply defined a color for "sand" in the draw function. However, with the introduction of multiple materials, we need to assign a distinct range of colors to each material to ensure they are easily distinguishable from one another. This involves selecting specific hues or shades for each material type, such as sand, water, and air, so that they can be visually differentiated

### Color Coding

Assign hues to materials for visual distinction:

JavaScript

    const materials = {
      symbols: 'ASW',
      S: { name: 'Sand', color: [60, 42] }, // Yellow hues
      W: { name: 'Water', color: [200, 210] }, // Blue hues
    };

### Updated Rendering

JavaScript

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

* * *

Step 6: Adding a Material Selector
----------------------------------

Before testing, let's add a UI element to select different materials. This will allow draw with sand, water, or a placeholder "matrix" material (coming in Part 3).

### HTML & CSS

Add this HTML above the canvas and style it appropriately:

HTML, XML

    <div class="group-base" id="material-selector">
        <label class="label-base">
            Sand
            <input type="radio" name="material" value="S" checked>
        </label>
        <label class="label-base">
            Water
            <input type="radio" name="material" value="W">
        </label>
        <label class="label-base">
            Matrix (Part 3)
            <input type="radio" name="material" value="M" disabled>
        </label>
    </div>
    <canvas id="canvas1"></canvas>
    
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
            background: rgba(255, 255, 255, 0.9);
            padding: 0.5rem;
            border-radius: 0.5rem;
        }
    
        .label-base {
            cursor: pointer;
            display: block;
            margin: 0.25rem 0;
        }
    </style>

### JavaScript Integration

Update the pointer handler to use the selected material:

JavaScript

    pointer.onPress = ({x, y}) => {
        var material = getSelectedMaterial()
        let cellX = Math.floor(x / cellWidth)
        let cellY = Math.floor(y / cellHeight)
        grid.setCell(cellX, cellY, material)
    }

Step 7: Testing the Simulation
------------------------------

Now you can test different materials

But when preparing to test your code it better reducing the grid size to simplify the debugging apparently on 400X400 cell in current implantation will be a performance issue. Also this can help you focus on verifying the basic functionality with a single grain of sand first. Once you're confident that the sand behaves as expected, you might want to explore how water interacts within the simulation. Keep in mind that the `defineStates` implementation is still pending, so full testing might not be possible yet.

JavaScript

    const grid = new Grid(10, 10); // 10x10 grid
    grid.setCell(2, 0, symbols.indexOf('S')); // Sand at (2,0)
    //grid.setCell(5, 5, symbols.indexOf('W')); // Water at (5,5)

### Demo

<iframe src="[https://perymimon.github.io/portofolio/projects/falling-sand/2"></iframe>](https://perymimon.github.io/portofolio/projects/falling-sand/2"></iframe>)

**Building the Rule Engine:** `defineState`
-------------------------------------------

Let’s face it—manually coding hundreds of rules for sand, water, and other materials sounds like a nightmare. In this section, we’ll break down the `defineStates` system, a pattern-based helper that lets you define **complex material interactions** with just a few lines of code and prevent Human Error and open the gate for Scalability: Adding lava/gas later would multiply the work exponentially.

### `replicaPatterns` generator

**Wildcards (**`x`, `f`) let you write **one rule** that represents **many scenarios**.  
In the pattern rules we define `x` and `f` to auto-generates **all possible combinations** of these wildcards because the state machine is just a giant lookup table—it can’t reason dynamically.

1.  `x` = "Any Material": `x0x` could mean `A0A` (air-air), `S0S` (sand-air-sand), `W0W` (water-air-water), etc.

2.  `f` = "Not Air": `f0f` becomes `S0S`, `W0W`, `S0W`, etc.—any combination where `f` isn’t air.


so need function that get `string pattern` `magic symbol` `range values` and generate all possible pattern

JavaScript

    /**
     * Generates all possible patterns by replacing wildcards in the input pattern.
     * 
     * @param {string} pattern - A string with one type of wildcard (e.g., x0x).
     * @param {string} symbol - The wildcard character to replace (e.g., x or f).
     * @param {number} min - The starting value for replacements (e.g., 0 for air).
     * @param {number} max - The ending value (exclusive) for replacements (e.g., 3 for air, sand, water).
     */
    function* replicaPatterns (pattern, symbol, min, max) {
        const range = max - min; // the `base` of numbers to replace 'symbol'
        if (range === 1) return yield pattern.replaceAll(symbol, min)
        // Split the pattern around the wildcard symbol
        parts = pattern.split(symbol)
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

### How it Work:

The core principle of the function involves `counting` _base of_ `range` and number digit in the number is the number of wildcard symbols appears in the pattern. For example, if the range is 3 (values 0 to 2) and the symbol appears 2 times, the counting will be `00` `01` `02` `10` `11` `12` `20` `21` and `22`. This is achieved by treating each combinations as numbers in a base equal to the range, iterating through all possible values, and replacing the wildcards each with each digit

The next principle is to split the pattern around the target symbol and then “inject” the digits from the previous step each digit in each gap.

To calculate the total iterations :

JavaScript

    const parts= pattern.length - 1; // Number of wildcards 
    const totalIterations = Math.pow(range, parts); // e.g., 3^2 = 9

Then loop through all number and convert them to the same number base `range`

JavaScript



    for (let i = 0; i < totalIterations; i++) {
      const digits = i.toString(range).padStart(xs, '0').split('');
      yield digits.reduce((res, d, i) => res + (min + +d) + pattern[i + 1], pattern[0]);
    }

**Example:**

Input: `pattern = "x0x"` `symbol = "x"` `min = 0` `max = 3`

1.  split the pattern : `pattern.split("x") → ["", "0", ""]`

2.  This means there are **2 wildcards** (`xs = 2`)

3.  Total Iterations : `Math.pow(3, 2) → 9`

4.  **Loop Through Iterations** and yield it

    1.  `i = 0` → `00` → Replace `x`s → `0` `0` → **000**

    2.  `i = 1` → `01` → Replace `x`s → `0` `1` → **010**

    3.  `i = 2` → `02` → Replace `x`s → `0` `2` → **020**

    4.  `i = 3` → `10` → Replace `x`s → `1` `0` → **100**

    5.  `i = 4` → `11` → Replace `x`s → `1` `1` → **110**

    6.  `i = 5` → `12` → Replace `x`s → `1` `2` → **120**

    7.  `i = 6` → `20` → Replace `x`s → `2` `0` → **200**

    8.  `i = 7` → `21` → Replace `x`s → `2` `1` → **210**

    9.  `i = 8` → `22` → Replace `x`s → `2` `2` → **220**


**Handle Edge Cases:**

*   When `range == 1` return pattern.replaceAll(symbol, min)

    Example: `pattern="x0x", symbol="x", min=0, max=1` → `"000"`.

*   When pattern doesn’t contain the wildcard, yield it as-is:  
    `if (pattern.length === 1) return yield` [`pattern.at`](http://pattern.at)`(0)`


### Advantages of the function

1.  **Flexibility**: Works for any wildcard (`x`, `f`, etc.) and any range of values.

2.  **Efficiency**: Generates combinations mathematically instead of brute-forcing.

3.  **Scalability**: Handles patterns with multiple wildcards (e.g., `xxffx`).