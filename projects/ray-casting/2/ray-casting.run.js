import {FrameEngine} from '../../../src/glossary/FrameEngine.js'
import Point from '../../../src/glossary/primitive/Point.primitive.js'
import Segment from '../../../src/glossary/primitive/Segment.primitive.js'
import Pointer from '../../../src/glossary/Pointer.js'
import {Value} from '../../../src/glossary/Value.js'
import {getProperty} from '../../../src/helpers/basic.js'
import Light from '../Light.js'

var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");


function createWall (cx, cy) {
    let length = 60 + Math.random() * 150
    let speed = (Math.random() - 0.5) * 2
    let limit = Math.random() * 300
    let angle = Math.random() * Math.PI
    let x = Math.cos(angle) * length / 2
    let y = Math.sin(angle) * length / 2

    let p1 = new Point(cx + x, cy + y)
    let p2 = new Point(cx - x, cy - y) /*Around the center*/
    let wall = new Segment(p1, p2)
    // wall.length = length
    for (let p of wall) {
        p.x.speed = speed
        p.x.offsetMax = limit
        p.x.offsetMin = limit
        p.x.onExceedBoundary = p.x.reflect
    }
    return wall
}

const pointer = new Pointer(canvas)
pointer.onMove = (pointer) => {
    light0.translateTo(pointer)
}
pointer.onTap = (pointer) => {
    walls.push(createWall(pointer.x, pointer.y))
    // walls.splice(0,Infinity, ...walls.splice(-15))
    while(walls.length > 15) walls.shift()
}

var walls = Array.from({length: 5}, _ => {
    let x = Math.floor(Math.random() * canvas.width),
        y = Math.floor(Math.random() * canvas.height);
    console.log('create wall at', x, y)
    return createWall(x, y)
})

var light0 = new Light(canvas.width / 2, canvas.height / 2, {
    color: '--shade-0',
    boundaries: walls,
    beamDirection: 0,
    spread: Math.PI * 2,
    range: Math.min(canvas.width, canvas.height) / 2,
})

const screenRadius = Math.hypot(canvas.height, canvas.width) / 2
var directionAnim = {
    speed: Math.PI / 720,
    offsetMin: Math.PI / 12,
    offsetMax: Math.PI / 12,
    onExceedBoundary: (v) => v.reflect(),
}
var spreadAnim = {
    speed: Math.PI / 360,
    min: Math.PI / 12,
    max: Math.PI / 3,
    onExceedBoundary: (v) => v.reflect(),
}
var light1 = new Light(0, 0, {
    color: '--shade-1',
    boundaries: walls,
    beamDirection: new Value(Math.PI / 4, directionAnim),
    spread: Math.PI / 3,
    range: screenRadius,
})

var light2 = new Light(0, canvas.height, {
    color: '--shade-2',
    boundaries: walls,
    beamDirection: new Value(-Math.PI / 4, directionAnim),
    spread: new Value(Math.PI / 6),
    range: screenRadius,
})

var light3 = new Light(canvas.width, 0, {
    color: '--shade-3',
    boundaries: walls,
    beamDirection: new Value(Math.PI * 3 / 4, directionAnim),
    spread: Math.PI / 4,
    range: screenRadius,
})

var light4 = new Light(canvas.width, canvas.height, {
    color: '--shade-4',
    boundaries: walls,
    beamDirection: new Value(Math.PI * 5 / 4, directionAnim),
    spread: Math.PI / 4,
    range: screenRadius,
})


var lights = [light0, light1, light2, light3, light4]

new FrameEngine(25, function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    walls.forEach(wall => wall.update())
    lights.forEach(light => light.update())

    ctx.save()
    ctx.globalAlpha = 0.4
    lights.forEach(light => light.draw(ctx, {rainbow: false}))
    ctx.restore()

    walls.forEach(wall =>
        wall.draw(ctx, {
            strokeStyle: getProperty(ctx, '--color-secondary'),
            lineWidth: 8,
        }),
    )

}).start()
