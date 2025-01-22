import {draw} from '../../_helpers/draw.js'

export default class Polygon {
    constructor (points = []) {
        this.points = points
    }

    draw (ctx, settings) {
        draw.polygon(ctx, this.points, {
            drawStroke: true,
            ...settings,
        })


    }
}