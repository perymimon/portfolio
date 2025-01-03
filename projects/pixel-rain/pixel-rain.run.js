import {getProperty, waitFor} from '../../helpers/basic.js'
import {getBrightnessMap} from '../../helpers/color.js'
import {draw} from '../../helpers/draw.js'
import {FrameEngine} from '../../helpers/FrameEngine.js'
import {random} from '../../math/basic.js'

var image = new Image()
image.src = './hacker2.webp'
await waitFor('load', image)


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = image.width;
canvas.height = image.height;


class ParticleFall {
    constructor (x = random(0, canvas.width), y = random(0, canvas.height)) {
        this.x = x
        this.y = y
        this.speed = 0
        this.velocity = random(0, .5, false)
        this.size = random(1, 2.5, false)
    }

    update () {
        this.speed += this.velocity
        this.y += this.speed
        if (this.y >= canvas.height) {
            this.y = 0
            this.speed = 0
            this.x = random(0, canvas.width)
        }
    }

    draw (ctx) {
        ctx.fillStyle = getProperty(ctx, '--text-primary')
        draw.circle(ctx, this.x, this.y, this.size, {drawFill: true})
    }

}

class RainEffect {
    constructor (canvas, image, speed = 5, columnDivider = 80) {
        const {min} = Math
        this.brightMap = getBrightnessMap(image);
        this.speed = speed
        this.numberOfParticles = min(canvas.width, image.width) * min(canvas.height, image.height) / columnDivider;
        this.resize(canvas.width, canvas.height)
        this.init()
    }

    init () {
        this.particlesArray = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            let x = i % this.width
            this.particlesArray.push(new ParticleFall(x))
        }
    }

    resize (width, height) {
        this.width = width
        this.height = height
        this.init()
    }

    update () {
        const {floor} = Math
        const {width, height, data} = this.brightMap
        this.particlesArray.forEach(particle => {
            let x = floor(particle.x)
            let y = floor(particle.y)
            let b = data[(y * width + x) * 4]
            particle.speed = (1 - b / 255) * this.speed
            particle.update()
        })
    }

    draw (ctx) {
        // ctx.putImageData(this.brightMap, 0, 0)
        ctx.globalAlpha = .05
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.width, this.height)
        for (let p of this.particlesArray) {
            p.draw(ctx)
        }
    }

}

var effect1 = new RainEffect(canvas, image, 3)
var fps = 60
var framesEngine = new FrameEngine(fps)
Array(1000).fill(0).forEach((_, i) => effect1.update())
framesEngine.addEventListener('frames', e => {
    effect1.update()
    effect1.draw(ctx)
})

function animation (timeStamp) {
    framesEngine.updateFrame(timeStamp)
    requestAnimationFrame(animation)
}

window.requestAnimationFrame(animation);
// window.addEventListener('resize', event => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     effect1.resize(canvas.width, canvas.height)
//     effect2.resize(canvas.width, canvas.height)
//     effect3.resize(canvas.width, canvas.height)
// })
//
// const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
//
// // recommended method for newer browsers: specify event-type as first argument
// darkModePreference.addEventListener("change", e => {
//     gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
//     gradient.addColorStop(0, getProperty(ctx, '--color-char'));
// });