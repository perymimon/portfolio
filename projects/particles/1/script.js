import {setCanvas} from '../../_helpers/basic.js'

// setup
const canvas = document.getElementById("canvas1");
setCanvas(canvas);
const ctx = canvas.getContext("2d");

import {drawAlgebra} from '../../_helpers/draw.js'
import {distance, getAngle} from '../../_math/2D.math.js'
import {clamp, exceedsLimits} from '../../_math/basic.js'

class Particle {
    constructor (effect, index) {
        this.effect = effect
        this.index = index
        this.radius = Math.floor(1 + Math.random() * 10);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
        this.pushX = 0
        this.pushY = 0
        this.friction = 0.8
    }

    draw (ctx) {
        if(this.effect.mouse.pressed) {
            if (this.index % 5) {
                drawAlgebra.line(ctx, this, this.effect.mouse, {drawStroke: true})
            }
        }
        drawAlgebra.circle(ctx,this, this.radius, {drawFill:true})
    }

    update () {
        let {mouse} = this.effect
        if (mouse.pressed) {
            let dis = distance(mouse, this)
            if (dis < mouse.radius) {
                let force = 4*  mouse.radius / dis
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

    reset () {
        this.x = clamp(this.radius, this.x, this.effect.width)
        this.y = clamp(this.radius, this.y, this.effect.height)

        this.vx = Math.random() * 1 - .5
        this.vy = Math.random() * 1 - .5
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
        this.createParticles()

        this.resize(this.width, this.height);

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 120,
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
            this.particles.push(new Particle(this, i))
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
        var maxDistance = 100
        for (let a = 0; a < this.numberOfParticles; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let pa = this.particles[a]
                let pb = this.particles[b]
                let dis = distance(pa, pb)
                if (dis < maxDistance) {
                    ctx.save()
                    ctx.globalAlpha = 1 - dis / maxDistance;
                    drawAlgebra.line(ctx,pa,pb,{drawStroke:true})
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
        const gradient = ctx.createLinearGradient(0,0, 0, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'gold');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;
        this.particles.forEach((particle) => particle.reset())
    }

    reset () {

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
    if (m.pressed) {
        ctx.save()
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2, false);
        ctx.globalAlpha = 0.8;
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
    requestId =requestAnimationFrame(animation)
}

requestId =requestAnimationFrame(animation)
window.addEventListener("pageswap", (e) =>{
    cancelAnimationFrame(requestId)
})
