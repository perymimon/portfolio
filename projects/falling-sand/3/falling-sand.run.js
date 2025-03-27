import {FrameEngine} from '../../../src/glossary/FrameEngine.js'
import Pointer from '../../../src/glossary/Pointer.js'
import {fetchArrayBuffer, savedArrayBuffer} from '../../../src/helpers/files.js'
import {random, randomItem} from '../../../src/math/math.js'
import defineStates, {maskedPattern} from './define-states.js'
import Grid from './Grid.js';

const cols = 200, rows = 200
var grid = new Grid(cols, rows)
var touched = new Grid(cols, rows)
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const cellSize = 10
canvas.width = cols * cellSize
canvas.height = rows * cellSize

function update () {
    // console.time('update')
    for (let i = grid.cells.length - 1; i > 0; i--) {
        const {x, y} = grid.xy(i)

        const cell = grid.getCell(x, y)
        if (!cell) continue
        const touch = touched.getCell(x, y)
        if (touch) continue
        if(random(0,10000)>9995) grid.setCell(x, y, symbols.indexOf('M')) //Eraser
        let sym = symbols.at(cell)
        // if (random(0, 10000) > 9998) grid.setCell(x, y, symbols.indexOf('M'))
        const state = grid.getChunk(x, y)
        for (let mask of masks) {
            let masked = maskedPattern(state, mask)
            var newState = stateMachine.get(masked)
            if (newState) break
        }

        if (Array.isArray(newState)) newState = randomItem(newState)
        if (!newState) continue
        grid.setCell(x, y, 0)
        grid.setChunk(x, y, newState)
        touched.setCell(x, y, 0)
        touched.setChunk(x, y, newState)
    }
    // console.timeEnd('update')
    touched.cells.fill(0)
}

new FrameEngine(20, function ({detail: {frames}}) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, frames, cellSize, cellSize, materials) //<- update
    update()
}).start()


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
  - + count and disappear
  - Cap-letter specific material
 */
var symbols = 'ASWMMEEBGQ' // Air, Sand, Water
var materials = {
    symbols,
    // color: [hue, range, speed, xf, yf]
    S: {name: 'Sand', color: [60, 40, 30, 11, 2]}, // Yellow hues
    W: {name: 'Water', color: [200, 20, 40, -1, 11]}, // Blue hue
    M: {name: 'Matrix', color: [120, 20, 80, -11, 1]}, // Green hue
    B: {name: 'brush', color: [290, 50, 50, 0, 0]}, // Pink hue
    G: {name: 'gas', color: [180, 30, 50, 0, 7]}, // azure hue
    Q: {name: 'stone', color: [20, 10, 0, 1, 2]}, // azure hue
}
const stateMachine = new Map()
const masks = new Set()
window.grid = grid
window.stateMachine = stateMachine
window.masks = masks

/*  Sand Rules */
defineStates(stateMachine, masks, 'x0x xSx xxx', '0s0', symbols) // Flow down
defineStates(stateMachine, masks, '0f0 xSx xxx', 's0s', symbols) // Flow diagonal random
defineStates(stateMachine, masks, 'ff0 xSx xxx', '00s', symbols) // Flow right diagonal
defineStates(stateMachine, masks, '0ff xSx xxx', 's00', symbols) // Flow left diagoal
defineStates(stateMachine, masks, 'fff xSx xxx', '000 0s0', symbols) // Settle

/* Water Rules */
defineStates(stateMachine, masks, 'x0x xWx xxx', '0s0', symbols) // Flow down
defineStates(stateMachine, masks, '0f0 xWx xxx', 's0s', symbols) // Flow diagonal random
defineStates(stateMachine, masks, 'ff0 xWx xxx', '00s', symbols) // Flow right diagonal
defineStates(stateMachine, masks, '0ff xWx xxx', 's00', symbols) // Flow left diagoal
defineStates(stateMachine, masks, 'fff xW0 xxx', '000 00s', symbols) // Flows right when empty
defineStates(stateMachine, masks, 'fff 0Wf xxx', '000 s00', symbols) // Flows left when blocked right and left empty
defineStates(stateMachine, masks, 'xWx xSx xxx', '0S0 0W0', symbols) // Swap with sand

/* Matrix Rules */
defineStates(stateMachine, masks, 'xxx xMx xxx', ['0+0 0+0 000', '0s0 0s0 000'], symbols) //Fall down and increment
defineStates(stateMachine, masks, 'xxx xMx xMx', ['0M0 0M0 0M0'], symbols) //Fall down and increment

// magical spark
defineStates(stateMachine, masks, 'xxx xBx xxx', '+s+ sss', symbols) //Fall like spray
defineStates(stateMachine, masks, 'xfx xBx xxx', '000 000', symbols) //disappear without damage
/* GAS */
defineStates(stateMachine, masks, 'SSS WWW WWW', ['000 sss sss', '000 0G0 000'], symbols) //bubbles up
defineStates(stateMachine, masks, 'xSx xGx xWx', ['000 0W0 0G0'], symbols) //bubbles up
defineStates(stateMachine, masks, 'xWx xGx xWx', ['0W0 0W0 0G0'], symbols) //bubbles up
defineStates(stateMachine, masks, 'xxx xGx xAx', ['000 0W0 000'], symbols) //bubbles up

var pointer = new Pointer(canvas)

pointer.onPress = ({x, y}, e, mouse, material = getSelectedMaterial()) => {
    let {width, height} = canvas.getBoundingClientRect()
    let cellX = Math.floor(x / (cellSize * (width / canvas.width)))
    let cellY = Math.floor(y / (cellSize * (height / canvas.height)))
    var brush = Array(5).fill(material).join('0')
    grid.setChunk(cellX, cellY, brush)
}

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector').querySelector('input[type=radio]:checked')
    return materials.symbols.indexOf(input.value)
}

/* --------  Fake Mouse ------- */
var fakeMouse1 = document.getElementById('mouse-1')
var fakeMouse2 = document.getElementById('mouse-2')
var fakeMouse3 = document.getElementById('mouse-3')

var animationMouse = new FrameEngine(10, function () {
    {
        let {x, y} = fakeMouse1.getBoundingClientRect()
        pointer.onPress({x, y})
    }
    {
        let {x, y} = fakeMouse2.getBoundingClientRect()
        let m = materials.symbols.indexOf('S')
        pointer.onPress({x, y}, null, null, m)
    }
    {
        let {x, y} = fakeMouse3.getBoundingClientRect()
        let m = materials.symbols.indexOf('B')
        pointer.onPress({x, y}, null, null, m)
    }


}).start()

pointer.onTap = e => animationMouse.stop()

/* load / saved grid */
try {
    var blob = await fetchArrayBuffer(`saved-grid${cols}X${rows}.hex`)
    grid.cells.set(new Uint8Array(blob), 0)
} catch (err) { console.log(err) }

var $button = document.getElementById('saved-btn')
$button?.addEventListener('click', e => {
    savedArrayBuffer(grid.cells, `saved-grid${cols}X${rows}.hex`)
})

var $clear = document.getElementById('clear-btn')
$clear?.addEventListener('click', e => {
    grid.cells.fill(0)
})