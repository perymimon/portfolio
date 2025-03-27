import {Effect} from '../../src/glossary/effects/Effect.js'
import {add, dot, magnitude, scale, vectorFrom} from '../../src/math/math.js'

export default class PaperMarbleEffect extends Effect {
    constructor (polygons = [], settings = {}) {
        super(0, 0, {
            limitPolygons: 200,
            ...settings,
        })
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

    putDrop (drop, saveIt) {
        this.marbling(this.particles(), drop)
        if (saveIt) {
            this.polygons.push(drop)
            if (this.settings.limitPolygons) {
                const {polygons, settings: {limitPolygons}} = this
                while (polygons.length > limitPolygons) polygons.shift()
            }
        }
    }

    * particles () {
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
            let V = vectorFrom(C, P)
            let mag = magnitude(V)
            let factor = Math.sqrt(1 + (r * r) / (mag * mag))
            P.set(add(C, scale(V, factor)))
        }
    }

    tineLine (point, vec, z, c) {
        // Debug: Log input parameters
        // P += z + u^d + m
        const u = 1 / Math.pow(2, 1 / c)
        const normal = vec.clone.normal()
        // Debug: Log the number of particles
        for (let p of this.particles()) {
            // Debug: Log current particle
            let pb = vectorFrom(point, p)
            let d = Math.abs(dot(pb, normal))
            let mag = z * Math.pow(u, d)
            let translationVector = scale(vec, mag)
            p.set(add(p, translationVector))
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
