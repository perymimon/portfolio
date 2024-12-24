import {color, draw} from '../../helpers/draw.js';

export function drawBall(ctx, x, y, size, hue) {
    var top = y - size / 2
    
    const ring = {
        radius: size * .1,
        x,
        get y() {
            return top + this.radius;
        },
        thickness: size * .05,
        color: color.darkest(hue)
    }

    draw.circle(ctx, ring.x, ring.y, ring.radius, {
        strokeStyle: ring.color,
        lineWidth: ring.thickness,
        outline: 'inside'
    });

    const ball = {
        radius: size * .45,
        x,
        get y() {
            return top + ring.radius + this.radius
        },
        get color() {
            let x = ball.x - ball.radius * .3,
                y = ball.y - ball.radius * .3

            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, ball.radius,
            )

            gradient.addColorStop(0, color.light(hue))
            gradient.addColorStop(.3, color.normal(hue))
            gradient.addColorStop(1, color.dark(hue))
            return gradient
        }
    }


    draw.circle(ctx, ball.x, ball.y, ball.radius, {
        fillStyle: ball.color,
    })
}