import {draw} from '../../_helpers/draw.js'
import {lerp} from '../../_math/math.js'

import Coordinates from './Coordinates.primitive.js'
import Vector from './Vector.primitive.js'

export default class Point extends Coordinates {
    static from ({x, y}) {
        return new Point(x, y)
    }

    get clone () {
        return new Point(this.x, this.y)
    }

    distanceFrom ({x, y}) {
        return Math.hypot(this.x - x, this.y - y)
    }

    lerpPoint ({x, y}, t = 0.5) {
        return this.set({
            x: lerp(this.x, x, t),
            y: lerp(this.y, y, t),
        })
    }

    reflectAround ({x, y}) {
        return this.set({
            x: 2 * x - this.x,
            y: 2 * y - this.y,
        })
    }

    mult (scalar) {
        return this.set({
            x: this.x * scalar,
            y: this.y * scalar,
        })
    }

    translate ({x, y}) {
        return this.set({
            x: this.x + x,
            y: this.y + y,
        })
    }

    swapMainDiagonal () {
        let x = this.y.valueOf()
        let y = this.x.valueOf()
        return this.set({x, y})
    }

    swapSecondDiagonal (len) {
        let y = len - this.x
        let x = len - this.y
        return this.set({x, y})
    }

    vectorFrom ({x, y}) {
        return new Vector(
            this.x - x,
            this.y - y,
        )
    }

    vectorTo ({x, y}) {
        return new Vector(
            x - this.x,
            y - this.y,
        )
    }

    angleTo ({x, y}) {
        return Math.atan2(this.y - y, this.x - x)
    }

    orbitAround ({x, y}, angle) {
        const dx = this.x - x;
        const dy = this.y - y;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return this.set({
            x: x + (dx * cos - dy * sin),
            y: y + (dx * sin + dy * cos),
        });
    }

    isInsideBoundingBox (minCorner, maxCorner) {
        return (
            this.x >= minCorner.x && this.x <= maxCorner.x &&
            this.y >= minCorner.y && this.y <= maxCorner.y
        );
    }

    draw (ctx, size = 10, options) {
        draw.circle(ctx, this.x, this.y, size, {
            drawFill: true,
            ...options,
        });
    }
}


// =============================================
// Console Assert Tests
// =============================================

// Test 1: Constructor and initial values
const point1 = new Point(20, 30);
point1.set({x: 10, y: 20})
console.assert(point1.x == 10, 'Test 1 failed: x should be 10');
console.assert(point1.y == 20, 'Test 1 failed: y should be 20');
console.assert(point1.x.start == 20, 'Test 1 failed: x.start should be 20');
console.assert(point1.y.start == 30, 'Test 1 failed: y.start should be 30');

// Test 2: clone method
const point2 = point1.clone;
console.assert(point2.x == 10, 'Test 2 failed: cloned x should be 10');
console.assert(point2.y == 20, 'Test 2 failed: cloned y should be 20');
console.assert(point2.x.start == 10, 'Test 2 failed: cloned x.start should be 10');
console.assert(point2.y.start == 20, 'Test 2 failed: cloned y.start should be 20');

// Test 3: distanceFrom method
console.assert(point1.distanceFrom({
    x: 10,
    y: 20,
}) === 0, 'Test 3 failed: distance should be 0');
console.assert(point1.distanceFrom({
    x: 13,
    y: 24,
}) === 5, 'Test 3 failed: distance should be 5');

// Test 4: lerpPoint method
point1.lerpPoint({x: 20, y: 30}, 0.5);
console.assert(point1.x == 15, 'Test 4 failed: x should be 15 after lerp');
console.assert(point1.y == 25, 'Test 4 failed: y should be 25 after lerp');

// Test 5: reflectAround method
point1.reflectAround({x: 10, y: 10});
console.assert(point1.x == 5, 'Test 5 failed: x should be 5 after reflection');
console.assert(point1.y == -5, 'Test 5 failed: y should be -5 after reflection');

// Test 6: translate method
point1.translate({x: 5, y: 5});
console.assert(point1.x == 10, 'Test 6 failed: x should be 10 after translation');
console.assert(point1.y == 0, 'Test 6 failed: y should be 0 after translation');

// Test 7: vectorFrom method
const vectorFrom = point1.vectorFrom({x: 5, y: 5});
console.assert(vectorFrom instanceof Vector, 'Test 7 failed: vectorFrom should be Vector instance')
console.assert(vectorFrom.x == 5, 'Test 7 failed: vectorFrom x should be 5');
console.assert(vectorFrom.y == -5, 'Test 7 failed: vectorFrom y should be -5');

// Test 8: vectorTo method
const vectorTo = point1.vectorTo({x: 15, y: 10});
console.assert(vectorTo instanceof Vector, 'Test 8 failed: vectorTo should be Vector instance')
console.assert(vectorTo.x == 5, 'Test 8 failed: vectorTo x should be 5');
console.assert(vectorTo.y == 10, 'Test 8 failed: vectorTo y should be 10');

// Test 9: orbitAround method
point1.set({x: 20, y: 20});
point1.orbitAround({x: 10, y: 20}, Math.PI / 2); // Rotate 90 degrees
console.assert(Math.abs(point1.x - 10) < 0.001, 'Test 9 failed: x should be ~10 after orbit');
console.assert(Math.abs(point1.y - 30) < 0.001, 'Test 9 failed: y should be ~30 after orbit');

point1.orbitAround({x: 10, y: 20}, Math.PI / 2); // Rotate 90 degrees
console.assert(Math.abs(point1.x - 0) < 0.001, 'Test 9 failed: x should be ~-0 after orbit');
console.assert(Math.abs(point1.y - 20) < 0.001, 'Test 9 failed: y should be ~20 after orbit');

point1.orbitAround({x: 10, y: 20}, Math.PI / 2); // Rotate 90 degrees
console.assert(Math.abs(point1.x - 10) < 0.001, 'Test 9 failed: x should be ~10 after orbit');
console.assert(Math.abs(point1.y - 10) < 0.001, 'Test 9 failed: y should be ~ 10 after orbit');

// Test 10: isInsideBoundingBox method
console.assert(point1.isInsideBoundingBox({x: 0, y: 0}, {
    x: 20,
    y: 20,
}), 'Test 10 failed: point should be inside bounding box');
console.assert(!point1.isInsideBoundingBox({x: 0, y: 0}, {
    x: 5,
    y: 5,
}), 'Test 10 failed: point should be outside bounding box');

// Test 11: static from method
const point3 = Point.from({x: 30, y: 40});
console.assert(point3.x == 30, 'Test 11 failed: x should be 30');
console.assert(point3.y == 40, 'Test 11 failed: y should be 40');

console.debug('Point.primitive.js: All tests completed.');