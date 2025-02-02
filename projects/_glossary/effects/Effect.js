export class Effect  {
    constructor (width, height, settings = {}) {
        this.particles = []
        this.width = width
        this.height = height
        this.settings = settings

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
    getDrawSetting(settings, p, i){
        return settings instanceof Function ? settings(p,i) : settings
    }
    draw (ctx, drawSetting) {
        for (let [i,p] of this.particles.entries()) {
            p.draw(ctx, this.getDrawSetting(drawSetting,p,i))
        }
    }
}