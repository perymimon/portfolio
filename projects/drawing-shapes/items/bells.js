import {color} from '../../_helpers/draw.js'
import {drawBell} from './bell.js'
import {drawBow} from './bow.js'

export function drawBells (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(top, left, size, size);

    var bell = {
        size: size / 2,
        y: y + size * 0.12,
        xOffset: size * .21,
        rotation: Math.PI / 6,
    }
    ctx.save()
    ctx.translate(x, bell.y)
    ctx.rotate(bell.rotation)
    drawBell(ctx, -bell.xOffset, 0, bell.size, hue)
    ctx.rotate(-2 * bell.rotation)
    drawBell(ctx, +bell.xOffset, 0, bell.size, hue)
    ctx.restore()

    var bow = {
        size: size / 1.5,
        y: y - size * .21,

    }

    drawBow(ctx,x,bow.y, bow.size, color.reverse(hue))
}