import {FrameEngine} from '../../src/glossary/FrameEngine.js'
import draw from '../../src/helpers/draw.js'
import {hilbert} from '../../src/math/hilbert-curve.js'
import {map, random} from '../../src/math/math.js'

var canvas = document.getElementById('canvas1')
var ctx = canvas.getContext('2d')
/* setup */
var order = 7

canvas.width = 512
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
const sparks = new Set()


function generateSparks () {
    let pos = random(0, i)
    let length = random(10, 30)
    let ttl = random(30, 100)
    let hue = random(100, 130)
    sparks.add({pos, length, ttl, tl: ttl, hue})
}


/* end setup */
var i = path.length -2
ctx.globalAlpha = 1

function update () {
    // if (i >= path.length-1) i = path.length - 2

    for (let j = i; j >= 0; j--) {
        ctx.beginPath()
        ctx.moveTo(path[j].x, path[j].y)
        ctx.lineTo(path[j + 1].x, path[j + 1].y)
        let h = map(j, 0, path.length, 0, 360)
        ctx.strokeStyle = `hsl(${h}deg 80% 50% / 1)`
        ctx.lineWidth = 1
        ctx.stroke()
    }
    // i++
    if (Math.random() < i/path.length) generateSparks()
    for (let s of sparks) {
        let miniPath = path.slice(s.pos, s.pos + s.length)
        if (miniPath.length < s.length) miniPath = path.slice(-s.length)
        draw.curve(ctx, miniPath, {strokeStyle: `hsl(${s.hue} 100%  50% / ${s.tl / s.ttl}`})
        s.pos++
        s.tl--
        if (s.tl === 0) {
            sparks.delete(s)
        }

    }
}

new FrameEngine(30, function ({detail: {frames}}) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    update()
}).start()
