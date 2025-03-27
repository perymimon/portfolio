import {color, draw} from '../../../src/helpers/draw.js'
import {drawSnowflake} from './snowflake.js'

export function drawDear (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    ctx.strokeRect(left, top, size, size);

    drawSnowflake(ctx, x, y - size * .06, size, color.reverse(hue), [0, 0, 0, 0, 1, 1]);

    var head = {
        radius: size * 0.2,
        x, y,
    }

    draw.circle(ctx, head.x, head.y, head.radius, {
        fillStyle: color.dark(hue),
    })

    var eye = {
        xOffset: head.radius * .3,
        radius: head.radius * .2,
    }

    draw.circle(ctx, x - eye.xOffset, y, eye.radius, {
        fillStyle: color.darkest(hue),
    })
    draw.circle(ctx, x + eye.xOffset, y, eye.radius, {
        fillStyle: color.darkest(hue),
    })

    var snout = {
        xRadius: head.radius * 1.3,
        yRadius: head.radius * 1.2 ,
        x,
        get y () {return head.y + this.yRadius  },
    }

    draw.ellipse(ctx, snout.x, snout.y, snout.xRadius, snout.yRadius, {
        fillStyle: color.light(hue),
    })

    draw.circle(ctx, snout.x, snout.y - size *.08, size * .08, {
        fillStyle: 'red',
    })
}