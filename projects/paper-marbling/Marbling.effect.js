import {Effect} from '../_glossary/effects/Effect.js'
import {dot, magnitude} from '../_math/math.js'

export default class MarbleEffect extends Effect {
    constructor (width, height, polygons = [], settings = {}) {
        super(width, height, settings)
        this.init(polygons)
        delete this.particles
    }

    init (polygons = []) {
        this.polygons = []
        this.pixels = []
        for (let poly of polygons) {
            this.putDrop(poly)
        }
    }

    putDrop (drop) {
        this.marbling(this.particles(), drop)
        // this.particles.push(...drop)
        this.polygons.push(drop)
    }

    *particles () {
        for (let pixelImage of this.pixels) {
            yield* pixelImage
        }
        for (let poly of this.polygons) {
            yield* poly
        }
    }
    draw (ctx, drawSettings) {
        for (let [i, poly] of this.polygons.entries()) {
            poly.draw(ctx, this.getDrawSetting(drawSettings, poly, i))
        }
    }

    marbling (points, drop) {
        let C = drop.center
        let r = drop.radius
        for (let P of points) {
            let V = P.vectorFrom(C)
            let mag = magnitude(V)
            let factor = Math.sqrt(1 + (r * r) / (mag * mag))
            P.set(V.scale(factor).add(C))
        }
    }

    tineLine(point, vec, z, c) {
        // Debug: Log input parameters
        // P += z + u^d + m
        const u = 1 / Math.pow(2, 1 / c);
        const normal = vec.clone.normal();
        // Debug: Log the number of particles
        for (let p of this.particles) {
            // Debug: Log current particle
            let pb = p.vectorFrom(point);
            let d = Math.abs(dot(pb, normal));
            let mag = z * Math.pow(u, d);
            let translationVector = vec.clone.scale(mag);
            p.translate(translationVector);
        }
    }

    tineLineX (xl, z, c) {
        /*
        * y+ z * u^|x-xl|
        * */
        let u = 1 / Math.pow(2, 1 / c)
        for (let P of this.particles) {
            let y = P.y + z * Math.pow(u, Math.abs(P.x - xl))
            P.setY(y)
        }
    }

}
