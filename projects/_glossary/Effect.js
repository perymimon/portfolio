export class Effect {
    constructor (width, height, settings = {}) {
        this.particles = []
        this.width = width
        this.height = height
        this.settings = settings
        this.resize(width, height)
    }

    resize (width, height) {
        this.width = width
        this.height = height
        this.init()
    }
    init () {
        throw 'init() must be implemented by derived class'
    }
    update () {
        for (let p of this.particles) {
            p.update()
        }
    }

    draw (ctx) {
        for (let p of this.particles) {
            p.draw(ctx)
        }
    }
}