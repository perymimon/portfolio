import {color, draw} from "../draw.js";

export function drawSock(ctx, x, y, size, hue, angle = Math.PI / 4) {
    var top = x - size / 2, left = y - size / 2;
    // ctx.strokeRect(top, left, size, size);

    var footWidth = size * .4,
        ankleY = y + size * .1,
        sockRadius = size / 2,
        radius = footWidth / 2
    ;
    draw.line(ctx, x, top + radius, x, ankleY, {
        strokeStyle: color.normal(hue),
        lineWidth: footWidth,
        lineCap: 'round',
    })
    var footSize = size * .3;
    var tipX = x + Math.cos(angle) * footSize, tipY = y + Math.sin(angle) * footSize;

    draw.line(ctx, x, ankleY, tipX, tipY, {
        lineCap: 'round',
    })
    draw.line(ctx, x, top, x, top + radius, {
        lineWidth: footWidth * 1.1,
        strokeStyle: color.dark(hue),
        lineCap: 'butt'
    });




}