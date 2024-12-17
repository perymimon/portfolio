import {color} from '../draw.js'

export function drawSnowBall (ctx, x, y, size, hue) {
    // var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(top, left, size, size)

    drawNoisyCircle(ctx, x, y, size, color.normal(hue))
    ctx.globalCompositeOperation = 'source-atop'
    var offset = {
        x: x - size / 10,
        y: y - size / 10,
    }
    drawNoisyCircle(ctx, offset.x, offset.y, size, color.light(hue))
    ctx.globalCompositeOperation = 'source-over'

}

function drawNoisyCircle (ctx, x, y, size, color) {
    var maxRadius = size / 2
    ctx.beginPath()
    for (var a = 0; a < Math.PI * 2; a += Math.PI / 7) {
        var radius = maxRadius * (1 - Math.random() * 0.08)
        var offsetX = x + radius * Math.cos(a),
            offsetY = y + radius * Math.sin(a);
        ctx.lineTo(offsetX, offsetY);
    }
    ctx.fillStyle = color
    ctx.fill()
}
