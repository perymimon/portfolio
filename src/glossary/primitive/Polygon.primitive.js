import {draw} from '../../helpers/draw.js'

export default class Polygon {
    constructor (points = []) {
        this.points = points
    }

    draw (ctx, settings = {drawStroke: true,}) {

        draw.polygon(ctx, this.points, {
            ...settings,
        })
    }

    *[Symbol.iterator]() {
        for (const point of this.points) {
            yield point
        }
    }

}