import {color} from '../draw.js'
import {drawSledge} from './sledge.js'
import {drawSock} from './sock.js'

export function drawSkate (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(left, top, size, size);

    var  sledge = {
        size:size * 0.95,
        x,
        get y(){return bottom - this.size * .2 }

    }
    drawSledge(ctx, sledge.x, sledge.y, sledge.size, hue)
    var sock = {
        size: size ,
        get x(){return sledge.x - size * .26 },
        y : y + size * .03,
    }
    drawSock(ctx, sock.x, sock.y, sock.size, color.reverse(hue), 0)
}