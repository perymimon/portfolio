import {Effect} from '../_glossary/Effect.js'
import {dot, magnitude} from '../_math/math.js'

export default class MarbleEffect extends Effect {
    constructor (width, height, polygons = [], settings = {}) {
        super(width, height, settings)
        this.init(polygons)
    }

    init (polygons = []) {
        this.polygons = []
        for (let poly of polygons) {
            this.putDrop(poly)
        }
    }

    putDrop (drop) {
        this.marbling(this.particles, drop)
        this.particles.push(...drop)
        this.polygons.push(drop)
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
        console.log('Input parameters:');
        console.log(`point:${point}`);
        console.log(`vec: ${vec}`);
        console.log(`z: ${z}`);
        console.log(`c: ${c}`);

        // P += z + u^d + m
        const u = 1 / Math.pow(2, 1 / c);
        console.log('u (1 / 2^(1/c)):', u);

        const normal = vec.clone.normal();
        console.log(`normal: ${normal}` );

        // Debug: Log the number of particles
        console.log('Number of particles:', this.particles.length);
        for (let p of this.particles) {
            // Debug: Log current particle
            let pb = p.vectorFrom(point);
            let d = Math.abs(dot(pb, normal));
            let mag = z * Math.pow(u, d);
            let translationVector = vec.clone.scale(mag);
            p.translate(translationVector);

            if( !translationVector.equalTo({x:0,y:0}) ) {
                console.group('point')
                // console.log(`particle: ${p}`);
                console.log(`pb (vector from point to particle): ${pb}`);
                // console.log(`d (absolute dot product of pb and normal):${d}`);
                // console.log(`mag (magnitude for translation): ${mag}`);
                console.log(`translationVector (vec scaled by mag): ${translationVector}` );
                // console.log(`Particle translated. New position:${p}`);
                console.groupEnd()
            }
        }

        // Debug: Log completion
        console.log('timeLine function completed.');
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
