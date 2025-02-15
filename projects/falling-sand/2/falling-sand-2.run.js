import {FrameEngine} from '../../_glossary/FrameEngine.js'
import Pointer from '../../_glossary/Pointer.js'
import {randomItem} from '../../_math/math.js'
import {fillStates} from './generator.js'
import Grid from './Grid-2.js';
import './generator.js'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false
const cols = 400, rows = 400
const cellSize = 10;
canvas.width = cols * cellSize
canvas.height = rows * cellSize

var grid = new Grid(cols, rows)
var nextGrid = new Grid(cols, rows)
var pointer = new Pointer(canvas)

grid.setCell(2, 0, 4)
// grid.setCell(2, 2, 3)

function swapBuffers () {
    let temp = nextGrid
    nextGrid = grid
    grid = temp
    nextGrid.clear()
}

// input: 0 is empty cell | 1 is not empty cell
// output: 0 is not change | 1 is clone the value
/******
 Input pattern:
 x don't care
 0 is empty
 f there is something not zero
 ch specific material
 -----
 2 everything but me

 Output pattern: 4bits (0-15)
 0 not change
 ✅ s -  swap with the value. if more than one 1 choose one
 ✅ c clone/copy to that spot
 */

var symbols = 'A_SWMMM'
const materials = {
    symbols: symbols,

}
/* SAND */
materials.S = {
    color: [60, 42],
    mask: '111',
    states: new Map(),
}
fillStates(materials.S.states, 'S', 'x0x', '0s0', symbols)
fillStates(materials.S.states, 'S', '0f0', 's0s', symbols)
fillStates(materials.S.states, 'S', 'ff0', '00s', symbols)
fillStates(materials.S.states, 'S', '0ff', 's00', symbols)
fillStates(materials.S.states, 'S', 'fff', '0000s0', symbols)
fillStates(materials.S.states, 'S', 'xWx', '0s0', symbols)

/* WATER */
materials.W = {
    color: [200, 210],
    mask: '111101010',
    states: new Map(),
}

fillStates(materials.W.states, 'W', 'x0x xx x', '0s0', symbols)
fillStates(materials.W.states, 'W', '0f0 xx x', 's0s', symbols)
fillStates(materials.W.states, 'W', 'ff0 xx x', '00s', symbols)
fillStates(materials.W.states, 'W', '0ff xx x', 's00', symbols)
fillStates(materials.W.states, 'W', 'fff xx x', '000 0s0', symbols)
fillStates(materials.W.states, 'W', 'fff xx S', '000 000 0s0', symbols)
fillStates(materials.W.states, 'W', 'fff f0 S', '000 00s', symbols)
fillStates(materials.W.states, 'W', 'fff 0f S', '000 s00', symbols)

materials.M =  {
    color: [120, 122],
    mask:'000010',
    states: new Map(),
}

fillStates(materials.M.states, 'M', 'M', '0+0', symbols)

function update () {
    // console.time('update')
    for (let i = grid.cells.length; i >= 0; i--) {
        let {x, y} = grid.xy(i)

        let cell = grid.getCell(x, y)
        if (!cell) continue
        let symbol = materials.symbols[cell]
        let {states, mask} = materials[symbol]
        let state = grid.getChunk(x, y, mask, 'pad', 1)

        let newState = states.get(state)
        if (!newState) {
            console.warn(`${symbol}/${cell}: no new state for ${state}`)
            continue
        }

        if (Array.isArray(newState)) newState = randomItem(newState)
        nextGrid.setChunk2(cell, x, y, newState, 'pad')
    }
    swapBuffers()
    // console.timeEnd('update')
}

pointer.onPress = ((e) => {
    var {x, y, target}  = e
    var material = getSelectedMaterial()
    console.log(x, e.clientX, e.offsetX)
    let {width, height} = canvas.getBoundingClientRect()
    let ratioW = width / canvas.width
    let ratioH = height / canvas.height
    let cellX = Math.floor(x / (cellSize * ratioW))
    let cellY = Math.floor(y / (cellSize * ratioH))

    grid.setCell(cellX, cellY, material)
    // grid.setChunk2(material, cellX, cellY, '00101010', 'pad')
})

// Start simulation
new FrameEngine(10, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, cellSize, materials)
    update()
}).start()

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector').querySelector('input[type=radio]:checked')
    return materials.symbols.indexOf(input.value)
}