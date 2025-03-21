import {setCanvas} from '../../_helpers/basic.js'
import draw from '../../_helpers/draw.js'
import {hilbert} from '../../_math/hilbert-curve.js'
import {map, random} from '../../_math/math.js'

const {ceil, log2, min} = Math

export class sparkEffect {
    constructor (canvas, settings) {
        console.time('sparkEffect init')
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        // setCanvas(canvas, canvas.parentElement)
        var {width, height} = canvas
        // var order = ceil(log2(width))
        var order = 8
        var total = 4 ** order

        canvas.width = 2 ** order
        canvas.height = 2 ** order

        console.log('order', order, 'total', total)
        this.path = Array.from(Array(total))
            .map((_, i) => hilbert(i, order))
            .filter(({x, y}) => x < width && y < height)
            .map((p) => p.simple)

        this.sparks = new Set()
        this.order = order
        this.settings = {
            length: [5, 10],
            ttl: [30, 60],
            hue: [100, 140],
            gap: 5,
            ...settings,
        }
        console.timeEnd('sparkEffect init')
    }

    #createSparkPath (start, length, ttl, steps = 1) {
        var fullLen = length + ttl
        var traverseLength = fullLen * steps
        var lastIndex = min(start + traverseLength, this.path.length)
        start = lastIndex - traverseLength
        var path = []
        for (let i = start; i < lastIndex; i += steps) {
            path.push(this.path[i])
        }
        if (path.length < length) path = path.slice(-fullLen)
        return path
    }

    createSpark () {
        const {length, ttl, hue, gap} = this.settings
        let spark = {
            length: random(length[0], length[1]),
            pos: random(0, this.path.length),
            ttl: random(ttl[0], ttl[1]),
            hue: random(hue[0], hue[1]),
        }
        // console.log(spark)
        spark.path = this.#createSparkPath(spark.pos, spark.length, spark.ttl, gap)
        this.sparks.add(spark)
    }

    update (chance = 1) {
        var {sparks} = this
        for (let s of sparks) {
            s.path.shift()
            if (s.path.length === 0) {
                sparks.delete(s)
            }
        }
        if (Math.random() < chance)
            this.createSpark()
    }

    draw () {
        var {path, sparks, ctx} = this
        for (let s of sparks) {
            let tl = s.path.length - s.length
            let miniPath = s.path.slice(0, s.length)
            draw.curve(ctx, miniPath, {
                strokeStyle: `hsl(${s.hue} 80%  90% / ${tl / s.ttl}`,
            })
        }

        // for (let j = 0; j < this.path.length -1 ; j += 1) {
        //     ctx.beginPath()
        //     ctx.moveTo(path[j].x, path[j].y)
        //     ctx.lineTo(path[j + 1].x, path[j + 1].y)
        //     let h = map(j, 0, path.length, 0, 360)
        //     ctx.strokeStyle = `hsl(${h}deg 80% 50% / 1)`
        //     ctx.lineWidth = 1
        //     ctx.stroke()
        // }
    }
}
