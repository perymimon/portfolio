import {color, draw} from "../../../src/helpers/draw.js";

export function drawSock(ctx, x, y, size, hue, angle = Math.PI / 4) {
    var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(left, top, size, size);

    var footWidth = size * .4,
        ankleY = y + size * .1,
        radius = footWidth / 2
    ;
    draw.line(ctx, x, top + radius, x, ankleY, {
        strokeStyle: color.normal(hue),
        lineWidth: footWidth,
        lineCap: 'round',
    })
    var footSize = size * .3;
    var tipX = x + Math.cos(angle) * footSize,
        tipY = ankleY + Math.sin(angle) * footSize;

    draw.line(ctx, x, ankleY, tipX, tipY, {
        lineCap: 'round',
    })
    draw.line(ctx, x, top, x, top + radius, {
        lineWidth: footWidth * 1.1,
        strokeStyle: color.dark(hue),
        lineCap: 'butt'
    });




}