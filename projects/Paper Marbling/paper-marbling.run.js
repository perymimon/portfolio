import {FrameEngine} from '../_glossary/FrameEngine.js'
import {
    RegularPolygon,
} from '../_glossary/particles/RegularPolygon.primitive.js'
import Pointer from '../_glossary/Pointer.js'
import {random} from '../_math/basic.js'
import MarbleEffect from './Marbling.effect.js'


var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var pointer = new Pointer(canvas)
let marbleEffect = new MarbleEffect(canvas.width, canvas.height)


pointer.onTap = function (pointer) {
    var poly = new RegularPolygon(pointer.x, pointer.y,20, 20)
    marbleEffect.putDrop(poly)
}
new FrameEngine(25, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    marbleEffect.draw(ctx, (poly, i)=>({
        fillStyle: `hsl(120 ${20 + (i % 10) * 5} ${20 + (i % 10) * 5})`
    }))

}).start()