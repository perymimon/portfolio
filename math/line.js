export class Line {
    constructor (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw (ctx, options = {}) {
        ctx.save();
        Object.assign(ctx, options);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke()
        ctx.restore()
    }
}

