import {clamp, exceedsLimits, random} from '../_math/basic.js'

// offScreenMode =  'die' || 'teleportation' ||

export class Value {
    constructor (v, min = -Infinity, max = Infinity) {
        this.start = v
        this.v = v
        this.speed = 0
        this.velocity = 0
        this.min = min
        this.max = max
        this.mode = null
        this.offLimitMethod = null
        this.linked = []
    }

    set offLimitMode (mode) {
        this.mode = mode
        if (this.mode === 'reflection') this.offLimitMethod = this.reflect
        if (this.mode === 'clamp') this.offLimitMethod = this.clamp
        if (this.mode === 'reset') this.offLimitMethod = this.reset
        if (this.mode === 'warp') this.offLimitMethod = this.warp
        if (this.mode === 'random') this.offLimitMethod = this.random
    }

    onOffLimit () {}

    update () {
        this.speed += this.velocity
        this.v += this.speed
        if (this.exceedsLimits) {
            this.offLimitMethod()
            this.onOffLimit()
            for (let v of this.linked) {
                v.offLimitMethod()
                v.onOffLimit()
            }
        }
    }

    random (integer) {
        this.v = random(this.min, this.max, integer)
    }

    warp () {
        if (this.v > this.max) this.v = this.min
        if (this.v < this.min) this.v = this.max
    }

    reset () {
        this.v = this.start
    }

    reflect () {
        this.speed *= -1
    }

    clamp () {
        this.v = this.clamped
    }

    valueOf () {
        return this.v
    }

    get exceedsLimits () {
        return exceedsLimits(this.min, this.v, this.max)
    }

    get clamped () {
        clamp(this.min, this.v, this.min)
    }
}