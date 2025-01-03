import {color, draw} from '../../_helpers/draw.js'

export function drawSnowflake (ctx, x, y, size, hue, pattern = [1,1,1,1,1,1]) {
    var top = y - size / 2, left = x - size / 2;
    // ctx.strokeRect(left, top, size, size)

    var lineWidth = size * 0.04
    var lineRadio = 0.47

    var  i = 0
    for (let a = 0; a <= Math.PI * 2; a += Math.PI / 3) {
        if(pattern[i++]) drawBranch(x, y, size, a)
    }

    function drawBranch (x, y, size, angle, level = 0) {
        if (level > 1) return
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        var length = size * lineRadio;
        draw.line(ctx, 0, 0, length, 0, {
            lineWidth,
            strokeStyle: color.normal(hue),
            lineCap: 'round',
        })
        drawBranch(length * lineRadio, 0, length, Math.PI / 4, level + 1)
        drawBranch(length * lineRadio, 0, length, -Math.PI / 4, level + 1)
        ctx.restore()
    }

}