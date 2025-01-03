import {color, draw} from '../../_helpers/draw.js'
import {drawSnowflake} from './snowflake.js'

export function drawCookie (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(top, left, size, size);

    const radius  = size / 4

    const length = 2 * Math.PI * radius;
    const dashLength = length / 6;

    ctx.setLineDash([0,dashLength]);

    draw.circle(ctx, x, y, radius, {
        lineWidth: radius * 1.2,
        strokeStyle:color.dark(hue),
        lineCap: 'round',
    })
    // ctx.filter = "grayscale(1) brightness(20)"
    drawSnowflake(ctx, x, y, size, hue)
    ctx.setLineDash([0,dashLength]);

}