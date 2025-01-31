import Point from '../_glossary/primitive/Point.primitive.js'
import Segment from '../_glossary/primitive/Segment.primitive.js'
import {Value} from '../_glossary/Value.js'
import {getProperty} from '../_helpers/basic.js'
import {getRadialGradient} from '../_helpers/cavas.basic.js'
import {draw} from '../_helpers/draw.js'

export default class Light {
    constructor (x, y, settings = {}) {
        this.settings = {range: 400, raysAmount: 180, ...settings}
        this.center = new Point(x, y, this)
        this.rays = []
        this.direction = new Value(settings.beamDirection ?? 0)
        this.spread = new Value(settings.spread ?? Math.PI / 3)
        this.amount = this.settings.raysAmount
        var {raysAmount} = this.settings;
        this.setRays(raysAmount)
        this.direction.onChange = () => this.updateDirection()
        this.spread.onChange = () => this.updateDirection()
    }

    setRays (amount) {
        this.rays = Array.from({length: amount}, (_, i) =>
            new Segment(this.center)
        )
        this.updateDirection()
    }

    updateDirection () {
        const {spread, amount, direction} = this
        this.rays.forEach((ray, i) => {
            let angle = direction + (i / amount - .5) * spread
            console.log(angle)
            ray.p2.orbitAround(ray.p1, angle)
        })
    }

    translateTo ({x, y}) {
        var vec = this.center.vectorTo({x, y})
        this.center.setX(x)
        this.center.setY(y)
        this.rays.forEach(ray => ray.p2.translate(vec))
    }

    cast () {
        const {boundaries = [], range} = this.settings

        for (let ray of this.rays) {
            ray.setLength(range)
            for (let boundary of boundaries) {
                var intr = boundary.intersectionPoint(ray)
                if (intr?.exceedsSeg2) continue
                if (intr) ray.p2.set(intr.point)
            }
        }
    }

    update () {
        this.direction.update()
        this.spread.update()
        this.cast()
    }

    draw (ctx, settings = {}) {
        var {center} = this
        var {range, spread, gradientLight = true} = this.settings
        var {rainbow} = settings

        center.draw(ctx, {
            fillStyle: this.settings.color,
            ...settings,
        })

        var points = this.rays.map((ray, i) => ray.p2)
        if (spread < Math.PI * 2) points.unshift(this.center)

        var fillStyle = getProperty(ctx, this.settings.color)
        if (gradientLight)
            fillStyle = getRadialGradient(ctx, center.x, center.y, range, {
                0.4: getProperty(ctx, this.settings.color),
                1: 'transparent',
            })

        draw.polygon(ctx, points, {
            fillStyle, ...settings,
        })
        if (rainbow) {
            this.rays.forEach((ray, i) => ray.draw(ctx, {
                strokeStyle: getProperty(ctx, `hsl(${i * 2} 50% 50)`),
            }))
        }

    }
}
