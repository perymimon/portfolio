import Point from './Point.primitive.js'

export default class Pixel extends Point {
    constructor (i, imageData) {
        const {width, height} = imageData
        const [x, y] = [i % width, Math.floor(i / height)]
        super(x, y)
        this.i4 = i * 4
        Object.assign(this.x, {min: 0, max: width})
        Object.assign(this.y, {min: 0, max: height})
        this.imageData = imageData
    }

    get rgba () {
        const i4 = this.i4
        return [
            this.imageData.data[i4],
            this.imageData.data[i4 + 1],
            this.imageData.data[i4 + 2],
            this.imageData.data[i4 + 3],
        ]
    }

    set rgba ([r, g, b, a]) {
        let i4 = this.i4
        if (r) this.imageData.data[i4] = r
        if (g) this.imageData.data[i4 + 1] = g
        if (b) this.imageData.data[i4 + 2] = b
        if (a) this.imageData.data[i4 + 3] = a
        return this
    }

    save (imageData) {
        const {width, height, data} = imageData
        const i4 = (Math.round(this.x) + Math.round(this.y) * width) * 4
        if (i4 > data.length && i4 < 0) return false
        data.set(this.rgba, i4)
    }

    draw (ctx, size, options) {
        const [r, g, b, a] = this.rgba
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(this.x, this.y, 1, 1)
    }
}