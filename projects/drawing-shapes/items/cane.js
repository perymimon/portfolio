import {color} from "../../../helpers/draw.js";

export function drawCane (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(left, top, size, size)
    var width = size / 2
    var thickness = size * .1

    var arc = {
        get radius () { return width / 2},
        get y () { return top + this.radius + thickness / 2 },
        x: x,
    }, stick = {
        y: bottom,
        get x () { return x + arc.radius },
    };

    ctx.beginPath()

    ctx.arc(arc.x, arc.y, arc.radius - Math.PI, Math.PI, 0)
    ctx.lineTo(stick.x, stick.y)
    ctx.lineWidth = thickness
    ctx.strokeStyle = color.light(hue)
    ctx.stroke()

    ctx.strokeStyle = color.normal(hue)
    ctx.setLineDash([thickness, thickness])
    ctx.stroke()
}