import {random} from '../_math/basic.js'
import {Effect} from './Effect.js'
import {ParticleFall} from './ParticleFall.js'
import {getProperty} from '../_helpers/basic.js'
import {getBrightnessImageData} from '../_helpers/color.js'

export class PixelRainEffect extends Effect {
    constructor (canvas, image, speed = 5, particleSpacing = 80) {
        super(canvas)
        this.image = image
        this.brightImageData = getBrightnessImageData(image);
        this.speed = speed
        this.numberOfParticles = this.width * this.height / particleSpacing
        this.resize(canvas.width, canvas.height)
    }
    get width () { return Math.min(this.canvas.width, this.image.width) }
    get height () { return Math.min(this.canvas.height, this.image.height) }

    init () {
        this.particles = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            let x = i % this.width
            let y = random(0, this.height)
            var particle = new ParticleFall(this, x, y)
            this.particles.push(particle)
        }
    }
    update () {
        const {floor} = Math
        const {width, height, data} = this.brightImageData
        this.particles.forEach(particle => {
            let x = floor(particle.x)
            let y = floor(particle.y)
            let b = data[(y * width + x) * 4]
            particle.y.speed = (1.1 - b / 255) * this.speed
            particle.update()
        })
    }
    draw(ctx){
        // ctx.putImageData(this.brightImageData, 0, 0)
        ctx.globalAlpha = .05
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.width, this.height)
        ctx.fillStyle = getProperty(ctx, '--text-primary')
        super.draw(ctx)
    }
}