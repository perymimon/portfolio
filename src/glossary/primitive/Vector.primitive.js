import {magnitude} from '../../math/math.js'
import Coordinates from './Coordinates.primitive.js'
import {draw} from '../../helpers/draw.js'

export default class Vector extends Coordinates{
    static from({x,y}) {
        return new Vector(x,y)
    }
    get clone(){
        return new Vector(this.x, this.y)
    }
    add ({x, y}, scalar = 1) {
        return this.set({
            x: this.x + (x * scalar),
            y: this.y + (y * scalar),
        })
    }
    get length(){
        return Math.hypot(this.x.value, this.y.value, this.z?.value?? 0)
    }
    get magnitude(){ return this.length }

    get angle(){
        return Math.atan2(this.y.value,this.x.value)
    }
    dot(v){
        return this.x * v.x + this.y * v.y
    }
    setLength(length) {
        var a = this.angle
        var x = length * Math.cos(a)
        var y = length * Math.sin(a)
        return this.set({x,y})
    }
    setPolar (amplitude, angle) {
        const xOffset = amplitude * Math.cos(angle)
        const yOffset = amplitude * Math.sin(angle)

        this.x.value = this.x.start + xOffset
        this.y.value = this.y.start + yOffset
        return this;
    }
    normal(clockwise = 1){
        let dir = clockwise * 2 - 1
        return this.set({
            x:-this.y * dir,
            y:this.x * dir,
        })
    }
    scale(scalar){
        this.x.value *= scalar
        this.y.value *= scalar
        return this
    }
    draw(ctx, {x,y}, options){
        draw.arrow(ctx,x, y, x+this.x, y + this.y, options)
    }

}

// =============================================
// Console Assert Tests
// =============================================

// Test 1: Constructor and initial values
const vector1 = new Vector(3, 4);
console.assert(vector1.x == 3, 'Test 1 failed: x should be 3')
console.assert(vector1.y == 4, 'Test 1 failed: y should be 4')

// Test 2: clone method
const vector2 = vector1.clone;
console.assert(vector2.x == 3, 'Test 2 failed: cloned x should be 3')
console.assert(vector2.y == 4, 'Test 2 failed: cloned y should be 4')

// Test 3: add method
vector1.add({ x: 1, y: 2 });
console.assert(vector1.x == 4, 'Test 3 failed: x should be 4 after add')
console.assert(vector1.y == 6, 'Test 3 failed: y should be 6 after add')

// Test 4: length property
console.assert(vector1.length === Math.hypot(4, 6), 'Test 4 failed: length should be correct')

// Test 5: angle property
console.assert(vector1.angle === Math.atan2(6, 4), 'Test 5 failed: angle should be correct')

// Test 6: setLength method
vector1.setLength(10);
console.assert(Math.abs(vector1.length - 10) < 0.001, 'Test 6 failed: length should be 10 after setLength')

// Test 7: setPolar method
vector1.setPolar(5, Math.PI / 4); // 45 degrees
console.assert(Math.abs(vector1.x - (vector1.x.start + 5 * Math.cos(Math.PI / 4))) < 0.001, 'Test 7 failed: x should be correct after setPolar')
console.assert(Math.abs(vector1.y - (vector1.y.start + 5 * Math.sin(Math.PI / 4))) < 0.001, 'Test 7 failed: y should be correct after setPolar')

// Test 8: normal method
const normalVector = vector1.clone.normal();
console.assert(normalVector.x == -vector1.y, 'Test 8 failed: normal x should be correct')
console.assert(normalVector.y == vector1.x *1, 'Test 8 failed: normal y should be correct')

// Test 9: scale method
vector2.set(vector1.clone.scale(2))
console.assert(vector2.x == 2 * vector1.x, 'Test 9 failed: x should be scaled correctly')
console.assert(vector2.y == 2 * vector1.y, 'Test 9 failed: y should be scaled correctly')

// Test 10: static from method
const vector3 = Vector.from({ x: 5, y: 12 })
console.assert(vector3.x == 5, 'Test 10 failed: x should be 5')
console.assert(vector3.y == 12, 'Test 10 failed: y should be 12')

console.debug('All tests completed.')