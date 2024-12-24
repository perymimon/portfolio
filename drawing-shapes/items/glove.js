import {color, draw} from '../../helpers/draw.js'

export function drawGlove (ctx, x, y, size, hue) {
    var left = x - size / 2, top = y - size / 2;
    // ctx.strokeRect(left, top, size, size);

    var glove = {
        width: size / 2,
        get radius () {return this.width / 2},
        get top () {return top + this.radius},
        get bottom () {return top + size - this.radius },
    }
    draw.line(ctx, x, glove.top, x, glove.bottom, {
        strokeStyle: color.normal(hue),
        lineWidth: glove.width,
        lineCap: "round",
    })

    draw.line(ctx, x, glove.top, x - glove.radius, glove.top + glove.radius, {
        lineWidth: glove.width / 2,
        lineCap: "round",
    })

    draw.line(ctx, x, top, x, glove.top, {
        lineCap: "butt",
        lineWidth: glove.width,
        strokeStyle: color.light(hue),
    })

}