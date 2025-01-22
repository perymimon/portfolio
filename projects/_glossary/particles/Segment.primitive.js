import {draw} from '../../_helpers/draw.js'
import {dot, magnitude, normalize} from '../../_math/2D.math.js'
import {getIntersection} from '../../_math/segment-intersection.js'
import Point from './Point.primitive.js'

export default class Segment {
    constructor (p1, p2) {
        this.p1 = p1
        this.p2 = p2
    }
    update(){
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
        return normal ? normalize(vec) : vec
    }

    get length () {
        return magnitude(this.vector(false))
    }
    set length (length) {
        var norm = this.vector(true)
        this.p2 = this.p1.toAdd(norm.toScale(length))
    }

    projectPoint (point) {
        const a = this.p1.vectorTo(point)
        const norm = this.vector()
        const scalar = dot(a, norm)
        return {
            point: this.p1.toAdd(norm.toScale(scalar)),
            offset: scalar / this.length,
        };
    }
    intersectionPoint (seg) {
         var ret = getIntersection(this, seg)
        if( ret == null ) return  null
        return {
             point: new Point(ret.x, ret.y),
            offset: seg
        }
    }
}