import Point from './Point.primitive.js'
import Polygon from './Polygon.primitive.js'

export class RegularPolygon extends Polygon {
    constructor (cx, cy, radius, sides) {
        var PI2 = Math.PI * 2
        let slice = PI2 / sides

        var points = Array.from({length: sides}, (_, i) => {
            let a = slice * i
            let x = cx + Math.cos(a) * radius
            let y = cy + Math.sin(a) * radius
            return new Point(x, y)
        })

        super(points)
        this.center = new Point(cx, cy)
        this.radius = radius
        Object.freeze(this)

    }
}