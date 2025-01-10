import {getProperty, setCanvas} from '../_helpers/basic.js'
import {getImageData} from '../_helpers/color.js'
import {FrameEngine} from '../_helpers/FrameEngine.js'
import {random} from '../_math/basic.js'
import {Effect} from './Effect.js'
import {ParticleFall} from './ParticleFall.js'

export class PixelRainEffect extends Effect {
    constructor (width, height, grayscaleImageData, settings = {}) {
        super(width, height, settings)
        this.processedImage = grayscaleImageData
        this.init()
    }

    get numberOfParticles () {
        return this.width * this.height / this.settings.particleSpacing
    }

    init () {
        const {speed, minSize = 1, maxSize = 2.5} = this.settings
        this.particles = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            let x = i % this.width
            // let y = random(0, this.height)
            let y = random(0, this.height / 8)
            var size = random( minSize, maxSize, false)
            var particle = new ParticleFall(this, x, y, size, speed * .5)
            this.particles.push(particle)
        }
    }

    update () {
        const {floor} = Math
        const {speed} = this.settings
        const {width, height, data} = this.processedImage
        this.particles.forEach(particle => {
            let x = floor(particle.x)
            let y = floor(particle.y)
            let b = data[(y * width + x) * 4] / 255
            particle.y.speed = Math.max(0.2,( 1 - b ) * speed)
            particle.update()
        })
    }

    draw (ctx, debug) {
        if(debug) {
            ctx.globalAlpha = 1
            ctx.putImageData(this.processedImage, 0, 0)
        }

        ctx.globalAlpha = .1
        ctx.fillStyle = getProperty(ctx, '--color-background')
        ctx.fillStyle = getProperty(ctx, '--component-bg')
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.width, this.height)
        ctx.fillStyle = getProperty(ctx, '--text-primary')
        super.draw(ctx)
    }
}

export class PixelRainEffectRun extends PixelRainEffect {
    constructor (canvas, image, setting) {
        setCanvas(canvas, image)
        var grayscaleImageData = image instanceof ImageData? image : getImageData(image,'grayscale(1)')
        super(canvas.width, canvas.height, grayscaleImageData, setting)
        this.setting = setting
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
    }

    start ({debug} = {}) {
        const {fps = 60 } = this.setting
        this.framesEngine = new FrameEngine(fps, e => {
            this.update()
            this.draw(this.ctx, debug)
        })
        this.framesEngine.start()
        return this
    }

    stop () {
        if (!this.framesEngine) return this
        this.framesEngine.stop()
    }
}