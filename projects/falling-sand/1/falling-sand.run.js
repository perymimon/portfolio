import {FrameEngine} from '../../_glossary/FrameEngine.js'
import Pointer from '../../_glossary/Pointer.js'
import {randomItem} from '../../_math/math.js'
import Grid from '../Grid.js';

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
// Enable high-quality rendering
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const cols = 400, rows = 400
const cellSize = 1;
canvas.width = cols * cellSize
canvas.height = rows * cellSize

var grid = new Grid(cols, rows)
var nextGrid = new Grid(cols, rows)
var pointer = new Pointer(canvas)

function swapBuffers () {
    let temp = nextGrid
    nextGrid = grid
    grid = temp
    nextGrid.clear()
}

const stateMachine = new Map()
stateMachine.set(0b000, 0b010)
stateMachine.set(0b001, 0b010)
stateMachine.set(0b010, [0b100, 0b001])
stateMachine.set(0b011, 0b100)
stateMachine.set(0b100, 0b010)
stateMachine.set(0b101, 0b010)
stateMachine.set(0b110, 0b001)
stateMachine.set(0b111, 0b010_000)

function update () {
    console.time('update')
    for (let i = 0; i < grid.cells.length; i++) {
        let {x, y} = grid.xy(i)

        let cell = grid.getCell(x, y)
        if (!cell) continue
        let state = grid.getChunk(x, y, 0b111, 'pad',  1)
        let newState = stateMachine.get(state)
        if (Array.isArray(newState)) newState = randomItem(newState)
        nextGrid.setChunk2(cell, x, y, newState, 'pad')
    }
    swapBuffers()
    console.timeEnd('update')
}
var hsl = 0
pointer.onPress = (({x,y})=>{
    let {width, height} = canvas.getBoundingClientRect()
    let ratioW = width / canvas.width
    let ratioH = height / canvas.height
    let cellX = Math.floor(x/ (cellSize * ratioW))
    let cellY = Math.floor(y/ (cellSize * ratioH))
    hsl = (hsl+1) % 20
    // grid.setCell(cellX, cellY, hsl)
    grid.setChunk2(40 + hsl,cellX, cellY, 0b101010101, 'pad')
})

// Start simulation
new FrameEngine(60, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw(ctx, cellSize)
    update()
}).start()
/* --------  Fake Mouse ------- */
var fakeMouse = document.getElementById('mouse')

var animationMouse = new FrameEngine(60, function () {
    var {x,y} = fakeMouse.getBoundingClientRect()
    pointer.onPress({x, y})
}).start()

pointer.onTap = e=> animationMouse.stop()

