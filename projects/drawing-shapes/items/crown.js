import {color, draw} from '../../../helpers/draw.js'
import {drawBow} from './bow.js'

export function drawCrown (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(left, top, size, size);

    var thickness = size * .2, radius = size / 2

    draw.circle(ctx, x, y, radius, {
        strokeStyle: color.normal(hue),
        lineWidth: thickness,
        outline: 'inside',
    });
    var length = Math.PI * 2 * radius;
    var dashLength = length / 40;
    ctx.setLineDash([dashLength])

    draw.circle(ctx, x, y, radius, {
        strokeStyle: color.dark(hue),
        lineWidth: thickness,
        outline: 'inside',
    });
    ctx.setLineDash([])

    var bow = {
        x,
        y: top + thickness,
        size: radius,
    }
    drawBow(ctx, bow.x, bow.y, bow.size, color.reverse(hue))

}