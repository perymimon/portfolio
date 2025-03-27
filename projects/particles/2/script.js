import {setCanvas} from '../../../src/helpers/basic.js'
import {draw, drawAlgebra} from '../../../src/helpers/draw.js'
import {clamp, exceedsLimits, distance} from '../../../src/math/math.js'

// setup
const canvas = document.getElementById("canvas1");
setCanvas(canvas);
const ctx = canvas.getContext("2d");

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'pink');
gradient.addColorStop(0.5, 'red');
gradient.addColorStop(1, 'magenta');

class Particle {
    constructor (effect) {
        this.effect = effect
        this.radius = Math.floor(2 + Math.random() * 4);
        this.minRadius = this.radius
        this.maxRadius = this.radius * 7
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
        this.pushX = 0
        this.pushY = 0
        this.friction = 0.99
        this.alpha = 0

    }

    draw (ctx) {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = gradient
        drawAlgebra.circle(ctx, this, this.radius, {drawFill: true, drawStroke: true})

        ctx.fillStyle = 'white';
        draw.circle(ctx, this.x - this.radius * 0.2, this.y - this.radius * .2, this.radius * .6, {drawFill: true})
        ctx.restore()
    }

    update () {
        let {mouse} = this.effect

        let dis = distance(mouse, this)
        if (mouse.pressed && dis < mouse.radius) {
            if (this.radius < this.maxRadius) {
                this.alpha = 1
                this.radius += 2
            }
        } else {
            this.radius = clamp(this.minRadius, this.radius - .025, this.maxRadius)
            this.alpha = clamp(0, this.alpha * 0.99, 1)
        }

        this.x += this.vx + (this.pushX *= this.friction)
        this.y += this.vy + (this.pushY *= this.friction)
        let x = {min: this.radius, max: this.effect.width - this.radius}
        let y = {min: this.radius, max: this.effect.height - this.radius}
        if (exceedsLimits(x.min, this.x, x.max)) this.vx *= -1;
        if (exceedsLimits(y.min, this.y, y.max)) this.vy *= -1;

        this.x = clamp(x.min, this.x, x.max)
        this.y = clamp(y.min, this.y, y.max)
    }

    reset () {
        this.x = clamp(this.radius, this.x, this.effect.width)
        this.y = clamp(this.radius, this.y, this.effect.height)

        this.vx = Math.random() * .2 - .1
        this.vy = Math.random() * .2 - .1
    }
}

class Effect {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.numberOfParticles = 1000;
        this.createParticles()

        this.resize(this.width, this.height);

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 30,
        }

        window.addEventListener("resize", e => {
            let {innerWidth, innerHeight} = e.currentTarget;
            this.resize(innerWidth, innerHeight, this.ctx);
        });
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.x
            this.mouse.y = e.y
        })
        window.addEventListener("mousedown", e => this.mouse.pressed = true);
        window.addEventListener("mouseup", e => this.mouse.pressed = false);
    }

    createParticles () {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    handleParticles (ctx) {
        // this.connectParticles(ctx)
        this.particles.forEach((particle) => {
            particle.update()
            particle.draw(ctx);
        })
    }

    connectParticles (ctx) {
        var maxDistance = 100
        for (let a = 0; a < this.numberOfParticles; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let pa = this.particles[a]
                let pb = this.particles[b]
                let dis = distance(pa, pb)
                if (dis < maxDistance) {
                    ctx.save()
                    ctx.globalAlpha = 1 - dis / maxDistance;
                    drawAlgebra.line(ctx, pa, pb, {drawStroke: true})
                    ctx.restore()
                }
            }
        }
    }

    resize (width, height) {
        let {ctx} = this
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;

        ctx.fillStyle = gradient;
        ctx.lineWidth = 1;
        this.particles.forEach((particle) => particle.reset())
    }
}

const effect = new Effect(canvas);
effect.handleParticles(ctx)
var requestId = null

function animation () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx)

    /* draw circle */
    let m = effect.mouse
    // if (m.pressed) {
    //     ctx.save()
    //     ctx.globalAlpha = 0.5;
    //     drawAlgebra.circle(ctx, m, m.radius, {fillStyle:'white'})
    //     ctx.restore()
    // }
    requestId =requestAnimationFrame(animation)
}

requestId =requestAnimationFrame(animation)
window.addEventListener("pageswap", (e) =>{
    cancelAnimationFrame(requestId)
})
