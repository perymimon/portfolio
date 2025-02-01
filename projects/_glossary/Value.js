import {clamp, exceedsLimits, random} from '../_math/math.js'

// offScreenMode =  'die' || 'teleportation' ||

export class Value {
    constructor (v, settings = {}) {
        if (v instanceof Value) v = v + 0
        if (!(typeof v === 'number')) throw new Error('Value must be a number')
        this.start = v
        this.value = v
        Object.assign(this, {
            speed: 0,
            velocity: 0,
            min: -Infinity,
            max: Infinity,
            ...settings,
        })
    }

    onExceedBoundary () {}

    onBelowMin () {}

    onAboveMax () {}

    onChange (value) {}

    set offsetMax (value) {
        this.max = this.start + value
    }

    set offsetMin (value) {
        this.min = this.start - value
    }

    get isAboveMax () {
        return this.value > this.max
    }

    get isBelowMin () {
        return this.value < this.min
    }

    update () {
        this.speed += this.velocity
        this.value += this.speed
        if (this.isBelowMin) this.onBelowMin?.(this)
        if (this.isAboveMax) this.onAboveMax?.(this)
        if (this.isExceedsBoundary) {
            this.onExceedBoundary?.(this)
        }
        if (this.speed !== 0) this.onChange?.(this)

    }

    random (integer) {
        return this.value = random(this.min, this.max, integer)
    }

    randomSet (min, max, integer) {
        return this.value = random(min, max, integer)
    }

    wrapAround () {
        if (this.value > this.max) this.value = this.min
        if (this.value < this.min) this.value = this.max
        return this.value
    }

    reset () {
        /* if start is a function run it otherwise it is scalar*/
        return this.value = this.start?.() ?? this.start
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

    toString(){
        return this.value.toFixed(2)
    }
    get isExceedsBoundary () {
        return exceedsLimits(this.min, this.value, this.max)
    }

}