import {Particle} from '../Particle.js'

export class ParticleBoundary extends Particle {
    constructor (effect, x, y, size, offBoundaryMode) {
        super(x, y, size)
        this.effect = effect

        this.x.offLimitMode = offBoundaryMode
        this.y.offLimitMode = offBoundaryMode
        this.x.min = this.y.min = 0
        this.x.max = effect.width
        this.y.max = effect.height

    }
    // setBoundaryPadding(){
    //     this.x.min = boundaryRect.x - this.size / 2
    //     this.x.max = boundaryRect.x + boundaryRect.width + this.size / 2
    //
    //     this.y.min = boundaryRect.y - this.size / 2
    //     this.y.max = boundaryRect.y + boundaryRect.height + this.size / 2
    // }
}