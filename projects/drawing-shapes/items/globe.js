import {color, draw} from '../../_helpers/draw.js'
import {drawTree} from './tree.js'

export function drawGlobe (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(top, left, size, size);


    var ball = {
        radius: size * .45,
        x,
        get y () {return top + this.radius},
        color: "rgba(255, 255, 255, .3)",
    }
    var tree = {
        size: ball.radius,
        x,
        y: ball.y,
    }

    ctx.fillStyle = 'white'
    ctx.arc(ball.x, ball.y, ball.radius, .3, Math.PI - .1)
    ctx.fill()

    drawTree(ctx, tree.x, tree.y, tree.size, hue);
    drawTree(ctx, tree.x - ball.radius * .5, tree.y, tree.size, hue);
    drawTree(ctx, tree.x + ball.radius * .5, tree.y, tree.size, hue);

    draw.circle(ctx, ball.x, ball.y, ball.radius, {
        fillStyle: ball.color,
    })

    var base = {
        height: size * .2,
        width: size * .6,
        get y () { return bottom - this.height },
        get left () { return x - this.width / 2 },
        get right () { return this.left + this.width },
        color: color.dark(hue),
    }

    draw.line(ctx, base.left, base.y, base.right, base.y, {
        strokeStyle: base.color,
        lineWidth: base.height,
        lineCap: 'round',
    })


}