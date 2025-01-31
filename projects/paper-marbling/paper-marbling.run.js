/* https://www.youtube.com/watch?v=p7IGZTjC008&ab_channel=TheCodingTrain */

import {FrameEngine} from '../_glossary/FrameEngine.js'
import Point from '../_glossary/primitive/Point.primitive.js'
import {
    RegularPolygon,
} from '../_glossary/primitive/RegularPolygon.primitive.js'
import Pointer from '../_glossary/Pointer.js'
import Vector from '../_glossary/primitive/Vector.primitive.js'
import MarbleEffect from './Marbling.effect.js'

var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var pointer = new Pointer(canvas)
let marbleEffect = new MarbleEffect(canvas.width, canvas.height)

var cw = canvas.width
var ch = canvas.height
var chw = cw / 2
var chh = ch / 2
// for (let x = (cw / 2) - 100; x < (cw / 2) + 100; x += 32) {
//     for (let y = (ch / 2) - 100; y < (ch / 2) + 100; y += 32) {
//         var poly = new RegularPolygon(x, y, 20, 30)
//         marbleEffect.putDrop(poly)
//     }
// }
/* demo 2*/
var mh = Math.min(chh, chw) /2
var radius = 30
var dropRadius = 20

Array(30).fill(0).forEach((_, i) => {
    let x = Math.cos(i) * radius
    let y = Math.sin(i) * radius
    let resolution = Math.floor((dropRadius * Math.PI * 2) / 5)
    if (resolution < 3) return
    var poly = new RegularPolygon(chw + x, chh + y, dropRadius, resolution)
    marbleEffect.putDrop(poly)
    radius += 10
    radius %= mh
    dropRadius += 1
})

Array(4).fill(0).forEach((_, i) => {
    var poly = new RegularPolygon(cw / 2, ch / 2, 50, 100)
    marbleEffect.putDrop(poly)
})

// marbleEffect.tineLine(cw / 2, 40, 20)
var tineStart = null, tineEnd = null

pointer.onSwift = (e, {delta, start}) => {
    // marbleEffect.tineLine(e.x, 1 , 20)
    var point = Point.from(e)
    var vec = Vector.from(delta).setLength(1)
    console.debug(delta.velocity)
    marbleEffect.tineLine(point, vec, 12, 1)

}


pointer.onDblTap = (e, point) => {
    var poly = new RegularPolygon(e.x, e.y, 20, 20)
    marbleEffect.putDrop(poly)
};

new FrameEngine(25, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    marbleEffect.draw(ctx, (poly, i) => ({
        fillStyle: `hsl(${120 + (i % 10)} ${20 + (i % 21) * 5} ${20 + (i % 11) * 3})`,
    }))
    pointer.drawDebug(ctx)

}).start()