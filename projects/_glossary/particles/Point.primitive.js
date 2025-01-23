import {Particle} from './Particle.js'

export default class Point extends Particle {
    constructor (x, y, effect) {
        super(x, y, 10, effect)
    }

    setX (x) { this.x.value = x }
    setY (y) { this.y.value = y }
    set({x, y}) {
        this.x.value = x + 0
        this.y.value = y + 0
        return this
    }
    setPolar(amplitude, angle) {
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
            this.parent
        )
    }
    add ({x, y}) {
        this.x.value +=x
        this.y.value +=y
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
            this.parent
        )
    }

}