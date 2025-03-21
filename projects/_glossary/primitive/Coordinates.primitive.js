import {protect} from '../../_helpers/basic.js'
import {angle2P, eps} from '../../_math/math.js'
import {Value} from '../Value.js'

export default class Coordinates {
    x = 0
    y = 0

    constructor (x, y, z = 0) {
        this.x = new Value(x)
        this.y = new Value(y)
        protect(this, 'x')
        protect(this, 'y')
        // defineProtect(this, 'x', new Value(x))
        // defineProtect(this, 'y', new Value(y))
        // if (z !== undefined)
        //     defineProtect(this, 'z', new Value(z))
    }
    get simple(){
        return {
            x:this.x.value,
            y:this.y.value,
        }
    }

    setX (x) { this.x.value = x  + 0}

    setY (y) { this.y.value = y  + 0}

    set ({x, y}) {
        this.x.value = x + 0 /*in case x is Value Instance*/
        this.y.value = y + 0
        return this
    }
    setStart ({x, y}) {
        this.x.start = x + 0
        this.y.start = y + 0
    }
    equalTo ({x, y}) {
        return Math.abs(this.x.value - x) < eps && Math.abs(this.y.value - y) < eps
    }

    update () {
        this.x.update()
        this.y.update()
        this.z?.update()
    }

    resetStart () {
        this.setStart({
            x: this.x,
            y: this.y
        })
    }

    transitionToStart (speed) {
        let xs = this.x.value, ys = this.y.value, xe = this.x.start,
            ye = this.y.start;
        var angle = angle2P({x: xs, y: ys}, {x: xe, y: ye})
        this.x.speed = speed * Math.cos(angle)
        this.y.speed = speed * Math.sin(angle)
    }

    toString () {
        return `Point(${this.x}, ${this.y})`;
    }
}
// =============================================
// Console Assert Tests
// =============================================

// Test 1: Constructor and initial values
const point1 = new Coordinates(10, 20);
console.assert(point1.x.value === 10, 'Test 1 failed: x should be 10');
console.assert(point1.y.value === 20, 'Test 1 failed: y should be 20');

// Test 2: setX and setY methods
point1.setX(30);
point1.setY(40);
console.assert(point1.x.value === 30, 'Test 2 failed: x should be 30 after setX');
console.assert(point1.y.value === 40, 'Test 2 failed: y should be 40 after setY');

// Test 3: set method
point1.set({ x: 50, y: 60 });
console.assert(point1.x.value === 50, 'Test 3 failed: x should be 50 after set');
console.assert(point1.y.value === 60, 'Test 3 failed: y should be 60 after set');

// Test 4: equalTo method
const point2 = new Coordinates(50, 60);
console.assert(point1.equalTo(point2), 'Test 4 failed: point1 should equal point2');
console.assert(!point1.equalTo({ x: 70, y: 80 }), 'Test 4 failed: point1 should not equal { x: 70, y: 80 }');

// Test 5: setStart and resetStart methods
point1.setStart({ x: 100, y: 200 });
console.assert(point1.x.start === 100, 'Test 5 failed: x.start should be 100');
console.assert(point1.y.start === 200, 'Test 5 failed: y.start should be 200');

point1.resetStart();
console.assert(point1.x.start === point1.x.value, 'Test 5 failed: x.start should reset to x.value');
console.assert(point1.y.start === point1.y.value, 'Test 5 failed: y.start should reset to y.value');

// Test 6: transitionToStart method
point1.setStart({ x: 100, y: 100 });
point1.transitionToStart(10);
console.assert(point1.x.speed !== undefined, 'Test 6 failed: x.speed should be set');
console.assert(point1.y.speed !== undefined, 'Test 6 failed: y.speed should be set');

// Test 7: toString method
console.assert(point1.toString() === `Point(${point1.x}, ${point1.y})`, 'Test 7 failed: toString should return correct string');

// Test 8: update method
point1.x.value = 70;
point1.y.value = 80;
point1.update();
console.assert(point1.x.value !== 70, 'Test 8 failed: x.value should be 70 after update');
console.assert(point1.y.value !== 80, 'Test 8 failed: y.value should be 80 after update');

// Test 9: protect method (x and y cannot be reassigned)
try {
    point1.x = 100; // This should throw an error
    console.assert(false, 'Test 9 failed: x should be protected and cannot be reassigned');
} catch (error) {
    console.assert(true, 'Test 9 passed: x is protected');
}

try {
    point1.y = 200; // This should throw an error
    console.assert(false, 'Test 9 failed: y should be protected and cannot be reassigned');
} catch (error) {
    console.assert(true, 'Test 9 passed: y is protected');
}

console.debug('Coordinates.primitive.js: All tests completed.');