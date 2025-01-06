export class Effect {
    constructor (width, height) {
        this.particles = []
        this.width = width
        this.height = height
        this.resize(width, height)
    }

    init () {
        throw 'init() must be implemented by derived class'
    }

    resize () {
        this.init()
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