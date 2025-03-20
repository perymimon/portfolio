import {FrameEngine} from '../_glossary/FrameEngine.js'
import Pointer from '../_glossary/Pointer.js'
import Timer from '../_glossary/Timer.js'
import {imageFrom, isLandscape, setCanvas} from '../_helpers/basic.js'
import {getImageData} from '../_helpers/filters.colors.js'
import {random} from '../_math/math.js'
import {StateMachine} from '../falling-sand/3/define-states.js'
// import {renderDOMToCanvas} from '../_helpers/draft-html-draw-canvas.js'
import Grid from '../falling-sand/3/Grid.js'

const sm = new StateMachine()
sm.defineMaterial('A', 'Air', [])
sm.defineMaterial('S', 'Sand', [60, 40, 30, 11, 2])
sm.defineMaterial('W', 'Water', [200, 20, 40, -1, 11])
// sm.defineMaterial('B', 'Block', [0, 10, 1, 3, 3])
sm.defineMaterial('B', 'Block', [-1, 10, 1, 3, 3])

/*  Sand Rules */
sm.defineStates('x0x xSx xxx', '0s0') // Flow down
sm.defineStates('0f0 xSx xxx', 's0s') // Flow diagonal random
sm.defineStates('ff0 xSx xxx', '00s') // Flow right diagonal
sm.defineStates('0ff xSx xxx', 's00') // Flow left diagonal
sm.defineStates('fff xSx xxx', '000 0s0') // Settle

/* Water Rules */
sm.defineStates('x0x xWx xxx', '0s0') // Flow down
sm.defineStates('0f0 xWx xxx', 's0s') // Flow diagonal random
sm.defineStates('ff0 xWx xxx', '00s') // Flow right diagonal
sm.defineStates('0ff xWx xxx', 's00') // Flow left diagonal
sm.defineStates('fff xW0 xxx', '000 00s') // Flows right when empty
sm.defineStates('fff 0Wf xxx', '000 s00') // Flows left when blocked right and left empty
sm.defineStates('xWx xSx xxx', '0S0 0W0') // Swap with sand


var canvas = document.getElementById("canvas1")
var ctx = canvas.getContext("2d")
setCanvas(canvas, document.querySelector('main'))
var {width} = canvas

let replicaImage = await imageFrom('./replica-landscape-2.png')
let {height} = replicaImage

var grid = new Grid(width, height)
var touched = new Grid(width, height)

function resetGrid () {
    grid.cells.fill(0)
    let imageData = getImageData(replicaImage)
    // ctx.drawImage(replicaImage, 0, 0, width, height, 0, 0, width, height)
    grid.setImageData(0, 0, imageData, function toMaterials (r, g, b, a) {
        if (r === 255 && b === 255 && g === 0) return null
        return sm.symbols.indexOf('B')
    })
}

resetGrid()

async function throwSandAndWater () {
    let imageUrl = isLandscape() ?'./my-name-landscape.png':'./my-name-portrait.png'
    let myNameImage = await imageFrom(imageUrl)
    let imageData = getImageData(myNameImage)
    // ctx.drawImage(myNameImage, 0, 0, width, height, 0, 0, width, height)
    let x = (width-imageData.width) >>1
    grid.setImageData(x, 0, imageData, function toMaterials (r, g, b, a) {
        if (r === 255 && b === 255 && g === 0) return null
        return random(1, sm.symbols.length - 1)
    })
}


window.grid = grid
window.stateMachine = sm


function update () {
    for (let i = 0; i < grid.cells.length; i++) {
        const {x, y} = grid.xy(i)

        const touch = touched.getCell(x, y)
        if (touch) continue

        const cell = grid.getCell(x, y)
        if (cell === 0 || cell === 3) continue

        const state = grid.getChunk(x, y)
        let newState = sm.getNewState(state)
        if (!newState) continue
        grid.setCell(x, y, 0)
        grid.setChunk(x, y, newState)
        touched.setCell(x, y, 0)
        touched.setChunk(x, y, newState)
    }
    touched.cells.fill(0)
}

grid.draw2(ctx, 0, 1, 1, sm)
var frameEngine = new FrameEngine(60, function ({detail: {frames}}) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    grid.draw2(ctx, frames, 1, 1, sm)
    update()
})

var h1 = document.querySelector('#my-name')
var body = document.querySelector('body')
var pointer = new Pointer(h1)


var timer = new Timer(10_000, () => {
    frameEngine.stop()
    resetGrid()
    body.classList.remove('falling-sand-animate')
})

pointer.onEnter = function (point) {
    throwSandAndWater()
    frameEngine.start()
    timer.stop()
    body.classList.add('falling-sand-animate')
}
pointer.onLeave = function (point) {

    timer.start()
}

