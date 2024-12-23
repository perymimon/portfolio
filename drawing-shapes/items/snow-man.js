import {color, draw} from '../draw.js'
import {drawSnowBall} from './snow-ball.js'

export function drawSnowMan (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(left, top, size, size);

    var ball = {
        size: size * .5,
        x,
        get y () {return bottom - this.size / 2},
    }
    drawSnowBall(ctx, ball.x, ball.y, ball.size, hue)
    var ballUp = {
        size: size  * .35,
        x,
        y: ball.y - ball.size * .65,
    }
    drawSnowBall(ctx, ballUp.x, ballUp.y, ballUp.size, hue)
    /* eyes */
    var eye = {
        xOffset: size / 16,
        radius: size / 30,
        hue: color.reverse(hue),
    }
    draw.circle(ctx, x - eye.xOffset, ballUp.y, eye.radius, {
        fillStyle: color.dark(eye.hue),
    })
    draw.circle(ctx, x + eye.xOffset, ballUp.y, eye.radius, {
        fillStyle: color.darkest(eye.hue),
    })

    var hat = {
        width: size * .28,
        height: size / 6,
        x,
        get bottom () {return ballUp.y - size / 12 },
        top,
        hue: color.reverse(hue),
        brim: {
            get width () { return hat.width / 0.8},
            get height () { return hat.height * .5},
            get bottom () { return hat.bottom },
            get top () { return this.bottom - this.height },
        },
    }

    draw.line(ctx, hat.x, hat.bottom, hat.x, hat.top, {
        lineWidth: hat.width,
        strokeStyle: color.dark(hat.hue),
    })
    draw.line(ctx, hat.x, hat.brim.bottom, hat.x, hat.brim.top, {
        lineWidth: hat.brim.width,
        strokeStyle: color.light(hat.hue),
    })
}