import {FrameEngine} from '../_glossary/FrameEngine.js'
import {getProperty} from '../_helpers/basic.js'
import {draw} from '../_helpers/draw.js'
import Point from '../_glossary/particles/Point.primitive.js'
import Segment from '../_glossary/particles/Segment.primitive.js'

var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

class Light {
    constructor (x, y, settings = {}) {
        var {raysAmount = 180, range = 400} = settings;
        this.center = new Point(x, y, this)
        this.rays = []
        this.range = range
        this.settings = settings
        this.setRays(raysAmount, range);
    }

    setRays (amount, range) {
        this.rays = Array(amount).fill().map((_, i) => {
            var x = Math.cos(i / amount * -Math.PI) * range
            var y = Math.sin(i / amount * -Math.PI) * range
            return new Segment(this.center, this.center.toAdd({x, y}))
        })
    }

    setBoundaries (boundaries) {
        this.boundaries = boundaries
    }

    update () {
        for (let boundary of this.boundaries) {
            for (let ray of this.rays) {
                var intr = boundary.intersectionPoint(ray)
                if (intr) ray.p2 = intr.point
                else ray.length = this.range
            }
        }

    }

    draw (ctx) {
        this.center.draw(ctx, {fillStyle: getProperty(ctx, '--color-primary')})

        var points = this.rays.map((ray, i) => ray.p2)
        draw.polygon(ctx, points, {
            fillStyle: this.settings.color,
        })
        this.rays.forEach((ray,i) => ray.draw(ctx, {
            // strokeStyle: getProperty(ctx, '--color-secondary'),
            strokeStyle: getProperty(ctx, `hsl(${i*2} 50% 50)`),
        }))

    }
}

var wall = new Segment(new Point(100, 100), new Point(200, 100))
var light = new Light(150, 450, {
    color: 'yellow',
})
light.setBoundaries([wall])

var {p1, p2} = wall;
[p1, p2].forEach((p) => {
    p.x.speed = .8
    p.x.max = p.x.value + 100
    p.x.min = p.x.value - 100
    p.x.onExceedBoundary = p.x.reflect.bind(p.x)
})

new FrameEngine(25, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    light.update()
    wall.update()
    wall.draw(ctx, {
        strokeStyle: 'brown',/*getProperty(ctx, '--color-primary'),*/
        lineWidth: 10,
    })
    light.draw(ctx)

}).start()
