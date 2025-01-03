import {color, draw} from '../../_helpers/draw.js'

export function drawCalendar (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size, right = left + size;
    // ctx.strokeRect(top, left, size, size);

    var roundness = size / 10

    ctx.save()

    ctx.fillStyle = color.normal(hue);
    ctx.beginPath();
    ctx.roundRect(left, top, size, size, roundness);
    ctx.fill()

    // ctx.clip()

    var header = {
        height: size / 4,
        get top () { return top },
    }

    ctx.fillStyle = color.lightest(hue);
    ctx.fillRect(left, header.top, size, header.height)

    var hole = {
        radius: header.height / 3,
        xs: [left + header.height, x, right - header.height],
        get y () {return header.top + header.height / 2},
    }
    ctx.globalCompositeOperation = 'destination-out';
    hole.xs.forEach((x) => {
        draw.circle(ctx, x, hole.y, hole.radius, {
            fillStyle: color.normal(hue),
        })
    })
    ctx.restore()

    var  text = {
        size : size / 2,
        x,
        y : bottom - (size - header.height) / 2
    }

    ctx.fillStyle = color.dark(hue);
    ctx.font = `bold ${text.size}px Consolas`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('15', text.x, text.y)


}