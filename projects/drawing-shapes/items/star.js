import {color} from "../../../src/helpers/draw.js";

export function drawStar(ctx, x, y, size, hue) {
    // var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(top, left, size, size);

    var pointCount = 10,
        outerRadius = size / 2,
        innerRadius = outerRadius / 2;


    ctx.beginPath();
    for (let i = 0; i < pointCount; i++) {
        let angle = (i / pointCount) * Math.PI * 2;
        let radius = i % 2 ? innerRadius : outerRadius;
        let xPoint = x + radius * Math.sin(angle);
        let yPoint = y - radius * Math.cos(angle);
        ctx.lineTo(xPoint, yPoint);

    }
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fill()
    ctx.beginPath();
    ctx.arc(x,y,4,0, 2 * Math.PI, false);
    ctx.fillStyle = color.normal(hue)
    ctx.fill();
}