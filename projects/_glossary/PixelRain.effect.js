import {getProperty, setCanvas} from '../_helpers/basic.js'
import {getImageData} from '../_helpers/color.js'
import {FrameEngine} from '../_helpers/FrameEngine.js'
import {random} from '../_math/basic.js'
import {Effect} from './Effect.js'
import {ParticleFall} from './ParticleFall.js'

export class PixelRainEffect extends Effect {
    constructor (width, height, image, speed = 5, particleSpacing = 80, imageFilter = 'grayscale(1)') {
        super(width, height)
        this.image = image
        this.brightImageData = getImageData(image, imageFilter);
        this.speed = speed
        this.particleSpacing = particleSpacing
        this.init()
    }
    get numberOfParticles(){
        return this.width * this.height / this.particleSpacing
    }
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

    draw (ctx) {
        // ctx.putImageData(this.brightImageData, 0, 0)
        ctx.globalAlpha = .05
        // ctx.fillStyle = getProperty(ctx,'--color-background')
        // ctx.fillStyle = getProperty(ctx,'--component-bg')
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.width, this.height)
        ctx.fillStyle = getProperty(ctx, '--text-primary')
        super.draw(ctx)
    }
}

export class PixelRainEffectRun extends PixelRainEffect {
    constructor (canvas, image, fps, speed, particleSpacing, imageFilter) {
        setCanvas(canvas, image)
        super(canvas.width, canvas.height, image, speed, particleSpacing, imageFilter)
        this.fps = fps
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
    }

    start () {
        this.framesEngine = new FrameEngine(this.fps, e => {
            this.update()
            this.draw(this.ctx)
        })
        this.framesEngine.start()
        return this
    }

    stop () {
        if (!this.framesEngine) return this
        this.framesEngine.stop()
    }
}