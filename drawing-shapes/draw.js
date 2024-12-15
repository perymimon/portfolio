export const draw = {}
draw.circle = function (ctx, x, y, radius, options = {}) {
    ctx.beginPath();

    if (options.outline) {
        radius -= options.lineWidth / 2
    }

    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    Object.assign(ctx, options);

    if (options.fillStyle) ctx.fill()
    if (options.strokeStyle) ctx.stroke()
    if (!('strokeStyle' in options || 'fillStyle' in options))
        throw 'Missing fillStyle or strokeStyle to paint the circle'
}

draw.ellipse = function (ctx, x, y, xRadius, yRadius, options = {}) {
    ctx.beginPath();
    ctx.ellipse(x, y, xRadius, yRadius, 0, 0 , Math.PI * 2, true);
    Object.assign(ctx, options);

    if (options.fillStyle) ctx.fill()
    if (options.strokeStyle) ctx.stroke()
    if (!('strokeStyle' in options || 'fillStyle' in options))
        throw 'Missing fillStyle or strokeStyle to paint the ellipse'
}

draw.line = function (ctx, xFrom, yFrom, xTo, yTo, options = {}) {
    ctx.beginPath();
    ctx.moveTo(xFrom, yFrom);
    ctx.lineTo(xTo, yTo);
    Object.assign(ctx, options);
    ctx.stroke()
}

export const color = {}

color.darkest = (hue) => `hsl(${hue}, 100%, 10%)`;
color.dark = (hue) => `hsl(${hue}, 100%, 30%)`;
color.normal = (hue) => `hsl(${hue}, 100%, 50%)`;
color.light = (hue) => `hsl(${hue}, 100%, 70%)`;
color.lightest = (hue) => `hsl(${hue}, 100%, 90%)`;
