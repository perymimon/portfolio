import {color, draw} from '../../../helpers/draw.js'

export function drawCandy (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(left, top, size, size)
    var ball = {
        radius: size / 4,
        color: color.dark(hue),
        get top () {return y - this.radius},
        get bottom () {return y + this.radius},
        get left () {return x - this.radius},
        get right () {return x + this.radius},
    }
    var dashWidth = size / 20


    ctx.fillStyle = color.normal(hue)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(ball.left, ball.top, ball.radius, - Math.PI * 4/8  , Math.PI * 8/8 , true)

    ctx.moveTo(x, y)
    ctx.arc(ball.right, ball.bottom, ball.radius, Math.PI * - 0/8, Math.PI * 4/8, false)
    ctx.fill()

    draw.circle(ctx, x, y, ball.radius, {
        fillStyle: color.normal(hue),
    });
    ctx.save()
    ctx.clip()
    ctx.setLineDash([dashWidth, dashWidth]),
        draw.line(ctx, 0, 0, left + size, top + size, {
            lineWidth: size,
            strokeStyle: color.light(hue),
        })
    ctx.restore()
}