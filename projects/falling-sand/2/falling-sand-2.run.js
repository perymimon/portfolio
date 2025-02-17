import {FrameEngine} from '../../_glossary/FrameEngine.js'
import Pointer from '../../_glossary/Pointer.js'
import {setCanvas} from '../../_helpers/basic.js'
import {fetchArrayBuffer, savedArrayBuffer} from '../../_helpers/files.js'
import {randomItem} from '../../_math/math.js'
import {defineStates} from './generator.js'
import Grid from './Grid-2.js';
import './generator.js'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
setCanvas(canvas)

const cols = 100, rows = 100
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

var grid = new Grid(cols, rows)
var pointer = new Pointer(canvas)

// grid.setCell(2, 0, 4)
// grid.setCell(2, 2, 3)


var symbols = 'A_SW'
var statesMachine = new Map
const materials = {
    symbols: symbols,
    S: {
        name: 'Sand',
        color: [60, 42],
    },
    W: {
        name: 'Water',
        color: [200, 210],
    },
}
/*
 Input pattern:
 - x don't care
 - f any material not empty
 - 0 Air or empty
 - Cap-letter specific material

 Output pattern:
  - s swap with the value. if couple in pattern 1 pick one
  - c clone/copy to that spot
  - 0 not change the target (like don't care)
  - Cap-letter specific material
 */

/* SAND */
defineStates(statesMachine, 'x0x xSx xxx', '0s0', symbols)
defineStates(statesMachine, '0f0 xSx xxx', 's0s', symbols)
defineStates(statesMachine, 'ff0 xSx xxx', '00s', symbols)
defineStates(statesMachine, '0ff xSx xxx', 's00', symbols)
defineStates(statesMachine, 'fff xSx xxx', '000 0s0', symbols)
defineStates(statesMachine, 'xWx xSx xxx', '0S0 0W0', symbols)

defineStates(statesMachine, 'x0x xWx xxx', '0s0', symbols)
defineStates(statesMachine, '0f0 xWx xxx', 's0s', symbols)
defineStates(statesMachine, 'ff0 xWx xxx', '00s', symbols)
defineStates(statesMachine, '0ff xWx xxx', 's00', symbols)
defineStates(statesMachine, 'fff fWf xxx', '000 0s0', symbols)
defineStates(statesMachine, 'fff xW0 xxx', '000 00s', symbols)
defineStates(statesMachine, 'fff 0Wf xxx', '000 s00', symbols)


materials.M = {
    color: [120, 122],
}

// fillStates(statesMachine, 'fff 0M0 xxx', '0+0 000 000', symbols)

function update () {
    // console.time('update')
    for (let i = grid.cells.length; i >= 0; i--) {
        let {x, y} = grid.xy(i)

        let cell = grid.getCell(x, y)
        if (!cell) continue
        let state = grid.getChunk(x, y)
        let newState = statesMachine.get(state)
        if (!newState) {
            let symbol = materials.symbols[cell]
            console.warn(`${symbol}/${cell}: no new state for ${state}`)
            continue
        }
        if (Array.isArray(newState)) newState = randomItem(newState)
        grid.setCell(x, y, 0)
        grid.setChunk2(cell, x, y, newState, 'pad')
    }
    // console.timeEnd('update')
}

pointer.onPress = ((e) => {
    var {x, y} = e
    var material = getSelectedMaterial()
    let cellX = Math.floor(x / cellWidth)
    let cellY = Math.floor(y / cellHeight)
    grid.setCell(cellX, cellY, material)
    // grid.setChunk2(material, cellX, cellY, '00101010', 'pad')
})

// Start simulation
new FrameEngine(10, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, cellWidth, cellHeight, materials)
    update()
}).start()

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector').querySelector('input[type=radio]:checked')
    return materials.symbols.indexOf(input.value)
}

/* --------  Fake Mouse ------- */
var fakeMouse = document.getElementById('mouse')

var animationMouse = new FrameEngine(60, function () {
    var {x, y} = fakeMouse.getBoundingClientRect()
    pointer.onPress({x, y})
}).start()

pointer.onTap = e => animationMouse.stop()

/* load / saved grid */
try{
    var blob = await fetchArrayBuffer('./saved-grid.hex')
    grid.cells.set(new Uint8Array(blob), 0)
}
catch(err){ console.log(err) }

var $button = document.getElementById('saved-btn')
$button.addEventListener('click', e => {
    savedArrayBuffer(grid.cells, 'saved-grid.hex')
})

