import {color, draw} from '../draw.js'

export function drawBell (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(top, left, size, size)

    class ring {
        static get radius () {return size * 0.1}
        static get x () {return x}
        static get y () {return top + ring.radius}
        static get thickness () {return size / 20}
        static color = color.darkest(hue)
    }

    draw.circle(ctx, ring.x, ring.y, ring.radius, {
        strokeStyle: ring.color,
        lineWidth: ring.thickness,
        outline: 'inside',
    })

    class clapper extends ring {
        static get color () {return color.dark(hue)}

        static get y () {return top + size - clapper.radius}
    }

    draw.circle(ctx, clapper.x, clapper.y, clapper.radius, {
        fillStyle: clapper.color,
        lineWidth: clapper.thickness,
        outline: 'inside',
    })

    class bell {
        static top = top + ring.radius
        static bottom = top + size - ring.radius
        static left = left
        static right = left + size
        static color = color.normal(hue)
        static cpOffset = size / 8
    }

    ctx.beginPath()
    ctx.moveTo(x, bell.top )
    ctx.bezierCurveTo(
        bell.left + bell.cpOffset, bell.top,
        x - bell.cpOffset, bell.bottom,
        bell.left, bell.bottom
    )
    // ctx.lineTo(bell.left, bell.bottom )
    ctx.lineTo(bell.right, bell.bottom )
    ctx.bezierCurveTo(
        x + bell.cpOffset, bell.bottom,
        bell.right - bell.cpOffset, bell.top,
        x, bell.top
    )
    ctx.fillStyle = bell.color
    ctx.fill()

}