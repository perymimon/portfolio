import {Effect} from '../_glossary/Effect.js'
import {magnitude, scale} from '../_math/2D.math.js'

export default class MarbleEffect extends Effect {
    constructor (width, height, polygons = [], settings = {}) {
        super(width, height, settings)
        this.init(polygons)
    }

    draw (ctx, settings) {
        settings = settings instanceof Function ?
             this.polygons.map(settings):
            Array(this.polygons.length).fill(settings)

        for (let [i, poly] of this.polygons.entries()) {
            poly.draw(ctx, settings[i])
        }
    }

    init (polygons) {
        this.polygons = []
        for(let poly of polygons) {
            this.putDrop(poly)
        }
    }

    putDrop (drop) {
        this.marbling(this.polygons, drop)
        this.particles.push(...drop)
        this.polygons.push(drop)
    }

    marbling (polygons, drop) {
        for (let poly of polygons) {
            this.marbleBy(poly, drop)
        }
    }

    marbleBy (poly, drop) {
        /*
        C + (P-C) * sqrt(1 + r2/|P-C|2)
        */
        let C = drop.center
        let r = drop.radius
        for (let P of poly) {
            let V = P.toSub(C)
            let mag = magnitude(V)
            let factor = Math.sqrt(1 + (r * r) / (mag * mag))
            P.set(scale(V, factor).add(C))
        }

    }

    tineLine (xl, z, c) {
        /*
        * y+ z * u^|x-xl|
        * */
        let u = 1 / (2 ** (1 / c))
    }


}
