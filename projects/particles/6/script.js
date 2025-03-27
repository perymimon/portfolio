import {drawAlgebra} from '../../../src/helpers/draw.js'
import {distance, clamp} from '../../../src/math/math.js'
import {rectCollision} from '../../../src/math/collision-detection.js'

// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, 'darkblue');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'pink');

class Particle {
    constructor (effect) {
        this.effect = effect
        this.radius = Math.floor(Math.random() * 7 + 3);
        this.gravity = this.radius * 0.001
        this.maxBounce = 2
        this.reset()
    }

    reset () {
        // when particle start it hide himself and the connection is attach to
        this.y = -this.radius - this.effect.maxDistance - Math.random() * this.effect.height * .2
        // this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
        this.x = this.effect.width / 2
        this.vy = 0
        this.vx = Math.random() * 2 - 1
        this.bounced = 0
        this.friction = 0.99
    }
    get top(){ return this.y - this.radius}
    get height(){ return this.radius * 2}
    get width(){ return this.radius * 2}
    get left(){ return this.x - this.radius}
    draw (ctx) {
        drawAlgebra.circle(ctx, this, this.radius, {drawFill: true})
    }

    update () {
        this.vy += this.gravity
        this.x += this.vx
        this.y += this.vy

        if (this.y > this.effect.height + this.radius + this.effect.maxDistance) {
            this.reset()
        }
        var {width, height, x, y} = this.effect.element
        if (rectCollision(
            {x, y, w: width, h: 5},
            {x:this.left, y:this.top, w: this.width, h: this.height}
        ) && this.bounced < this.maxBounce) {
            this.vy *= -.6
            this.bounced++
            this.vx *=1.1
            this.y = clamp(-Infinity, this.y, y - this.radius)
        }
    }

    resize () {
        this.x = clamp(this.radius, this.x, this.effect.width)
    }
}

class Effect {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.numberOfParticles = 300;
        this.maxDistance = 100
        this.createParticles()
        this.resize(this.width, this.height);

        this.debug = false

        console.log(this.element)

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 200,
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

        window.addEventListener("keydown", e => {
            if (e.key === 'd')
                this.debug = !this.debug
        })
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

        if (this.debug) {
            let {width, height, x, y} = this.element
            ctx.strokeRect(x, y, width, height)
        }
    }

    connectParticles (ctx) {
        var maxDistance = this.maxDistance
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
        this.element = document.getElementById("caption").getBoundingClientRect();
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;
        this.particles.forEach((particle) => particle.resize())
    }

}

const effect = new Effect(canvas);
effect.handleParticles(ctx)

var requestId = null
function animation () {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    effect.handleParticles(ctx)

    /* draw circle */
    let m = effect.mouse
    if (m.pressed) {
        ctx.save()
        ctx.globalAlpha = 0.8;
        drawAlgebra.circle(ctx, m, m.radius, {drawFill: true, drawStroke: true})
        ctx.restore()
    }
    requestId =requestAnimationFrame(animation)
}

requestId = requestAnimationFrame(animation)

window.addEventListener("pageswap", (e) =>{
    cancelAnimationFrame(requestId)
})
