import {random} from '../_math/basic.js'
import {ParticleBoundary} from './particleBaundery.js'

export class ParticleFall extends ParticleBoundary {
    constructor (effect, x, y = 0) {
        var size = random(1, 2.5, false)
        super(effect, x, y, size, 'warp')

        this.y.velocity = random(0, .6, false)
        this.y.linked = [this.x]

        this.x.offLimitMode = 'random'


    }

}