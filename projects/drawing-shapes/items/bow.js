import {color} from '../../../src/helpers/draw.js'

export function drawBow (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, right = left + size, bottom = top + size;

    var radius = size * 0.1
    // ctx.strokeRect(left, top , size, size)

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(left,top, left, y);
    ctx.quadraticCurveTo(left, bottom, x, y);
    // ctx.arcTo(left, top, left, bottom, radius)
    // ctx.arcTo(left, bottom, x, y, radius);
    // ctx.lineTo(x, y);
    ctx.quadraticCurveTo(right, bottom, right, y);
    ctx.quadraticCurveTo(right, top, x,y);

    ctx.fillStyle = color.normal(hue)
    ctx.fill()

    var knot = {
        size: size / 3.3,
        get top(){return y - this.size / 2 },
        get left(){return x - this.size / 2 },
        get roundness(){return size / 12}
    }

    ctx.beginPath();
    ctx.roundRect(knot.left, knot.top, knot.size, knot.size, knot.roundness);
    ctx.fillStyle = color.dark(hue)
    ctx.fill()
}