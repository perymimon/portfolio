import Point from '../_glossary/particles/Point.primitive.js'
import Segment from '../_glossary/particles/Segment.primitive.js'
import {getProperty} from '../_helpers/basic.js'
import {draw} from '../_helpers/draw.js'

export default class Light {
    constructor (x, y, settings = {}) {
        this.settings = {range: 400, raysAmount: 180, ...settings}
        this.center = new Point(x, y, this)
        this.rays = []

        var {raysAmount, range} = this.settings;
        this.setRays(raysAmount, range)
    }

    setRays (amount, range) {
        const {beamDirection = 0, spread = Math.PI / 3} = this.settings

        this.rays = Array(amount).fill().map((_, i) => {
            let angle = beamDirection - (i / amount - .5) * spread
            let x = Math.cos(angle) * range
            let y = Math.sin(-angle) * range
            return new Segment(this.center, this.center.toAdd({x, y}))
        })
    }
    moveTo ({x, y}) {
        var vec = this.center.vectorTo({x, y})
        this.center.setX(x)
        this.center.setY(y)
        this.rays.forEach(ray => ray.p2.add(vec))
    }

    cast () {
        const {boundaries = [], range} = this.settings
        for (let ray of this.rays) {
            ray.length = range
        }
        for (let boundary of boundaries) {
            for (let ray of this.rays) {
                var intr = boundary.intersectionPoint(ray)
                if (intr) ray.p2 = intr.point
            }
        }
    }

    update () {
        this.cast()
    }

    draw (ctx, settings = {}) {
        var {spread} = this.settings;
        this.center.draw(ctx, {
            fillStyle: this.settings.color,
            ...settings,
        })
        var {rainbow} = this.settings
        var points = this.rays.map((ray, i) => ray.p2)

        if(spread <Math.PI * 2) points.unshift(this.center)

        draw.polygon(ctx, points, {
            fillStyle: this.settings.color,
            ...settings,
        })
        if (rainbow) {
            this.rays.forEach((ray, i) => ray.draw(ctx, {
                strokeStyle: getProperty(ctx, `hsl(${i * 2} 50% 50)`),
            }))
        }

    }
}
