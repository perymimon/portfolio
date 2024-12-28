import {color, draw} from '../../../helpers/draw.js'

export function drawBell (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2;
    ctx.strokeRect(top, left, size, size)

    var ring = {
        get radius () {return size * 0.1},
        get x () {return x},
        get y () {return top + ring.radius},
        get thickness () {return size / 20},
        color: color.normal(hue),
    }

    draw.circle(ctx, ring.x, ring.y, ring.radius, {
        strokeStyle: ring.color,
        lineWidth: ring.thickness,
        outline: 'inside',
    })

    let clapper = Object.setPrototypeOf({
        get color () {return color.dark(hue)},
        get y () {return top + size - clapper.radius},
    }, ring)

    draw.circle(ctx, clapper.x, clapper.y, clapper.radius, {
        fillStyle: clapper.color,
        lineWidth: clapper.thickness,
        outline: 'inside',
    })
}