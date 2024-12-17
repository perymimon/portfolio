import {color, draw} from '../draw.js'

export function drawCandle (ctx, x, y, size, hue) {
    var left = x - size / 2, top = y - size / 2
    // ctx.strokeRect(left, top, size, size)

    var stick = {
        x,
        width: size / 3,
        height: size *.66,
        get yRadius () {return this.width / 4},
        get xRadius () {return this.width / 2},
        get bottom () {return top + size - this.yRadius},
        get top () {return this.bottom - this.height + this.yRadius },
        color: color.dark(hue),
    }

    draw.line(ctx, stick.x, stick.top, stick.x, stick.bottom, {
        strokeStyle: stick.color,
        lineWidth: stick.width,
    })
    draw.ellipse(ctx, stick.x, stick.bottom, stick.xRadius,stick.yRadius,{
        fillStyle: stick.color,
    })
    draw.ellipse(ctx, stick.x, stick.top, stick.xRadius,stick.yRadius,{
        fillStyle: color.light(hue),
    })
    var flame = {
        get height(){return size - stick.height},
        width: stick.width / 2,
        bottom:stick.top,
        get yRadius(){return this.height /2},
        get xRadius(){return this.width / 2 },
        color: 'yellow',
        get y(){ return this.bottom - this.height /2 },
        x
    }
    // ctx.fillRect(x-flame.width / 2 , top, flame.width, flame.height)
    draw.ellipse(ctx, flame.x, flame.y, flame.xRadius, flame.yRadius, {
        fillStyle:flame.color,
    })

}