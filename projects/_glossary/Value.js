import {clamp, exceedsLimits, random} from '../_math/basic.js'

// offScreenMode =  'die' || 'teleportation' ||

export class Value {
    constructor (v, min = -Infinity, max = Infinity, onExceedBoundary = null) {
        this.start = v
        this.value = v
        this.speed = 0
        this.velocity = 0
        this.min = min
        this.max = max
        this.onExceedBoundary = onExceedBoundary
        this.onBelowMin = null
        this.onAboveMax = null
    }

    get isAboveMax () {
        return this.value > this.max;
    }

    get isBelowMin () {
        return this.value < this.min;
    }

    update () {
        this.speed += this.velocity
        this.value += this.speed
        if (this.isBelowMin) this.onBelowMin?.(this)
        if (this.isAboveMax) this.onAboveMax?.(this)
        if (this.isExceedsBoundary) {
            this.onExceedBoundary?.(this)
        }
    }

    random (integer) {
        return this.value = random(this.min, this.max, integer)
    }
    randomSet(min, max, integer) {
        return this.value = random(min, max, integer)
    }

    wrapAround () {
        if (this.value > this.max) this.value = this.min
        if (this.value < this.min) this.value = this.max
        return this.value
    }

    reset () {
        /* if start is a function run it otherwise it is scalar*/
        return this.value = this.start?.()?? this.start
    }

    reflect () {
        return this.speed *= -1
    }

    clamp () {
        return this.value = clamp(this.min, this.value, this.min)
    }

    valueOf () {
        return this.value
    }

    get isExceedsBoundary () {
        return exceedsLimits(this.min, this.value, this.max)
    }

}