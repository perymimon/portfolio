export const draw = {}
export default draw

draw.circle = function (ctx, x, y, radius, options = {}) {
    ctx.beginPath();

    if (options.outline) {
        radius -= options.lineWidth / 2
    }

    ctx.arc(x, y, radius, 0, Math.PI * 2, true);

    drawing(ctx, options,'circle')

}

draw.ellipse = function (ctx, x, y, xRadius, yRadius, options = {}) {
    ctx.beginPath()
    ctx.ellipse(x, y, xRadius, yRadius, 0, 0, Math.PI * 2, true);
    drawing(ctx, options, 'ellipse')
}

draw.line = function (ctx, xFrom, yFrom, xTo, yTo, options = {}) {
    ctx.beginPath()
    ctx.moveTo(xFrom, yFrom)
    ctx.lineTo(xTo, yTo)
    Object.assign(ctx, options)
    ctx.stroke()
}

draw.polygon = function (ctx, points, options = {}) {
    ctx.beginPath()
    var point = points.at(0)
    ctx.moveTo(point.x, point.y)
    for (let point of points.slice(1)) {
        ctx.lineTo(point.x, point.y)
    }
    ctx.closePath()

    drawing(ctx, options, 'polygon')
}

draw.arrow = function (ctx, sx, sy, ex, ey, size, options = {}) {
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx, sy)
    let angle = Math.atan2(ey - sy, ex - sx)

    ctx.moveTo(ex, ey)
    ctx.lineTo(
        ex - size * Math.cos(angle - Math.PI / 6),
        ey - size * Math.sin(angle - Math.PI / 6),
    )
    ctx.lineTo(
        ex - size * Math.cos(angle + Math.PI / 6),
        ey - size * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()

    drawing(ctx, options ,'arrow')
}
export function drawing(ctx, options, shapeName){
    Object.assign(ctx, options)
    if (options.drawFill || options.fillStyle) ctx.fill()
    if (options.drawStroke || options.strokeStyle) ctx.stroke()
    let keyWords = 'strokeStyle,fillStyle,drawFill,drawStroke'.split(',')
    drawTest(options, keyWords, shapeName)
}
export const drawAlgebra = {
    line (ctx, p0, p1, opt) { draw.line(ctx, p0.x, p0.y, p1.x, p1.y, opt)},
    circle (ctx, p0, radius, opt) { draw.circle(ctx, p0.x, p0.y, radius, opt)},
    ellipse (ctx, p0, xRad, yRad, opt) {draw.ellipse(ctx, p0.x, p0.y, xRad, yRad, opt)},

}


export const color = {}

color.darkest = (hue) => `hsl(${hue}, 100%, 10%)`;
color.dark = (hue) => `hsl(${hue}, 100%, 30%)`;
color.normal = (hue) => `hsl(${hue}, 100%, 50%)`;
color.light = (hue) => `hsl(${hue}, 100%, 70%)`;
color.lightest = (hue) => `hsl(${hue}, 100%, 90%)`;
color.reverse = (hue) => (hue + 180) % 360;

function drawTest (object, keyWords, entity = 'shape') {
    let test = new Set(keyWords).intersection(new Set(Object.keys(object)))
    if (test.size === 0) {
        throw `draw: Missing ${keyWords.join(' or ')} to paint the ${entity}`
    }
}
