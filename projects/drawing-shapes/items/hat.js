import {color, draw} from '../../../src/helpers/draw.js'

export function drawHat (ctx, x, y, size, hue) {
    var top = y - size / 2, left = x - size / 2, bottom = top + size;
    // ctx.strokeRect(top, left, size, size);

    var ponpon = {
        radius: size / 10,
        get x () {return x},
        get y () {return top + this.radius},
    }
    var main = {
        width: size * 0.8,
        get xRadius(){return  size / 2},
        yRadius: size - ponpon.radius,
    }


    ctx.fillStyle = color.normal(hue);

    ctx.beginPath();
    ctx.ellipse(x, bottom, main.xRadius, main.yRadius, 0, Math.PI, 0)
    ctx.fill();

    draw.circle(ctx, ponpon.x, ponpon.y, ponpon.radius, {
        fillStyle: color.dark(hue),
    });

    var sleeve = {
        thickness: size / 5,
        get y () {return bottom - this.thickness / 2 },
        get left () { return left /*+ this.thickness / 2*/},
        get right () { return left + size /*- this.thickness / 2*/},
    }
    draw.line(ctx, sleeve.left, sleeve.y, sleeve.right, sleeve.y, {
        strokeStyle: color.dark(hue),
        lineWidth: size / 5,
        // lineCap: 'round',
    })
}