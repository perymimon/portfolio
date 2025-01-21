import {random} from '../../_math/basic.js'
import {Particle} from '../Particle.js'

export class ParticleFall extends ParticleBoundary {
    constructor (effect, x, y = 0, size , maxVelocity = 4) {

        super(effect, x, y, size, 'warp')
        this.x.offLimitMode = 'random'

        // this.y.velocity =  random(0, maxVelocity, false)
        // this.y.onOffLimit =  _=>{
        //     this.y.velocity =  random(0, maxVelocity, false)
        // }

        this.y.linked = [this.x]



    }

}