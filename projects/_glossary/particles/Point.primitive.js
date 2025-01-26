import {draw} from '../../_helpers/draw.js'
import {Value} from '../Value.js'

export default class Point {
    constructor (x, y, z) {
        this.x = new Value(x)
        this.y = new Value(y)
        if (z !== undefined) this.z = new Value(z)
    }

    update () {
        this.x.update()
        this.y.update()
        this.z?.update()
    }

    setX (x) { this.x.value = x }

    setY (y) { this.y.value = y }

    set ({x, y}) {
        this.x.value = x + 0 /*in case x is Value*/
        this.y.value = y + 0
        return this
    }

    setPolar (amplitude, angle) {
        const xOffset = amplitude * Math.cos(angle);
        const yOffset = amplitude * Math.sin(angle);

        this.x.value = this.x.start + xOffset;
        this.y.value = this.y.start + yOffset;
        return this;
    }

    toAdd ({x, y}) {
        return new Point(
            this.x + x,
            this.y + y,
        )
    }

    add ({x, y}) {
        this.x.value += x
        this.y.value += y
    }

    vectorTo ({x, y}) {
        return new Point(
            x - this.x,
            y - this.y,
        )
    }

    toScale (scalar) {
        return new Point(
            this.x * scalar,
            this.y * scalar,
        )
    }

    draw (ctx, size = 10, options) {
        draw.circle(ctx, this.x, this.y, size, {
            drawFill: true,
            ...options,
        });
    }
}