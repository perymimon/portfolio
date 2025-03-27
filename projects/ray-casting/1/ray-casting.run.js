import {FrameEngine} from '../../../src/glossary/FrameEngine.js'
import Point from '../../../src/glossary/primitive/Point.primitive.js'
import Segment from '../../../src/glossary/primitive/Segment.primitive.js'
import {getProperty} from '../../../src/helpers/basic.js'
import Light from '../Light.js'

var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var walls = Array.from({length: 5}, (_) => {
    let p1 = new Point(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
    )
    let p2 = new Point(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
    )
    let wall = new Segment(p1, p2)
    wall.length = 60 + Math.random() * 150
    let speed = (Math.random() - 0.5) * 2
    let limit = Math.random() * 300
    for (let p of wall) {
        p.x.speed = speed
        p.x.max = p.x.value + limit
        p.x.min = p.x.value - limit
        p.x.onExceedBoundary = p.x.reflect.bind(p.x)
    }
    return wall
})

var light0 = new Light(canvas.width / 2, canvas.height / 2, {
    color: getProperty(ctx, '--color-primary'),
    boundaries: walls,
    beamDirection: 0,
    spread: Math.PI / 2,
    range: 400,
})

var light1 = new Light(0, 0, {
    color: getProperty(ctx, '--color-primary'),
    boundaries: walls,
    beamDirection: -Math.PI / 4,
    spread: Math.PI / 3,
    range:800,
})
var light2 = new Light(0, canvas.height, {
    color: getProperty(ctx, '--color-primary'),
    boundaries: walls,
    beamDirection: Math.PI / 4,
    spread: Math.PI / 6,
    range:800,
})


new FrameEngine(30, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    walls.forEach(wall => wall.update())

    light0.update()
    light1.update()
    light2.update()
    ctx.save()
    ctx.globalAlpha = 0.5
    light0.draw(ctx)
    light1.draw(ctx)
    light2.draw(ctx)
    ctx.restore()
    walls.forEach(wall =>
        wall.draw(ctx, {
            strokeStyle: getProperty(ctx, '--color-secondary'),
            lineWidth: 8,
        })
    )

}).start()
