import {FrameEngine} from '../_glossary/FrameEngine.js'
import Point from '../_glossary/primitive/Point.primitive.js'
import draw from '../_helpers/draw.js'
import {hilbert} from '../_math/hilbert-curve.js'
import {map} from '../_math/math.js'

var canvas = document.getElementById('canvas1')
var ctx = canvas.getContext('2d')
/* setup */
var order = 7

canvas.width = 512;
canvas.height = 512

var path = []
var length = 2 ** order
var total = length ** 2

var cubeLen = canvas.width / length

for (let i = 0; i < total; i++) {
    path[i] = hilbert(i, order)
        .mult(cubeLen)
        .translate({x: cubeLen / 2, y: cubeLen / 2})
}

/* end setup */
var i = 0
function update () {
    if(i >= path.length) i = 0
    ctx.beginPath()
    ctx.moveTo(path[i].x, path[i].y)
    ctx.lineTo(path[i+1].x, path[i+1].y)
    let h = map(i, 0, path.length, 0, 360)
    ctx.strokeStyle = `hsl(${h}deg 80% 50%)`
    ctx.lineWidth = 1
    ctx.stroke()
    i++
}

new FrameEngine(10, function ({detail: {frames}}) {
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    update()
}).start()
