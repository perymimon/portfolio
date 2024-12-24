export const draw = {}

draw.circle = function (ctx, x, y, radius, options = {}) {
    ctx.beginPath();

    if (options.outline) {
        radius -= options.lineWidth / 2
    }

    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    Object.assign(ctx, options);

    if (options.drawFill || options.fillStyle) ctx.fill()
    if (options.drawStroke || options.strokeStyle) ctx.stroke()
    let keyWords = 'strokeStyle,fillStyle,drawFill,drawStroke'.split(',')
    drawTest(options, keyWords, 'circle')
}

draw.ellipse = function (ctx, x, y, xRadius, yRadius, options = {}) {
    ctx.beginPath();
    ctx.ellipse(x, y, xRadius, yRadius, 0, 0, Math.PI * 2, true);
    Object.assign(ctx, options);

    if (options.drawFill || options.fillStyle) ctx.fill()
    if (options.drawStroke || options.strokeStyle) ctx.stroke()
    let keyWords = 'strokeStyle,fillStyle,drawFill,drawStroke'.split(',')
    drawTest(options, keyWords, 'ellipse')
}

draw.line = function (ctx, xFrom, yFrom, xTo, yTo, options = {}) {
    ctx.beginPath();
    ctx.moveTo(xFrom, yFrom);
    ctx.lineTo(xTo, yTo);
    Object.assign(ctx, options);
    ctx.stroke()
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

function drawTest(object, keyWords, entity ='shape'){
    let test =  new Set(keyWords).intersection(new Set(Object.keys(object)))
    if( test.size === 0){
        throw `draw: Missing ${keyWords.join(' or ')} to paint the ${entity}`
    }
}
