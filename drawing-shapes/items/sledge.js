import {color} from '../draw.js'

export function drawSledge (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(top, left, size, size);

    var height = size / 4
    var base = {
        thickness: size / 10,
        get bottom () {return y + height / 2 },
        get left () {return left + this.thickness / 2},
        get top () {return this.bottom - this.thickness * 2 },
        get right () {return left + size - this.thickness / 2 },
        width: size,
    }
    var arc = {
        radius: size / 8,
        get x(){return base.right - this.radius},
        get y(){return base.bottom - this.radius},
    }

    ctx.beginPath()
    ctx.lineWidth = base.thickness
    ctx.lineCap = 'round'
    ctx.strokeStyle = color.normal(hue)

    ctx.arc(arc.x, arc.y, arc.radius, Math.PI * -1/2, Math.PI * 1/2 )
    ctx.lineTo(base.left, base.bottom)

    ctx.stroke()

    var legLeft =   {
        x: base.left + base.width * 0.2,
        bottom: base.bottom,
        get top(){return base.bottom - height},
        thickness: base.thickness * 0.6,
    }
    ctx.beginPath()
    ctx.lineWidth = legLeft.width
    ctx.lineCap = 'butt'
    ctx.strokeStyle = color.light(hue)
    ctx.lineWidth = legLeft.thickness

    ctx.moveTo(legLeft.x, legLeft.bottom)
    ctx.lineTo(legLeft.x, legLeft.top)

    var legRight =   {
        ...legLeft,
        x: base.left + base.width * 0.5
    }

    ctx.moveTo(legRight.x, legRight.bottom)
    ctx.lineTo(legRight.x, legRight.top)

    // bench
    var bench = {
        y : legLeft.top,
        left: base.left,
        right: legRight.x + size *.15
    }

    ctx.moveTo(bench.left, bench.y )
    ctx.lineTo(bench.right ,bench.y)

    ctx.stroke()




}