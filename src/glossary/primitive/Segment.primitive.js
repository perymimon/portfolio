import {protect} from '../../helpers/basic.js'
import {draw} from '../../helpers/draw.js'
import {dot} from '../../math/math.js'
import {getIntersection} from '../../math/segment-intersection.js'
import Point from './Point.primitive.js'

export default class Segment {
    constructor (p1, p2 = null) {
        this.p1 = p1
        this.p2 = p2 ?? p1.clone.translate({x:1, y:0})
        protect(this, 'p1')
        protect(this, 'p2')
    }

    update () {
        this.p1.update()
        this.p2.update()
    }

    draw (ctx, options) {
        var {p1, p2} = this
        draw.line(ctx, p1.x, p1.y, p2.x, p2.y, {
            ...options,
        })
    }

    vector (normal = true) {
        var vec = this.p1.vectorTo(this.p2)
        return normal ? vec.setLength(1): vec
    }

    get length () {
        return this.vector(false).length
    }

    setLength (length) {
        var vector = this.vector(false).setLength(length)
        this.p2.set(this.p1.clone.translate(vector))
        return this
    }


    projectPoint (point) {
        const v = this.p1.vectorTo(point)
        const norm = this.vector(false).setLength(1)
        const scalar = dot(v, norm)
        return {
            point: this.p1.clone.translate(norm.scale(scalar)),
            offset: scalar / this.length,
        };
    }

    intersectionPoint (ray) {
        var result = getIntersection(this, ray)
        if (result.exceedsSeg1) return null
        if (result.exceedsSeg2) return null
        return {
            point: Point.from(result),
            offset: result.offset,
        }
    }

    * [Symbol.iterator] () {
        yield this.p1
        yield this.p2
    }

    toString(fixed = 0) {
        console.info(`
            [Segment] 
            p1 {x:%s, y:%s}
            p2 {x:%s, y:%s}`,

            this.p1.x.value.toFixed(fixed),
            this.p1.y.value.toFixed(fixed),
            this.p2.x.value.toFixed(fixed),
            this.p2.y.value.toFixed(fixed),
        )
    }
}