import {color, draw} from '../../helpers/draw.js'

export function drawTree (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(top, left, size, size);

    var trunk = {
        thickness: size * .2,
        height: size * .5,
        bottom: top + size,
        get top () {return this.bottom - this.height},
    }

    draw.line(ctx, x, trunk.bottom, x, trunk.top, {
        lineWidth: trunk.thickness,
        strokeStyle: color.darkest(hue),
    })

    var block = {
        y: y + size / 8,
        width: size * .8,
        height: size * 1/5,
        get left () { return x - this.width / 2},
        get right () { return x + this.width / 2},
        get top () { return this.y -this.height / 2},
        get bottom () { return this.y + this.height / 2},
    }

    ctx.fillStyle = color.normal(hue)

    ctx.beginPath()
    // base
    ctx.moveTo(block.left, block.bottom)
    ctx.lineTo(block.right, block.bottom )
    ctx.lineTo(x, block.top)

    // middle
    block.y -= block.height * 0.9;
    block.width *= 0.8
    ctx.moveTo(block.left, block.bottom)
    ctx.lineTo(block.right, block.bottom )
    ctx.lineTo(x, block.top)

    // top
    block.y -= block.height * 0.9;
    block.width *= 0.8
    ctx.moveTo(block.left, block.bottom)
    ctx.lineTo(block.right, block.bottom )
    ctx.lineTo(x, top)

    ctx.fill()

}