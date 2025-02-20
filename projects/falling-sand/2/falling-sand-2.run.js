import {FrameEngine} from '../../_glossary/FrameEngine.js'
import Pointer from '../../_glossary/Pointer.js'
import {fetchArrayBuffer, savedArrayBuffer} from '../../_helpers/files.js'
import {randomItem} from '../../_math/math.js'
import defineStates from './define-states.js'
import Grid from './Grid-2.js';

const cols = 400, rows = 400
var grid = new Grid(cols, rows)
window.grid = grid
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const cellSize = 10
canvas.width = cols * cellSize
canvas.height = rows * cellSize

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


const symbols = 'ASW' // Air, Sand, Water
const materials = {
    symbols,
    S: { name: 'Sand', color: [60, 42] }, // Yellow hues
    W: { name: 'Water', color: [200, 210] }, // Blue hues
}

new FrameEngine(60, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, cellSize, cellSize, materials) //<- update
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
  - Cap-letter specific material
 */
const stateMachine = new Map()
/*  Sand Rules */
defineStates(stateMachine, 'x0x xSx xxx', '0s0', symbols) // Flow down
defineStates(stateMachine, '0f0 xSx xxx', 's0s', symbols) // Flow diagonal random
defineStates(stateMachine, 'ff0 xSx xxx', '00s', symbols) // Flow right diagonal
defineStates(stateMachine, '0ff xSx xxx', 's00', symbols) // Flow left diagoal
defineStates(stateMachine, 'fff xSx xxx', '000 0s0', symbols) // Settle

/* Water Rules */
defineStates(stateMachine, 'x0x xWx xxx', '0s0', symbols) // Flow down
defineStates(stateMachine, '0f0 xWx xxx', 's0s', symbols) // Flow diagonal random
defineStates(stateMachine, 'ff0 xWx xxx', '00s', symbols) // Flow right diagonal
defineStates(stateMachine, '0ff xWx xxx', 's00', symbols) // Flow left diagoal
defineStates(stateMachine, 'fff xW0 xxx', '000 00s', symbols) // Flows right when empty
defineStates(stateMachine, 'fff 0Wf xxx', '000 s00', symbols) // Flows left when blocked right and left empty
defineStates(stateMachine, 'xWx xSx xxx', '0S0 0W0', symbols) // Swap with sand


var pointer = new Pointer(canvas)

pointer.onPress = ({x, y}) => {
    let {width, height} = canvas.getBoundingClientRect()
    let cellX = Math.floor(x/ (cellSize * (width / canvas.width)))
    let cellY = Math.floor(y/ (cellSize * (height / canvas.height)))
    let material = getSelectedMaterial() // < update
    grid.setCell(cellX, cellY, material)
}

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector').querySelector('input[type=radio]:checked')
    return materials.symbols.indexOf(input.value)
}

/* --------  Fake Mouse ------- */
var fakeMouse = document.getElementById('mouse')

var animationMouse = new FrameEngine(10, function () {
    var {x, y} = fakeMouse.getBoundingClientRect()
    pointer.onPress({x, y})
}).start()

pointer.onTap = e => animationMouse.stop()

// /* load / saved grid */
// try{
//     var blob = await fetchArrayBuffer('./saved-grid.hex')
//     grid.cells.set(new Uint8Array(blob), 0)
// }
// catch(err){ console.log(err) }
//
// var $button = document.getElementById('saved-btn')
// $button.addEventListener('click', e => {
//     savedArrayBuffer(grid.cells, 'saved-grid.hex')
// })

