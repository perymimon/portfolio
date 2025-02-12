import {FrameEngine} from '../../_glossary/FrameEngine.js'
import Pointer from '../../_glossary/Pointer.js'
import {randomItem} from '../../_math/math.js'
import {fillStates} from './generator.js'
import Grid from './Grid-2.js';
import './generator.js'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false
const cols = 10, rows = 10
const cellSize = 10;
canvas.width = cols * cellSize
canvas.height = rows * cellSize

var grid = new Grid(cols, rows)
var nextGrid = new Grid(cols, rows)
var pointer = new Pointer(canvas)

grid.setCell(2, 0, 2)
grid.setCell(2, 2, 3)

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

var materials = 'A_SW'
const materialsStates = {}
/* SAND */
const sandStates = new Map()
fillStates(sandStates, 'S', 'x0x', '0s0', materials)
fillStates(sandStates, 'S', '0f0', 's0s', materials)
fillStates(sandStates, 'S', 'ff0', '00s', materials)
fillStates(sandStates, 'S', '0ff', 's00', materials)
fillStates(sandStates, 'S', 'fff', '0000s0', materials)
fillStates(sandStates, 'S', 'xWx', '0s0', materials)
materialsStates.S = {
    mask:'111',
    stateMachine:sandStates
}
/* WATER */
const watterStates = new Map()
fillStates(watterStates, 'W', 'x0x xx x', '0s0', materials)
fillStates(watterStates, 'W', '0f0 xx x', 's0s', materials)
fillStates(watterStates, 'W', 'ff0 xx x', '00s', materials)
fillStates(watterStates, 'W', '0ff xx x', 's00', materials)
fillStates(watterStates, 'W', 'fff xx x', '000 0s0', materials)
fillStates(watterStates, 'W', 'fff xx S', '000 000 0s0', materials)
fillStates(watterStates, 'W', 'fff f0 S', '000 00s', materials)
fillStates(watterStates, 'W', 'fff 0f S', '000 s00', materials)

materialsStates.W =  {
    mask:'111101010',
    stateMachine:watterStates
}

// fillStates(stateMachine, 'W', '111010', '000101', materials)
// /* MATRIX */
// fillStates(stateMachine,'M','xxx','0+0',materials )
//↻⟳⟲↺⇄∅
// output 0 is not change
// output 1 is
// stateMachine.set(0x020_000, 0x010)
// stateMachine.set(0x020_001, 0x010)
// stateMachine.set(0x020_010, [0x100, 0x001])
// stateMachine.set(0x020_011, 0x100)
// stateMachine.set(0x020_100, 0x010)
// stateMachine.set(0x020_101, 0x010)
// stateMachine.set(0x020_110, 0x001)
//
// stateMachine.set(0x030_000, 0x030)
// stateMachine.set(0x030_001, 0x030)
// stateMachine.set(0x030_100, 0x030)
// stateMachine.set(0x030_101, 0x030)
//
// stateMachine.set(0x030_020, 0x020_030)
// stateMachine.set(0x030_021, 0x020_030)
// stateMachine.set(0x030_120, 0x020_030)
// stateMachine.set(0x030_121, 0x020_030)
//
// stateMachine.set(0x030_010, 0x300)
// stateMachine.set(0x030_111)
// stateMachine.set(0x030_011, 0x300)
// stateMachine.set(0x030_110, 0x003)
//
// stateMachine.set(0x030_010, 0x300)
// stateMachine.set(0x030_111)
// stateMachine.set(0x030_011, 0x300)
// stateMachine.set(0x030_110, 0x003)

// stateMachine.set(0x131_000, 0x040)
// stateMachine.set(0x141_000, 0x050)
// stateMachine.set(0x151_000, null)

function update () {
    // console.time('update')
    for (let i = grid.cells.length; i >=0 ; i--) {
        let {x, y} = grid.xy(i)

        let cell = grid.getCell(x, y)
        if (!cell) continue
        let symbol = materials[cell]
        let {stateMachine,mask} = materialsStates[symbol]
        let state = grid.getChunk(x, y, mask, 'pad', 1)

        let newState = stateMachine.get(state)
        if(!newState) {
            console.warn(`${symbol}/${cell}: no new state for ${state}`)
            continue
        }

        if (Array.isArray(newState)) newState = randomItem(newState)
        nextGrid.setChunk2(cell, x, y, newState, 'pad')
    }
    swapBuffers()
    // console.timeEnd('update')
}

var hsl = 20
pointer.onPress = (({x, y}) => {
    var material = getSelectedMaterial()

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
    grid.draw(ctx, cellSize, {
        [materials.indexOf('S')]: [60, 42],
        [materials.indexOf('W')]: [200, 210],
    })
    update()
}).start()

function getSelectedMaterial () {
    var input = document.querySelector('#material-selector').querySelector('input[type=radio]:checked')
    return materials.indexOf(input.value)
}