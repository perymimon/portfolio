import {color, draw} from '../draw.js'
import {drawBow} from './bow.js'

export function drawPresent (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(top, left, size, size);

    var box = {
        height: size * .8,
        width: size * .9,
        get top () {return bottom - this.height},
    }
    drawBow(ctx, x, box.top, size * .8 , color.reverse(hue))

    draw.line(ctx, x, bottom, x, box.top, {
        lineWidth: box.width,
        strokeStyle: color.dark(hue),
    })


    var ropeWidth = size / 10

    draw.line(ctx, x, bottom, x, box.top, {
        lineWidth: ropeWidth,
        strokeStyle: color.normal(color.reverse(hue)),
    })

    var lid = {
        width: size,
        height: size * 0.2,
        get bottom () {return box.top + this.height},

    }

    draw.line(ctx, x, box.top, x, lid.bottom, {
        lineWidth: lid.width,
        strokeStyle: color.light(hue),
    })


}