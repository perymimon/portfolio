import {drawAlgebra} from '../_helpers/draw.js'
import {distance, getAngle} from '../_math/algebra.js'
import {clamp, exceedsLimits, random} from '../_math/basic.js'

// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, 'darkblue');
gradient.addColorStop(0.5, 'white');
gradient.addColorStop(1, 'lightblue');

class Particle {
    constructor (effect) {
        this.effect = effect
        this.radius = random(5, 30)
        this.x =  random(this.radius, this.effect.width - this.radius * 2)
        this.y = random(this.radius, this.effect.height - this.radius * 2)
        this.pushX = 0
        this.pushY = 0
        this.friction = 0.99
    }
    reset () {
        this.vx = random(-1, -.1) * 0.8
        this.vy = 0
    }
    draw (ctx) {
        drawAlgebra.circle(ctx, this, this.radius, {drawFill: true})
    }
    resize(){
        this.x = clamp(this.radius, this.x, this.effect.width)
        this.y = clamp(this.radius, this.y, this.effect.height)
    }

    update () {
        let {mouse} = this.effect
        if (mouse.pressed) {
            let dis = distance(mouse, this)
            if (dis < mouse.radius) {
                let force = mouse.radius / dis
                let angle = getAngle(mouse, this)
                this.pushX = Math.cos(angle) * force
                this.pushY = Math.sin(angle) * force
            }
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


}

class Effect {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        var medianRadius = 30
        var canvasArea = Number(this.width) * Number(this.height)
        this.numberOfParticles = Math.floor(canvasArea / (4 * medianRadius ** 2))
        console.log('this.numberOfParticles', this.numberOfParticles)
        this.createParticles()
        this.maxDistance = 100
        this.resize(this.width, this.height);

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
    }

    createParticles () {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    handleParticles (ctx) {
        this.connectParticles(ctx)
        this.particles.forEach((particle) => {
            particle.update()
            particle.draw(ctx);
        })
    }

    connectParticles (ctx) {

        for (let a = 0; a < this.numberOfParticles; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let pa = this.particles[a]
                let pb = this.particles[b]
                let dis = distance(pa, pb)
                if (dis < this.maxDistance) {
                    ctx.save()
                    ctx.globalAlpha = 1 - dis / this.maxDistance;
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
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;
        this.particles.forEach((particle) => particle.resize())
    }
}

window.addEventListener('load', () => {
    const effect = new Effect(canvas);
    effect.handleParticles(ctx)

    function animation () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.handleParticles(ctx)

        /* draw circle */
        let m = effect.mouse
        if (m.pressed) {
            ctx.save()
            ctx.globalAlpha = 0.8;
            drawAlgebra.circle(ctx, m, m.radius, {drawFill: true, drawStroke: true})
            ctx.restore()
        }
        requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation)
})