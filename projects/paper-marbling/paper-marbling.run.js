/* https://www.youtube.com/watch?v=p7IGZTjC008&ab_channel=TheCodingTrain */

import PixelImage from '../../src/glossary/effects/Pixelmage.js'
import {FrameEngine} from '../../src/glossary/FrameEngine.js'
import Pointer from '../../src/glossary/Pointer.js'
import Point from '../../src/glossary/primitive/Point.primitive.js'
import {
    RegularPolygon,
} from '../../src/glossary/primitive/RegularPolygon.primitive.js'
import Vector from '../../src/glossary/primitive/Vector.primitive.js'
import {random} from '../../src/math/math.js'
import PaperMarbleEffect from './PaperMarble.effect.js'

var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var pointer = new Pointer(canvas)
let marbleEffect = new PaperMarbleEffect()
// const pixelImage =  await PixelImage.from('./chibi-style-cyberpunk.webp', '', canvas.width, canvas.height)
const pixelImage =  await PixelImage.from('./chibi-style-city-street-scene.webp', '', canvas.width, canvas.height)
marbleEffect.pixels.push( pixelImage )

pointer.onSwift = (e, {delta, start}) => {
    var point = Point.from(e)
    var vec = Vector.from(delta).setLength(1)
    console.debug(delta.velocity)
    marbleEffect.tineLine(point, vec, 12, 1)
}

pointer.onDblTap = (e, point) => {
    var poly = new RegularPolygon(e.x, e.y, 50, 20)
    marbleEffect.putDrop(poly)
    pixelImage.render4()
};

new FrameEngine(10, function () {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    pixelImage.draw(ctx,0,0, ctx.canvas.width, ctx.canvas.height)
    var  [x,y] = [random(0,ctx.canvas.width), random(0,ctx.canvas.height)]
    var poly = new RegularPolygon(x, y, 50, 20)
    marbleEffect.putDrop(poly, true)
    // pixelImage.render4() //fastest
    pixelImage.render2() //nicer

    // ctx.save()
    // ctx.globalCompositeOperation = "destination-out";
    marbleEffect.draw(ctx, (poly, i) => ({
        fillStyle: `hsl(${120 + (i % 10)} ${20 + (i % 21) * 5} ${20 + (i % 11) * 3} / 20%)`,
    }))
    // // pointer.drawDebug(ctx)
    // ctx.restore()

}).start()